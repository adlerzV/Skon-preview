// فایل: src/app/api/cart/add/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '') || '';
    // نکته: اگر از CoCart یا پلاگین کاستوم سبد خرید استفاده می‌کنید، این آدرس را تغییر دهید
    const cartEndpoint = `${backendUrl}/wp-json/wc/store/v1/cart/add-item`;

    const payload = {
      id: body.productId,
      quantity: 1,
      variation: body.variationId ? [{ id: body.variationId }] : [],
      // این فیلدها توسط هوک‌های PHP که نوشتیم دریافت و پردازش می‌شوند
      delivery_method: body.method,
      battle_tag: body.customFields?.battleTag,
      account_email: body.customFields?.email,
      account_password: body.customFields?.password,
    };

    const response = await fetch(cartEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Nonce': 'اگر از Store API پیش‌فرض ووکامرس استفاده می‌کنید نیاز است'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "خطا در ارتباط با سبد خرید فروشگاه", details: errorData }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, cart: data }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}