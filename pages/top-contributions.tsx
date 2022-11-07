import { NetworkStatus, useQuery } from "@apollo/client";
import { GET_TOP_CONTRIBUTIONS } from "../constants/subgraphQueries";
import { ContributionInterface } from "../interfaces/Contribution";
import Contribution from "../components/contribution/Contribution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { NextPage } from "next";
import { useState } from "react";
import { InView } from "react-intersection-observer";

const TopContributions: NextPage = () => {
  const [isFullyLoaded, setFullyLoaded] = useState(false);

  const {
    networkStatus,
    error: errorTopContributions,
    data: activeTopContributions,
    variables: queryPaginationOptions,
    fetchMore,
  } = useQuery(GET_TOP_CONTRIBUTIONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: 5,
      skip: 0,
    },
  });

  return (
    <>
      {networkStatus === NetworkStatus.loading ? (
        <div className="container pt-9 lg:pt-10 text-center text-accent">Loading...</div>
      ) : errorTopContributions ? (
        <div className="container pt-9 lg:pt-10 text-center text-accent">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : activeTopContributions?.contributions?.length === 0 ? (
        <div className="pt-10 flex justify-center"> No top contributions for the moment.</div>
      ) : (
        <main className="container bg-cover pt-10">
          <div className="flex justify-center pb-4">
            <h2 className="text-xl lg:text-2xl text-neutral">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
              Top contributions
            </h2>
          </div>
          {activeTopContributions.contributions?.map((activeContribution: ContributionInterface) => (
            <Contribution
              key={activeContribution.timestamp + "-top-contribution"}
              contribution={activeContribution}
              hasVoteActions={false}
            />
          ))}
          {networkStatus !== NetworkStatus.fetchMore &&
            activeTopContributions.contributions.length % queryPaginationOptions!.first === 0 &&
            !isFullyLoaded && (
              <InView
                onChange={async (inView) => {
                  if (inView) {
                    const result = await fetchMore({
                      variables: {
                        first: activeTopContributions.contributions.length + 5,
                      },
                    });
                    setFullyLoaded(!result.data.contributions.length);
                  }
                }}
              />
            )}
        </main>
      )}
    </>
  );
};

export default TopContributions;
