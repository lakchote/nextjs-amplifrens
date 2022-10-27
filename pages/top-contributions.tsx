import { useQuery } from "@apollo/client";
import { GET_TOP_CONTRIBUTIONS } from "../constants/subgraphQueries";
import { ContributionInterface } from "../interfaces/contribution";
import Contribution from "../components/contribution/Contribution";

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

  return (
    <div>
      {loadingTopContributions ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">Loading...</div>
      ) : errorTopContributions ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : (
        <main className="container mt-8 lg:mt-10">
          {activeTopContributions.contributions?.map((activeContribution: ContributionInterface) => (
            <Contribution
              key={activeContribution.id + "-top-contribution"}
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
        </main>
      )}
    </div>
  );
}
