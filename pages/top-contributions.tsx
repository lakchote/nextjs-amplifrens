import { useQuery } from "@apollo/client";
import { GET_TOP_CONTRIBUTIONS } from "../constants/subgraphQueries";
import { ContributionInterface } from "../interfaces/contribution";
import Contribution from "../components/contribution/Contribution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import BackToHomepage from "../components/BackToHomepage";

export default function TopContributions() {
  const {
    loading: loadingTopContributions,
    error: errorTopContributions,
    data: activeTopContributions,
    variables: queryPaginationOptions,
    refetch,
  } = useQuery(GET_TOP_CONTRIBUTIONS, {
    variables: {
      first: 5,
      skip: 0,
    },
  });

  refetch();

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
        <div className="mt-10 flex justify-center"> No top contributions for the moment.</div>
      ) : (
        <main className="container mt-8 lg:mt-10">
          <div className="flex justify-center">
            <h2 className="text-xl lg:text-3xl">
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
}
