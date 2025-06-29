"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Optional utility to conditionally apply classNames

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  classname?: string;
  activeClassname?: string;
}

export default function NavLink({
  href,
  children,
  classname,
  activeClassname,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={clsx(classname, isActive && activeClassname)}>
      {children}
    </Link>
  );
}
