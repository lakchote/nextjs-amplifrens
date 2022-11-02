import Link from "next/link";
import { useRef } from "react";
import CustomConnectButton from "./CustomConnectButton";
import { NavLink } from "./NavLink";

export default function Header() {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const openMenu = () => {
    menuRef!.current!.className = menuRef?.current?.classList.values + "w-screen h-screen opacity-95";
    menuRef?.current?.classList.remove("opacity-0");
    menuRef?.current?.classList.add(
      "w-screen",
      "h-screen",
      "opacity-95",
      "flex",
      "justify-center",
      "items-center",
      "bg-neutral"
    );
  };

  const closeMenu = () => {
    menuRef!.current!.className = menuRef?.current?.classList.remove() + "w-screen h-screen opacity-95";
    menuRef?.current?.classList.remove("w-screen", "h-screen", "opacity-95", "flex");
    menuRef?.current?.classList.add("opacity-0", "hidden");
  };

  return (
    <>
      <div ref={menuRef} className="z-1 hidden opacity-0 duration-700">
        <a
          className="fixed top-6 right-8 text-neutral-content hover:text-primary text-5xl font-semibold duration-300"
          onClick={closeMenu}
        >
          &times;
        </a>
        <div className="flex flex-col text-white text-center text-xl font-light space-y-3">
          <Link href="/top-contributions">
            <a className="px-2 text-md">Top contributions</a>
          </Link>
          <Link href="/leaderboard">
            <a className="px-2">Leaderboard</a>
          </Link>
        </div>
      </div>

      <nav className="navbar border-b border-b-neutral-focus bg-neutral">
        <div className="navbar-start">
          <a className="lg:hidden px-4 text-2xl -mt-1" onClick={openMenu}>
            &#9776;
          </a>
          <div className="flex items-center lg:space-x-4">
            <Link href="/">
              <a className="lg:text-2xl text-xl font-bold lg:px-5 text-white">amplifrens</a>
            </Link>
            <NavLink href="/">
              <a className="hidden rounded-md lg:inline-block align-middle pt-1 px-3 text-sm">Home</a>
            </NavLink>
            <NavLink href="/top-contributions">
              <a className="hidden lg:inline-block rounded-md px-3 pt-1 text-sm hover:text-white">Explore</a>
            </NavLink>
            <NavLink href="/leaderboard">
              <a className="hidden lg:inline-block rounded-md pt-1 px-3 text-sm hover:text-white">Leaderboard</a>
            </NavLink>
          </div>
        </div>
        <div className="navbar-end lg:flex lg:px-5">
          <CustomConnectButton />
        </div>
      </nav>
    </>
  );
}
