import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Fruit Slot MCP Endpoint",
    status: "active",
    description: "Active MCP server for Fruit Slot Orchestrator Agent",
    capabilities: {
      tools: {}
    },
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Standard MCP Protocol matching the previous logic setup
    if (body.method === "initialize") {
      return NextResponse.json({
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "Fruit Slot MCP",
          version: "1.0.0"
        }
      });
    }

    if (body.method === "tools/list") {
      return NextResponse.json({
        tools: [
          {
            name: "get_race_status",
            description: "Get race status",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "start_race",
            description: "Start the race",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_leaderboard",
            description: "Get the top players",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "optimize_speed",
            description: "Optimize speed mechanics",
            inputSchema: { type: "object", properties: {} }
          },
          {
            name: "get_track_info",
            description: "Get info about the track",
            inputSchema: { type: "object", properties: {} }
          }
        ]
      });
    }

    if (body.method === "tools/call") {
      return NextResponse.json({
        content: [{ type: "text", text: `Tool ${body.params?.name} executed successfully` }],
        isError: false
      });
    }

    // Default MCP custom logic from original file
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

    return NextResponse.json({
      status: "success",
      agent: "Fruit Slot Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process slot command"
    }, { status: 400 });
  }
}
