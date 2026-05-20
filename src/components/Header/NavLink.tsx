"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  exact?: boolean;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
  children: ReactNode;
};

export default function NavLink({ href, exact, className, activeClassName, inactiveClassName, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link href={href} className={`${className} ${isActive ? activeClassName : inactiveClassName}`}>
      {children}
    </Link>
  );
}