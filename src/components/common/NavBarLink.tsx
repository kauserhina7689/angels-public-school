"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Optional utility to conditionally apply classNames

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  classname?: string;
  activeClassname?: string;
  onClick?: () => void;
}

export default function NavLink({
  href,
  children,
  classname,
  activeClassname,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(classname, isActive && activeClassname)}
    >
      {children}
    </Link>
  );
}
