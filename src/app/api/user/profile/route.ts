import { NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api-auth";
import type { AuthUser } from "@/lib/auth/types";

export async function GET() {
  try {
    const authResult = await requireApiAuth();
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 });
    }

    const { user } = authResult;
    const authUser = user as AuthUser;
    
    return Response.json({
      id: authUser.id,
      email: authUser.email,
      created_at: authUser.created_at,
      user_metadata: authUser.user_metadata,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ 
      error: "Unexpected error", 
      details: message 
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireApiAuth();
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 });
    }

    const { user } = authResult;
    const authUser = user as AuthUser;
    await req.json().catch(() => ({}));
    
    // Here you would update user profile data
    // For now, just return the current user data
    return Response.json({
      message: "Profile update not implemented yet",
      user: {
        id: authUser.id,
        email: authUser.email,
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ 
      error: "Unexpected error", 
      details: message 
    }, { status: 500 });
  }
}
