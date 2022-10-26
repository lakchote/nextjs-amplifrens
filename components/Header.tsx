import Link from "next/link";
import CustomConnectButton from "./CustomConnectButton";

export default function Header() {
  return (
    <nav className="navbar py-4 lg:py-8 container mx-auto">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu dropdown-content p-2 bg-base-300 rounded-box w-52">
            <li>
              <Link href="/top-contributions">
                <a className="px-2">Top Contributions</a>
              </Link>
            </li>
            <li>
              <Link href="/leaderboard">
                <a className="px-2">Leaderboard</a>
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/">
          <a className="lg:text-3xl text-xl font-bold px-1 lg:px-2 text-primary">AmpliFrens</a>
        </Link>
      </div>
      <div className="navbar-end lg:flex">
        <div className="hidden lg:flex">
          <Link href="/top-contributions">
            <a className="px-2 text-md hover:text-primary">Top Contributions</a>
          </Link>
          <Link href="/leaderboard">
            <a className="px-2 text-md hover:text-primary">Leaderboard</a>
          </Link>
        </div>
        <CustomConnectButton />
      </div>
    </nav>
  );
}
