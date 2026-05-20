// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret');

    if (secret !== process.env.REVALIDATION_SECRET) {
      console.warn('⚠️ تلاش ناموفق برای پاک کردن کش: توکن نامعتبر است.');
      return NextResponse.json(
        { message: 'غیرمجاز: توکن نامعتبر است' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const tag = body.tag;

    if (!tag) {
      return NextResponse.json(
        { message: 'تگ ارسال نشده است' }, 
        { status: 400 }
      );
    }

    revalidateTag(tag);

    console.log(`✅ کش Next.js برای تگ [${tag}] با موفقیت پاک شد.`);

    return NextResponse.json({ 
      revalidated: true, 
      tag: tag,
      message: `کش برای تگ ${tag} با موفقیت پاک شد.`,
      now: Date.now() 
    });

  } catch (error) {
    console.error('❌ خطای سرور در عملیات پاکسازی کش:', error);
    return NextResponse.json(
      { message: 'خطای سرور در عملیات Revalidation' }, 
      { status: 500 }
    );
  }
}