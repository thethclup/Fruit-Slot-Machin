// Vercel Serverless Function fallback for standard Vite deployments
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Fruit Slot Orchestrator",
      description: "Smart slot machine and reward orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Fruit Slot",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  }
  
  if (req.method === 'POST') {
    const body = req.body || {};
    return res.status(200).json({
      status: "success",
      message: "Agent POST route ready",
      received: body
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
