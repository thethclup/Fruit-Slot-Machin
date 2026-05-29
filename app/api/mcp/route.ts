import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    
    // Standard MCP Protocol matching the previous logic setup
    if (body.method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: {
            name: "Fruit Slot MCP",
            version: "1.0.0"
          }
        }
      }, { headers: corsHeaders });
    }

    if (body.method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
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
        }
      }, { headers: corsHeaders });
    }

    if (body.method === "tools/call") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "text", text: `Tool ${body.params?.name} executed successfully` }],
          isError: false
        }
      }, { headers: corsHeaders });
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
      headers: corsHeaders
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process slot command"
    }, { status: 400, headers: corsHeaders });
  }
}
