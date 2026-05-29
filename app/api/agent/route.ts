import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Fruit Slot Orchestrator - Agent Info Endpoint
 * 
 * Bu endpoint, agent'in temel kimlik ve durum bilgilerini sağlar.
 * ERC-8004 uyumlu keşif ve doğrulama için kullanılır.
 */

export async function GET() {
  return NextResponse.json({
    name: "Fruit Slot Orchestrator",
    description: "Smart slot machine and reward orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Fruit Slot",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  }, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent POST route ready",
      received: body
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process agent request"
    }, { status: 400, headers: corsHeaders });
  }
}
