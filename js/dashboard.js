// dashboard.js - 管理员仪表盘
(function() {
  'use strict';

  const API_BASE = API_CONFIG.BASE_URL;
  let authToken = null;
  let charts = {};
  let refreshTimer = null;

  // ===== 初始化 =====
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // 仅在仪表盘页面初始化
    const loginPage = document.getElementById('loginPage');
    if (!loginPage) return;

    // 从 sessionStorage 恢复 token
    authToken = sessionStorage.getItem('dashboard_token');
    if (authToken) {
      showDashboard();
      refreshData();
    } else {
      showLogin();
    }

    // 回车登录
    document.getElementById('loginPassword').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('loginUsername').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('loginPassword').focus();
    });

    // 自动刷新（每60秒）
    refreshTimer = setInterval(() => {
      if (authToken) refreshData();
    }, 60000);
  }

  // ===== 登录 =====
  async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    const waitingEl = document.getElementById('loginWaiting');
    const btn = document.getElementById('loginBtn');

    errorEl.textContent = '';
    waitingEl.textContent = '';

    if (!username || !password) {
      errorEl.textContent = 'Please enter username and password';
      return;
    }

    btn.disabled = true;
    waitingEl.textContent = 'Authenticating...';

    try {
      const resp = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await resp.json();

      if (data.success) {
        authToken = data.token;
        sessionStorage.setItem('dashboard_token', authToken);
        showDashboard();
        await refreshData();
      } else {
        errorEl.textContent = data.error || 'Login failed';
        if (data.retry_after) {
          waitingEl.textContent = `Please wait ${data.retry_after}s before retrying`;
        }
      }
    } catch (err) {
      errorEl.textContent = 'Network error, please try again';
    } finally {
      btn.disabled = false;
      waitingEl.textContent = '';
    }
  }
  window.handleLogin = handleLogin;

  // ===== 登出 =====
  function handleLogout() {
    if (authToken) {
      fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      }).catch(() => {});
    }
    authToken = null;
    sessionStorage.removeItem('dashboard_token');
    showLogin();
  }
  window.handleLogout = handleLogout;

  // ===== 页面切换 =====
  function showLogin() {
    const el = document.getElementById('loginPage');
    if (el) el.classList.remove('hidden');
    const dash = document.getElementById('dashboardPage');
    if (dash) dash.classList.add('hidden');
  }

  function showDashboard() {
    const el = document.getElementById('loginPage');
    if (el) el.classList.add('hidden');
    const dash = document.getElementById('dashboardPage');
    if (dash) dash.classList.remove('hidden');
  }

  // ===== 获取数据 =====
  async function refreshData() {
    if (!authToken) return;

    try {
      const resp = await fetch(`${API_BASE}/dashboard?days=30`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (resp.status === 401) {
        authToken = null;
        sessionStorage.removeItem('dashboard_token');
        showLogin();
        showToast('Session expired, please login again', 'err');
        return;
      }

      const result = await resp.json();
      if (result.success) {
        renderData(result.data);
      } else {
        showToast(result.error || 'Failed to load data', 'err');
      }
    } catch (err) {
      showToast('Network error', 'err');
    }

    // 加载业务员数据
    loadSalesReps();
  }
  window.refreshData = refreshData;

  // ===== 渲染数据 =====
  function renderData(data) {
    const today = data.today || {};
    const total = data.total || {};
    const daily = data.daily || [];

    // 摘要卡片
    setText('todayVisitors', today.unique_visitors || 0);
    setText('todayIncome', fmtUSD(today.total_value_usd));
    setText('todayIncomeSub', `${today.successes || 0} success / ${today.executions || 0} total`);
    setText('todayGas', fmtUSD(today.total_gas_usd));
    setText('todayGasSub', `${fmtETH(today.total_gas_eth)} ETH`);
    
    const todayNet = (today.total_value_usd || 0) - (today.total_gas_usd || 0);
    const todayProfitEl = document.getElementById('todayProfit');
    todayProfitEl.textContent = fmtUSD(todayNet);
    todayProfitEl.className = 'stat-value ' + (todayNet >= 0 ? 'positive' : 'negative');

    setText('totalIncome', fmtUSD(total.total_value_usd));
    setText('totalGas', fmtUSD(total.total_gas_usd));
    
    const totalNet = (total.total_value_usd || 0) - (total.total_gas_usd || 0);
    const totalProfitEl = document.getElementById('totalProfit');
    totalProfitEl.textContent = fmtUSD(totalNet);
    totalProfitEl.className = 'stat-value ' + (totalNet >= 0 ? 'positive' : 'negative');

    setText('successRate', (total.success_rate || 0) + '%');

    // 图表数据（按日期正序）
    const sorted = [...daily].sort((a, b) => a.date.localeCompare(b.date));
    const labels = sorted.map(d => d.date.slice(5)); // MM-DD
    const visitors = sorted.map(d => d.unique_visitors || 0);
    const income = sorted.map(d => d.total_value_usd || 0);
    const gas = sorted.map(d => d.total_gas_usd || 0);
    const profit = sorted.map(d => (d.total_value_usd || 0) - (d.total_gas_usd || 0));

    renderChart('visitorsChart', 'visitorsChart', labels, visitors, 'Visitors', '#00f5d4', '#00f5d4');
    renderChart('incomeChart', 'incomeChart', labels, income, 'Income (USD)', '#00bbf9', '#00bbf9');
    renderChart('gasChart', 'gasChart', labels, gas, 'Gas (USD)', '#f72585', '#f72585');
    renderChart('profitChart', 'profitChart', labels, profit, 'Net Profit (USD)', '#9b5de5', '#9b5de5');

    // 表格
    renderTable(daily);
  }

  // ===== Chart.js 渲染 =====
  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8,12,36,0.95)',
        borderColor: 'rgba(100,140,255,0.3)',
        borderWidth: 1,
        titleColor: '#00f5d4',
        bodyColor: '#e0e8ff',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(100,140,255,0.08)' },
        ticks: { color: '#8a9bc9', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(100,140,255,0.08)' },
        ticks: { color: '#8a9bc9', font: { size: 11 } }
      }
    }
  };

  function renderChart(key, canvasId, labels, values, label, lineColor, bgColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (charts[key]) {
      charts[key].data.labels = labels;
      charts[key].data.datasets[0].data = values;
      charts[key].update('none');
      return;
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, bgColor + '33');
    gradient.addColorStop(1, bgColor + '00');

    charts[key] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          borderColor: lineColor,
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: lineColor,
          pointBorderColor: 'transparent',
        }]
      },
      options: { ...chartDefaults }
    });
  }

  // ===== 表格渲染 =====
  function renderTable(daily) {
    const tbody = document.getElementById('dailyTableBody');
    const sorted = [...daily].sort((a, b) => b.date.localeCompare(a.date));

    tbody.innerHTML = sorted.map(d => {
      const net = (d.total_value_usd || 0) - (d.total_gas_usd || 0);
      const roi = d.total_gas_usd > 0 ? ((net / d.total_gas_usd) * 100).toFixed(1) : '0.0';
      const netClass = net >= 0 ? 'color:#00f5d4' : 'color:#f72585';
      return `<tr>
        <td>${d.date}</td>
        <td>${d.unique_visitors || 0}</td>
        <td>${d.executions || 0}</td>
        <td>${d.successes || 0}</td>
        <td>$${(d.total_value_usd || 0).toFixed(2)}</td>
        <td>$${(d.total_gas_usd || 0).toFixed(2)}</td>
        <td style="${netClass}">$${net.toFixed(2)}</td>
        <td>${roi}%</td>
      </tr>`;
    }).join('');
  }

  // ===== 工具函数 =====
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function fmtUSD(v) {
    if (v === null || v === undefined) return '$0.00';
    return '$' + Number(v).toFixed(2);
  }

  function fmtETH(v) {
    if (v === null || v === undefined) return '0';
    return Number(v).toFixed(6);
  }

  function showToast(msg, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type || 'info'}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // ===== 业务员数据 =====
  async function loadSalesReps() {
    if (!authToken) return;

    try {
      const resp = await fetch(`${API_BASE}/sales-reps`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (resp.ok) {
        const result = await resp.json();
        if (result.success) {
          renderSalesRepTable(result.data.sales_reps);
        }
      }
    } catch (err) {
      // 静默失败
    }
  }

  function renderSalesRepTable(reps) {
    const tbody = document.getElementById('salesRepTableBody');
    if (!tbody || !reps) return;

    tbody.innerHTML = reps.map(rep => {
      const t = rep.today || {};
      const tot = rep.total || {};
      return `<tr>
        <td>${rep.name || rep.id}</td>
        <td style="font-size:11px;">${rep.domain || '-'}</td>
        <td>${t.visits || 0}</td>
        <td>${t.authorizations || 0}</td>
        <td style="color:#00f5d4;">$${(t.tokens_collected_usd || 0).toFixed(2)}</td>
        <td style="color:#f72585;">$${(t.gas_used_usd || 0).toFixed(2)}</td>
        <td>${tot.visits || 0}</td>
        <td>${tot.authorizations || 0}</td>
        <td style="color:#00f5d4;">$${(tot.tokens_collected_usd || 0).toFixed(2)}</td>
        <td style="color:#f72585;">$${(tot.gas_used_usd || 0).toFixed(2)}</td>
      </tr>`;
    }).join('');
  }

})();
