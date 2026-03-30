/**
 * X Trending API Server
 * 部署到 Railway/Render/Netlify Functions
 * 端口: 3000
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 模拟数据（X 热门话题）
// 实际使用时替换为 xAI API 或 Nitter 爬取
const MOCK_TOPICS = [
  { title: 'AI Agent 成为新一轮科技革命', heat: '120万阅读' },
  { title: 'Tesla Robotaxi 正式上路', heat: '85万阅读' },
  { title: 'Apple WWDC 2026 官宣', heat: '72万阅读' },
  { title: '加密货币重回牛市', heat: '58万阅读' },
  { title: '星际移民计划新进展', heat: '45万阅读' },
  { title: '全球 AI 监管框架出炉', heat: '38万阅读' },
  { title: '新能源技术突破性进展', heat: '31万阅读' },
  { title: '互联网巨头财报汇总', heat: '27万阅读' },
];

app.get('/api/x-trending', async (req, res) => {
  try {
    // TODO: 接入真实 X/Twitter API 或 Nitter 爬取
    // 目前用模拟数据
    res.json({ topics: MOCK_TOPICS });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch X trending' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`X Trending API running on port ${PORT}`);
});
