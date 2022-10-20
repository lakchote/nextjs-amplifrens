import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  GET_CONTRIBUTIONS,
  GET_USER_UPVOTED_CONTRIBUTIONS,
  GET_USER_DOWNVOTED_CONTRIBUTIONS,
} from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import { ContributionInterface, ContributionVotesInterface } from "../interfaces/contribution";
import Contribution from "../components/Contribution";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const VoteEventsContext = createContext<{ upvoted: Number[]; downvoted: Number[] }>({ upvoted: [], downvoted: [] });

const Home: NextPage = () => {
  const [upvotedEventContributionIds, setUpvotedEventContributionIds] = useState<Number[]>([]);
  const [downvotedEventContributionIds, setDownvotedEventContributionIds] = useState<Number[]>([]);
  const { address } = useAccount();
  const {
    loading: loadingContributions,
    error: errorContributions,
    data: activeContributions,
    startPolling: startPollContributions,
  } = useQuery(GET_CONTRIBUTIONS);
  const { data: userUpvotedContributions, startPolling: startPollUpvotes } = useQuery(GET_USER_UPVOTED_CONTRIBUTIONS, {
    variables: {
      address: address ?? "",
    },
  });
  const { data: userDownvotedContributions, startPolling: startPollDownvotes } = useQuery(
    GET_USER_DOWNVOTED_CONTRIBUTIONS,
    {
      variables: {
        address: address ?? "",
      },
    }
  );

  startPollUpvotes(3000);
  startPollDownvotes(3000);
  // TODO
  // startPollContributions(500);

  useEffect(() => {
    if (userUpvotedContributions) {
      setUpvotedEventContributionIds(
        userUpvotedContributions.contributionUpvoteds.map(
          (contribution: ContributionVotesInterface) => contribution.contributionId
        )
      );
    }
    if (userDownvotedContributions) {
      setDownvotedEventContributionIds(
        userDownvotedContributions.contributionDownvoteds.map(
          (contribution: ContributionVotesInterface) => contribution.contributionId
        )
      );
    }
  }, [userUpvotedContributions, userDownvotedContributions]);

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

      {loadingContributions ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">Loading...</div>
      ) : errorContributions ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : (
        <main className="container mt-8 lg:mt-10">
          <Link href="#" className="">
            <div className="flex justify-center">
              <a
                className="flex btn btn-primary btn-sm lg:btn-md rounded-md items-center text-center hover:border-white border-transparent border-2 text-sm lg:text-md"
                href="#"
              >
                New contribution
              </a>
            </div>
          </Link>
          {activeContributions.contributions.map((activeContribution: ContributionInterface) => {
            return (
              <VoteEventsContext.Provider
                key={activeContribution.timestamp}
                value={{ upvoted: upvotedEventContributionIds, downvoted: downvotedEventContributionIds }}
              >
                <Contribution contribution={activeContribution} />
              </VoteEventsContext.Provider>
            );
          })}
        </main>
      )}
    </div>
  );
};

export default Home;
export const useVoteContext = () => useContext(VoteEventsContext);
