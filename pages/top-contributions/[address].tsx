import { NetworkStatus, useQuery } from "@apollo/client";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { GET_USER_TOP_CONTRIBUTIONS } from "../../constants/subgraphQueries";
import { ContributionInterface } from "../../interfaces/contribution";
import truncateStr from "../../utils/truncate";
import Contribution from "../../components/contribution/Contribution";
import { useState } from "react";
import { InView } from "react-intersection-observer";

const UserTopContributions: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const [isUserTopContributionsFullyLoaded, setUserTopContributionsFullyLoaded] = useState(false);

  const {
    networkStatus,
    error: errorTopContributions,
    data: activeTopContributions,
    variables: queryPaginationOptions,
    fetchMore,
  } = useQuery(GET_USER_TOP_CONTRIBUTIONS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      first: 5,
      skip: 0,
      address: address ?? "",
    },
  });

  return (
    <>
      {networkStatus === NetworkStatus.loading ? (
        <div className="container pt-9 lg:pt-10 text-center text-neutral lg:max-w-full">Loading...</div>
      ) : errorTopContributions ? (
        <div className="container pt-9 lg:pt-10 text-center text-neutral lg:max-w-full">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : activeTopContributions?.contributions?.length === 0 ? (
        <div className="pt-10 flex justify-center"> No top contributions for address {address}.</div>
      ) : (
        <main className="container pt-9 lg:pt-10 bg-cover lg:max-w-full">
          <div className="flex justify-center pb-4">
            <h2 className="text-xl lg:text-2xl text-neutral">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
              {truncateStr(address!.toString(), 11)}
              &apos;s top contributions
            </h2>
          </div>

          {activeTopContributions?.contributions?.map((activeContribution: ContributionInterface) => (
            <Contribution
              key={activeContribution.timestamp + "-user-top-contribution"}
              contribution={activeContribution}
              hasVoteActions={false}
            />
          ))}
          {networkStatus !== NetworkStatus.fetchMore &&
            activeTopContributions?.contributions?.length % queryPaginationOptions!.first === 0 &&
            !isUserTopContributionsFullyLoaded && (
              <InView
                onChange={async (inView) => {
                  if (inView) {
                    const result = await fetchMore({
                      variables: {
                        first: activeTopContributions.contributions.length + 5,
                      },
                    });
                    setUserTopContributionsFullyLoaded(!result.data.contributions.length);
                  }
                }}
              />
            )}
        </main>
      )}
    </>
  );
};

export default UserTopContributions;
