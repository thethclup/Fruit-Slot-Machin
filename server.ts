import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // GET /api/mcp
  app.get('/api/mcp', (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Fruit Slot MCP Endpoint",
      status: "active",
      description: "Active MCP server for Fruit Slot Orchestrator Agent",
      capabilities: ["slot-machine-mechanics", "fruit-combination-logic", "reward-optimization"],
      timestamp: new Date().toISOString()
    });
  });

    // POST /api/mcp
  app.post('/api/mcp', (req, res) => {
    try {
      const body = req.body || {};
      
      if (body.method === "initialize") return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {}, prompts: {}, resources: {} }, serverInfo: { name: "Fruit Slot MCP", version: "1.0.0" } } });
      if (body.method === "tools/list") return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { tools: [ { name: "get_race_status", description: "Get race status", inputSchema: { type: "object", properties: {} } }, { name: "start_race", description: "Start the race", inputSchema: { type: "object", properties: {} } }, { name: "get_leaderboard", description: "Get the top players", inputSchema: { type: "object", properties: {} } }, { name: "optimize_speed", description: "Optimize speed", inputSchema: { type: "object", properties: {} } }, { name: "get_track_info", description: "Get track info", inputSchema: { type: "object", properties: {} } } ] } });
      if (body.method === "tools/call") return res.status(200).json({ jsonrpc: "2.0", id: body.id, result: { content: [{ type: "text", text: `Tool ${body.params?.name} executed successfully` }], isError: false } });

      const { action, command, params, task } = body;

      const cmd = (action || command || task || "").toLowerCase();

      let result: any = {};

      switch (cmd) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Fruit Slot Orchestrator",
            message: "Reels are spinning - Ready to play!" 
          };
          break;

        case "execute":
          result = {
            success: true,
            executed: params || command,
            executedAt: new Date().toISOString(),
            message: "Spin command executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Fruit Slot Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: body
          };
      }

      res.json({
        status: "success",
        agent: "Fruit Slot Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process slot command"
      });
    }
  });

  // GET /api/agent
  app.get('/api/agent', (req, res) => {
    res.json({
      name: "Fruit Slot Orchestrator",
      description: "Smart slot machine and reward orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Fruit Slot",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
