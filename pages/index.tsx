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
      <main className="container mt-6 lg:mt-10">
        <Link href="#">
          <a className="block text-center text-primary hover:text-accent text-sm lg:text-lg">
            Post a contribution
          </a>
        </Link>

        <div className="lg:w-full mb-10">
          <div className="bg-base-200 lg:w-1/2 mx-2 mt-6 p-6 lg:mt-8 lg:p-8 rounded-lg lg:mx-auto">
            <div className="flex">
              <div className="text-secondary mr-2 px-2.5 flex items-center basis-44 justify-center font-light">DeFi</div>
              <div>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur</div>
            </div>
            <div className="flex justify-between text-xs mt-6">
              <div>
                XXX points by <a href="#" className="font-medium hover:text-accent">0x10aded</a>
              </div>
              <div>
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
