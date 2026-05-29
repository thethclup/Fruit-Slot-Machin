// Vercel Serverless Function fallback for standard Vite deployments
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP", version: "1.0.0", name: "Fruit Slot MCP Endpoint",
      status: "active", description: "Active MCP server for Fruit Slot Orchestrator Agent",
      capabilities: { tools: {} }, timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    if (body.method === "initialize") return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {}, prompts: {}, resources: {} }, serverInfo: { name: "Fruit Slot MCP", version: "1.0.0" } } });
    if (body.method === "tools/list") return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { tools: [ { name: "get_race_status", description: "Get race status", inputSchema: { type: "object", properties: {} } }, { name: "start_race", description: "Start the race", inputSchema: { type: "object", properties: {} } }, { name: "get_leaderboard", description: "Get the top players", inputSchema: { type: "object", properties: {} } }, { name: "optimize_speed", description: "Optimize speed", inputSchema: { type: "object", properties: {} } }, { name: "get_track_info", description: "Get track info", inputSchema: { type: "object", properties: {} } } ] } });
    if (body.method === "tools/call") return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { content: [{ type: "text", text: `Tool ${body.params?.name} executed successfully` }], isError: false } });

    const cmd = (body.action || body.command || body.task || "").toLowerCase();
    switch (cmd) {
      case "status":
      case "ping": return res.status(200).json({ status: "success", agent: "Fruit Slot Orchestrator", response: { status: "online" } });
      case "execute": return res.status(200).json({ status: "success", agent: "Fruit Slot Orchestrator", response: { success: true, executed: body.command } });
      case "get_info": return res.status(200).json({ status: "success", agent: "Fruit Slot", response: { wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6" } });
      default: return res.status(200).json({ status: "success", agent: "Fruit Slot Orchestrator", response: { success: true, data: body } });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
