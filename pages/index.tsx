import type { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { ContributionInterface } from "../interfaces/Contribution";
import { ContributionVotesInterface } from "../interfaces/ContributionVotes";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkStatus } from "@apollo/client";
import { InView } from "react-intersection-observer";
import { GET_CONTRIBUTIONS, GET_USER_UPVOTED_CONTRIBUTIONS } from "../constants/subgraphQueries";
import Head from "next/head";
import Contribution from "../components/contribution/Contribution";

const VoteEventsContext = createContext<{ upvoted: Number[] }>({ upvoted: [] });

const Home: NextPage = () => {
  const [upvotedEventContributionIds, setUpvotedEventContributionIds] = useState<Number[]>([]);
  const { address } = useAccount();
  const [isFullyLoaded, setFullyLoaded] = useState(false);

  const {
    networkStatus,
    error: errorContributions,
    data: activeContributions,
    variables: queryPaginationOptions,
    fetchMore,
    startPolling: startPollContributions,
  } = useQuery(GET_CONTRIBUTIONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: 5,
      skip: 0,
    },
  });
  const { data: userUpvotedContributions, startPolling: startPollUpvotes } = useQuery(GET_USER_UPVOTED_CONTRIBUTIONS, {
    variables: {
      address: address ?? "",
    },
  });

  startPollUpvotes(parseInt(process.env.NEXT_PUBLIC_POLL_UPVOTES!));
  startPollContributions(parseInt(process.env.NEXT_PUBLIC_POLL_CONTRIBUTIONS!));

  useEffect(() => {
    if (userUpvotedContributions) {
      setUpvotedEventContributionIds(
        userUpvotedContributions.contributionUpvoteds.map(
          (contribution: ContributionVotesInterface) => contribution.contributionId
        )
      );
    }
  }, [userUpvotedContributions]);

  return (
    <div>
      <Head>
        <title>AmpliFrens</title>
        <meta
          name="description"
          content="Latest crypto news by frens for frens. Earn special perks and amplify your network."
        />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <main>
        {networkStatus === NetworkStatus.loading ? (
          <div className="mt-8 lg:mt-10 text-center text-accent container">Loading...</div>
        ) : errorContributions ? (
          <div className="mt-8 lg:mt-10 text-center text-accent container">
            There was an error.
            <br /> Please reach out on Discord or Twitter.
          </div>
        ) : (
          <div className="lg:p-10 pt-9 lg:container bg-cover min-h-screen lg:max-w-full">
            {activeContributions?.contributions?.length === 0 && (
              <div className="mt-32 w-1/2 mx-auto lg:flex lg:flex-col">
                <h2 className="text-white text-xl mt-8 text-center">No Contributions Yet</h2>
              </div>
            )}
            <div className="flex flex-column items-start justify-center lg:pr-7 text-neutral">
              <div className="w-full lg:w-2/5">
                {activeContributions.contributions.map((activeContribution: ContributionInterface) => {
                  return (
                    <VoteEventsContext.Provider
                      key={activeContribution.timestamp}
                      value={{ upvoted: upvotedEventContributionIds }}
                    >
                      <Contribution contribution={activeContribution} hasVoteActions={true} />
                    </VoteEventsContext.Provider>
                  );
                })}
                {networkStatus !== NetworkStatus.fetchMore &&
                  activeContributions.contributions.length % queryPaginationOptions!.first === 0 &&
                  !isFullyLoaded && (
                    <InView
                      onChange={async (inView) => {
                        if (inView) {
                          const result = await fetchMore({
                            variables: {
                              first: activeContributions.contributions.length + 5,
                            },
                          });
                          setFullyLoaded(!result.data.contributions.length);
                        }
                      }}
                    />
                  )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
export const useVoteContext = () => useContext(VoteEventsContext);
