import React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { NavLinkProps } from "../interfaces/NavLinkProps";

export function NavLink({ children, href, ...props }: NavLinkProps) {
  const router = useRouter();
  return (
    <Link href={href} {...props}>
      {router.pathname === href ? React.cloneElement(children, { "menu-active": "true" }) : children}
    </Link>
  );
}
