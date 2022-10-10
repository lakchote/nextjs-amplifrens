import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>AmpliFrens</title>
        <meta
          name="description"
          content="Latest crypto news by frens for frens. Earn special perks and amplify your network."
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="container mt-10">
        <Link href="#">
          <a className="block text-center text-primary underline underline-offset-4 hover:text-accent text-lg">
            Post a contribution
          </a>
        </Link>

        <div className="w-full mb-10">
          <div className="bg-base-300 w-1/2 mt-8 p-8 rounded-lg mx-auto">
            <div className="flex">
              <div className="rounded-xl bg-neutral text-white mr-2 px-2.5 flex items-center">DeFi</div>
              <div>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur</div>
            </div>
            <div className="px-16 text-sm mt-2">
              <span className="text-secondary">
                <span>XXX points</span> by{" "}
                <a href="#" className="font-medium hover:text-accent">
                  0x10aded
                </a>
              </span>
              <div className="mt-1">
                <a href="#" className="text-primary hover:text-accent">
                  Upvote
                </a>
                <span> | </span>
                <a href="#" className="text-primary hover:text-accent">
                  Downvote
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
