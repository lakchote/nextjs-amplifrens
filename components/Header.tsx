import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import CustomConnectButton from "./CustomConnectButton";
import { NavLink } from "./NavLink";

export default function Header() {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const openMenu = () => {
    menuRef?.current?.classList.remove("opacity-0", "hidden");
    menuRef?.current?.classList.add(
      "w-screen",
      "h-screen",
      "opacity-95",
      "flex",
      "justify-center",
      "items-center",
      "bg-base-100"
    );
  };

  const closeMenu = () => {
    menuRef?.current?.classList.remove("w-screen", "h-screen", "opacity-95", "flex");
    menuRef?.current?.classList.add("opacity-0", "hidden");
  };

  return (
    <>
      <div ref={menuRef} className="z-1 hidden opacity-0 duration-700">
        <a
          className="fixed top-6 right-8 text-neutral hover:text-primary text-5xl font-semibold duration-300"
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

      <nav className="navbar mt-3">
        <div className="navbar-start">
          <a className="lg:hidden px-4 -mt-1" onClick={openMenu}>
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block text-neutral h-5 w-5 stroke-current md:h-6 md:w-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </a>
          <div className="flex items-center lg:space-x-4">
            <div className="flex items-center lg:mx-32">
              <Image src="/images/logo.svg" width={15} height={15} alt="Amplifier" />
              <Link href="/">
                <a className="font-semibold text-sm lg:text-lg tracking-wider text-white ml-2">AMPLIFRENS</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="navbar-end lg:px-5 space-x-8">
          <NavLink href="/">
            <a className="hidden lg:inline-block text-neutral hover:border-b-2 hover:border-b-accent">Home</a>
          </NavLink>
          <NavLink href="/top-contributions">
            <a className="hidden lg:inline-block text-neutral hover:border-b-2 hover:border-b-accent">Explore</a>
          </NavLink>
          <NavLink href="/leaderboard">
            <a className="hidden lg:inline-block text-neutral hover:border-b-2 hover:border-b-accent">Leaderboard</a>
          </NavLink>
          <div className="hidden lg:block lg:mx-6 lg:border-r lg:border-r-gray-600">&nbsp;</div>
          <CustomConnectButton />
        </div>
      </nav>
    </>
  );
}
