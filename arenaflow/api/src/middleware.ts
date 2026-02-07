import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Usamos 'jose' no middleware porque o NextJS roda em Edge Runtime

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export async function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  // Se estiver tentando acessar rotas de API protegidas
  if (req.nextUrl.pathname.startsWith("/api/bookings") || req.nextUrl.pathname.startsWith("/api/courts")) {
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
      // Verifica o JWT
      const { payload } = await jwtVerify(token, SECRET);
      
      // Validação Multi-tenant: Se o tenant do token for diferente do tenant da requisição
      const tenantHeader = req.headers.get("x-tenant-id");
      if (tenantHeader && payload.tenantId !== tenantHeader && payload.role !== "ADMIN") {
        return NextResponse.json({ error: "Você não pertence a esta arena" }, { status: 403 });
      }

      return NextResponse.next();
    } catch (e) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/bookings/:path*", "/api/courts/:path*"],
};