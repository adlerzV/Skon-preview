import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/graphql";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`blog-posts:${ip}`, { max: 60, windowMs: 60 * 1000 })) {
    return NextResponse.json({ error: "تعداد درخواست بیش از حد مجاز است" }, { status: 429 });
  }

  const search = request.nextUrl.searchParams.get("q") || undefined;
  const after = request.nextUrl.searchParams.get("after") || undefined;

  const result = await getAllBlogPosts({ search, after });
  return NextResponse.json(result);
}