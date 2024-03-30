import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: any }) {
  return NextResponse.json({ data: [] }, { status: 400 });
}
// 500 200 201 404 403 401 400
export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
