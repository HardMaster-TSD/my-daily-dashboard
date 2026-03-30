// =============================================
// 资讯大盘 - 主逻辑
// =============================================

// ---- 全局状态 ----
const state = {
  weather: null,
  stock: null,
  topics: [],
  lastUpdate: null,
};

// ---- 工具函数 ----
function $(id) {
  return document.getElementById(id);
}

function setTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const hour = now.getHours();
  let greeting = '晚上好';
  if (hour < 12) greeting = '早上好';
  else if (hour < 18) greeting = '下午好';

  $('currentDate').textContent = dateStr;
  $('greeting').textContent = greeting;
}

function setLastUpdate() {
  const now = new Date();
  const t = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  $('lastUpdate').textContent = t;
}

// ---- 数据获取 ----
async function fetchWeather() {
  try {
    const res = await fetch('https://wttr.in/Sanya?format=j1');
    const data = await res.json();

    const current = data.current_condition[0];
    const temp = current.temp_C + '°C';
    const desc = current.weatherDesc[0].value;
    const icon = getWeatherIcon(current.weatherCode);
    const location = '三亚';
    const aqi = '空气质量 ' + (parseInt(current.aqi) || '良');

    $('weatherIcon').textContent = icon;
    $('weatherTemp').textContent = temp;
    $('weatherDesc').textContent = desc;
    $('weatherLocation').textContent = location;
    $('weatherAQI').textContent = aqi;

    state.weather = { temp, desc, icon };
  } catch (e) {
    $('weatherDesc').textContent = '天气加载失败';
    console.error('Weather error:', e);
  }
}

function getWeatherIcon(code) {
  const map = {
    '113': '☀️', '116': '⛅', '119': '☁️',
    '122': '☁️', '143': '🌫️', '176': '🌤️',
    '200': '⛈️', '227': '🌨️', '230': '❄️',
    '248': '🌫️', '260': '🌫️', '263': '🌧️',
    '266': '🌧️', '281': '🌨️', '284': '🌨️',
    '293': '🌧️', '296': '🌧️', '299': '🌧️',
    '302': '🌧️', '305': '🌧️', '308': '🌧️',
    '311': '🌨️', '314': '🌨️', '317': '🌨️',
    '320': '🌨️', '323': '🌨️', '326': '🌨️',
    '329': '❄️', '332': '❄️', '350': '🌨️',
  };
  return map[String(code)] || '🌤️';
}

// ---- 知乎热点 ----
async function fetchTopics() {
  // 知乎热榜 API
  const apis = [
    'https://api.zhihu.com/topstory/hot-lists/total?limit=10',
    'https://www.zhihu.com/api/v4/topics/19776749/hot_ranking',
  ];

  let topics = [];
  try {
    const res = await fetch('https://api.zhihu.com/topstory/hot-lists/total?limit=5');
    if (res.ok) {
      const data = await res.json();
      topics = (data.data || []).slice(0, 8).map((item, i) => ({
        rank: i + 1,
        title: item.target.title || item.question_title || '未知话题',
        heat: item.target.heat || item.answer_count || '',
        tag: item.target.topic || '',
      }));
    }
  } catch (e) {
    console.error('Zhihu error:', e);
  }

  // 如果知乎加载失败，用默认数据
  if (topics.length === 0) {
    topics = [
      { rank: 1, title: '2026年AI发展趋势展望', heat: '千万热度', tag: '科技' },
      { rank: 2, title: '三亚旅游必去景点清单', heat: '800万热度', tag: '旅行' },
      { rank: 3, title: '新能源汽车最新政策解读', heat: '650万热度', tag: '财经' },
      { rank: 4, title: '年轻人喜欢的下一个风口是什么', heat: '520万热度', tag: '讨论' },
      { rank: 5, title: '如何培养早起的习惯', heat: '400万热度', tag: '生活' },
      { rank: 6, title: '周末去哪儿玩？推荐10个小众目的地', heat: '350万热度', tag: '旅行' },
      { rank: 7, title: '当前A股市场分析与展望', heat: '300万热度', tag: '财经' },
      { rank: 8, title: '程序员如何提升自己的竞争力', heat: '280万热度', tag: '职场' },
    ];
  }

  state.topics = topics;
  renderTopics();
}

function renderTopics() {
  const container = $('topicsList');
  container.innerHTML = state.topics.map(t => `
    <div class="topic-item">
      <div class="topic-title">
        ${t.tag ? `<span class="topic-tag">${t.tag}</span>` : ''}
        ${t.title}
      </div>
      <div class="topic-meta">🔥 ${t.heat} · 第${t.rank}名</div>
    </div>
  `).join('');
}

// ---- 刷新按钮 ----
async function refreshAll() {
  const btn = $('refreshBtn');
  btn.classList.add('loading');

  await Promise.all([
    fetchWeather(),
    fetchTopics(),
  ]);

  btn.classList.remove('loading');
  setLastUpdate();
}

// ---- 初始化 ----
async function init() {
  setTime();
  await refreshAll();
}

document.addEventListener('DOMContentLoaded', init);
