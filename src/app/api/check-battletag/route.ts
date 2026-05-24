// فایل: src/app/api/check-battletag/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { battleTag } = body;

    if (!battleTag || !battleTag.includes('#')) {
      return NextResponse.json(
        { valid: false, message: "فرمت بتل‌تگ نامعتبر است" }, 
        { status: 400 }
      );
    }

    // خواندن فایل جیسون سبک بدون درگیر کردن دیتابیس
    const jsonDirectory = path.join(process.cwd(), 'src/data');
    const fileContents = await fs.readFile(jsonDirectory + '/battletags.json', 'utf8');
    const friendsList: string[] = JSON.parse(fileContents);

    // بررسی حساس به حروف کوچک و بزرگ (Case Insensitive)
    const exists = friendsList.some(tag => tag.toLowerCase() === battleTag.toLowerCase());

    if (exists) {
      return NextResponse.json({ valid: true, message: "بتل‌تگ تایید شد" }, { status: 200 });
    } else {
      return NextResponse.json({ valid: false, message: "شما در لیست فرندهای ما نیستید" }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json(
      { valid: false, message: "خطای سرور در بررسی بتل‌تگ" }, 
      { status: 500 }
    );
  }
}