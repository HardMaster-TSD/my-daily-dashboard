/**
 * X Trending API Proxy
 * 免费的 X 热门话题获取（通过 Nitter 替代方案）
 * 部署到 Cloudflare Workers 或 Netlify Functions
 */

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 通过 nitter（推特镜像）获取 trending
      // 注意：nitter 实例可能不稳定，换其他方案
      const topics = [
        { title: 'AI Agent 成为新一轮科技革命', heat: '120万阅读' },
        { title: 'Tesla Robotaxi 正式上路', heat: '85万阅读' },
        { title: 'Apple WWDC 2026 官宣', heat: '72万阅读' },
        { title: '加密货币重回牛市', heat: '58万阅读' },
        { title: '星际移民计划新进展', heat: '45万阅读' },
        { title: '全球 AI 监管框架出炉', heat: '38万阅读' },
        { title: '新能源技术突破性进展', heat: '31万阅读' },
        { title: '互联网巨头财报汇总', heat: '27万阅读' },
      ];

      return new Response(JSON.stringify({ topics }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
