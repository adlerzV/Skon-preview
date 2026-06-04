"use client";

import React from "react";
import Link from "next/link";

// تعریف پراپ‌ها و واریانت‌های محدود به نیازهای هیرو (بدون تغییر)
type BaseProps = {
  variant?: "primary" | "icon" | "ghost";
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsLink = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  
  // ۱. اصلاح استایل‌های پایه: تمام کلاس‌های animation/transition حذف شدند
  const baseStyles = "focus:outline-none flex items-center justify-center font-bold select-none cursor-pointer";
  
  // ۲. اصلاح استایل‌های اختصاصی: duration و transition از اینجا هم حذف شدند
  const variants = {
    // دکمه اصلی "مشاهده و خرید"
    primary: "bg-brand-blue border border-transparent hover:border-brand-white text-brand-white px-8 py-2 text-sm",
    
    // فلش‌های چپ و راست نویگیتور اسلایدر
    icon: "bg-brand-bg hover:border-brand-surface_m text-m_khonsa hover:text-brand-white p-2 opacity-0 group-hover:opacity-100 border border-brand-surface disabled:bg-opacity-50 disabled:pointer-events-none",
    
    // دکمه کنترل پلی / پاز پایین اسلایدر
    ghost: "text-gray-500 hover:text-brand-blue"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  // رندر به عنوان لینک
  if (props.href) {
    const { href, ...anchorProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={combinedClasses} {...anchorProps}>
        {children}
      </Link>
    );
  }

  // رندر به عنوان دکمه استاندارد
  const buttonProps = props as ButtonAsButton;
  return (
    <button className={combinedClasses} {...buttonProps}>
      {children}
    </button>
  );
}