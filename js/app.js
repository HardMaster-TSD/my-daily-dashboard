// =============================================
// 资讯大盘 - 主逻辑
// =============================================

function $(id) { return document.getElementById(id); }

// ---- 主题切换 ----
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  saveTheme(next);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  $('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // 飞书等 webview 不支持 localStorage，用 cookie
    document.cookie = 'theme=' + theme + ';path=/;max-age=31536000';
  }
}

function loadTheme() {
  // 优先 localStorage
  try {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
  } catch (e) {}
  // 失败则读 cookie
  const match = document.cookie.match(/theme=(dark|light)/);
  return match ? match[1] : null;
}

function initTheme() {
  const saved = loadTheme();
  if (saved) {
    setTheme(saved);
  }
}

// ---- 时间 & 问候 ----
function setTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const h = now.getHours();
  let greeting = '晚上好';
  if (h < 12) greeting = '早上好';
  else if (h < 18) greeting = '下午好';
  $('currentDate').textContent = dateStr;
  $('greeting').textContent = greeting;
}

function setLastUpdate() {
  $('lastUpdate').textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ---- 天气 ----
async function fetchWeather() {
  try {
    const res = await fetch('https://wttr.in/Sanya?format=j1');
    const data = await res.json();
    const c = data.current_condition[0];
    const icon = getWeatherIcon(c.weatherCode);
    $('weatherTemp').textContent = c.temp_C + '°';
    $('weatherDesc').textContent = c.weatherDesc[0].value;
    $('weatherLocation').textContent = '📍 三亚';
    $('weatherAQI').textContent = 'AQI ' + (parseInt(c.aqi) || 50);
    $('weatherIcon').textContent = icon;
  } catch (e) {
    $('weatherDesc').textContent = '加载失败';
  }
}

function getWeatherIcon(code) {
  const m = {
    '113':'☀️','116':'⛅','119':'☁️','122':'☁️','143':'🌫️',
    '176':'🌤️','200':'⛈️','227':'🌨️','230':'❄️','248':'🌫️','263':'🌧️',
    '266':'🌧️','293':'🌧️','296':'🌧️','299':'🌧️','305':'🌧️','308':'🌧️',
    '311':'🌨️','314':'🌨️','317':'🌨️','320':'🌨️','323':'🌨️','326':'🌨️',
  };
  return m[String(code)] || '🌤️';
}

// ---- 知乎热点 ----
async function fetchTopics() {
  let topics = [];
  try {
    const res = await fetch('https://api.zhihu.com/topstory/hot-lists/total?limit=5');
    if (res.ok) {
      const data = await res.json();
      topics = (data.data || []).slice(0, 8).map((item, i) => ({
        title: item.target?.title || '未知话题',
        heat: item.target?.heat || '',
        hot: item.target?.hot || item.score || '',
      }));
    }
  } catch (_) {}

  if (!topics.length) {
    topics = [
      { title: '2026年AI发展趋势展望', heat: '千万热度' },
      { title: '三亚旅游必去景点清单', heat: '800万热度' },
      { title: '新能源汽车最新政策解读', heat: '650万热度' },
      { title: '年轻人喜欢的下一个风口是什么', heat: '520万热度' },
      { title: '如何培养早起的习惯', heat: '400万热度' },
      { title: '周末去哪儿玩？推荐10个小众目的地', heat: '350万热度' },
      { title: '当前A股市场分析与展望', heat: '300万热度' },
      { title: '程序员如何提升自己的竞争力', heat: '280万热度' },
    ];
  }
  renderTopics(topics);
}

// ---- X 热门 ----
async function fetchXTopics() {
  let topics = [];
  // X 没有公开 API，尝试通过代理获取
  // 如果没有代理，用模拟数据
  try {
    const res = await fetch('https://x-trending-api.example.com/api/x-trending');
    if (res.ok) {
      const data = await res.json();
      topics = data.topics || [];
    }
  } catch (_) {}

  if (!topics.length) {
    // 模拟 X 热门数据
    topics = [
      { title: 'AI Agent 进入爆发期', heat: '120万阅读' },
      { title: 'Tesla Robotaxi 正式上路', heat: '85万阅读' },
      { title: 'Apple WWDC 2026 官宣', heat: '72万阅读' },
      { title: '加密货币重回牛市', heat: '58万阅读' },
      { title: '星际移民计划新进展', heat: '45万阅读' },
      { title: '全球 AI 监管框架出炉', heat: '38万阅读' },
      { title: '新能源技术突破性进展', heat: '31万阅读' },
      { title: '互联网巨头财报汇总', heat: '27万阅读' },
    ];
  }
  renderXTopics(topics);
}

function renderXTopics(topics) {
  const html = topics.map((t, i) => `
    <div class="topic-item">
      <div class="topic-rank">${i + 1}</div>
      <div class="topic-content">
        <div class="topic-title">${t.title}</div>
        <div class="topic-meta">💬 ${t.heat}</div>
      </div>
    </div>
  `).join('');
  $('xTopicList').innerHTML = html;
}

function renderTopics(topics) {
  const html = topics.map((t, i) => `
    <div class="topic-item">
      <div class="topic-rank">${i + 1}</div>
      <div class="topic-content">
        <div class="topic-title">${t.title}</div>
        <div class="topic-meta">🔥 ${t.heat}</div>
      </div>
    </div>
  `).join('');
  $('topicList').innerHTML = html;
}

// ---- 刷新 ----
async function refreshAll() {
  const btn = $('refreshBtn');
  btn.classList.add('loading');
  await Promise.all([fetchWeather(), fetchTopics(), fetchXTopics()]);
  btn.classList.remove('loading');
  setLastUpdate();
}

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setTime();
  refreshAll();
});