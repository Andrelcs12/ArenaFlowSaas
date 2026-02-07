import { NextResponse } from "next/server";
import { TenantService } from "../services/tenant.service";

export async function POST(req: Request) {
  const body = await req.json();
  const tenant = await TenantService.create(body);
  return NextResponse.json(tenant);
}

export async function GET() {
  const tenants = await TenantService.getAll();
  return NextResponse.json(tenants);
}

