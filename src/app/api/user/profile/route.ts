import { NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api-auth";

export async function GET() {
  try {
    const authResult = await requireApiAuth();
    
    if ('error' in authResult) {
      return Response.json({ error: authResult.error }, { status: 401 });
    }

    const { user } = authResult;
    
    return Response.json({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      user_metadata: user.user_metadata,
    });
  } catch (err: any) {
    return Response.json({ 
      error: "Unexpected error", 
      details: String(err?.message || err) 
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
    const body = await req.json().catch(() => ({}));
    
    // Here you would update user profile data
    // For now, just return the current user data
    return Response.json({
      message: "Profile update not implemented yet",
      user: {
        id: user.id,
        email: user.email,
      }
    });
  } catch (err: any) {
    return Response.json({ 
      error: "Unexpected error", 
      details: String(err?.message || err) 
    }, { status: 500 });
  }
}