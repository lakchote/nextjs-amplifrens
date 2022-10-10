import Link from "next/link";
import ConnectButtonCustom from "./ConnectButtonCustom";

export default function Header() {
  return (
    <nav className="flex justify-between container mx-auto items-center px-8 h-24">
      <Link href="/">
        <a className="text-3xl font-extrabold px-4 text-primary">AmpliFrens</a>
      </Link>
      <div className="items-center">
        <Link href="/top-contributions">
          <a className="px-2 text-lg align-middle hover:text-accent">Top Contributions</a>
        </Link>
        <Link href="/leaderboard">
          <a className="px-2 text-lg align-middle hover:text-accent">Leaderboard</a>
        </Link>
        <ConnectButtonCustom />
      </div>
    </nav>
  );
}
