import { useQuery } from "@apollo/client";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { GET_USER_TOP_CONTRIBUTIONS } from "../../constants/subgraphQueries";
import { ContributionInterface } from "../../interfaces/Contribution";
import truncateStr from "../../utils/truncate";
import BackToHomepage from "../../components/BackToHomepage";
import Contribution from "../../components/contribution/Contribution";

const UserTopContributions: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const {
    loading: loadingTopContributions,
    error: errorTopContributions,
    data: activeTopContributions,
    variables: queryPaginationOptions,
    refetch,
  } = useQuery(GET_USER_TOP_CONTRIBUTIONS, {
    variables: {
      first: 5,
      skip: 0,
      address: address ?? "",
    },
  });

  return (
    <>
      {loadingTopContributions ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">Loading...</div>
      ) : errorTopContributions ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : activeTopContributions?.contributions?.length === 0 ? (
        <div className="mt-10 flex justify-center"> No top contributions for address {address}.</div>
      ) : (
        <main className="container mt-8 lg:mt-10">
          <div className="flex justify-center">
            <h2 className="text-xl lg:text-3xl text-primary">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
              {truncateStr(address!.toString(), 11)}
              &apos;s top contributions
            </h2>
          </div>

          {activeTopContributions.contributions?.map((activeContribution: ContributionInterface) => (
            <Contribution
              key={activeContribution.timestamp + "-user-top-contribution"}
              contribution={activeContribution}
              hasVoteActions={false}
            />
          ))}
          <div className="flex justify-center">
            {activeTopContributions.contributions?.length % 5 === 0 && (
              <button
                className="btn btn-accent mb-5"
                onClick={() =>
                  refetch({
                    first: queryPaginationOptions ? queryPaginationOptions.first + 5 : 5,
                  })
                }
              >
                More
              </button>
            )}
          </div>
          <BackToHomepage />
        </main>
      )}
    </>
  );
};

export default UserTopContributions;
