import { useQuery } from "@apollo/client";
import { GET_SBT_LEADERBOARD } from "../constants/subgraphQueries";
import statusesMapping from "../constants/statusMapping";
import Link from "next/link";
import { NextPage } from "next";

const Leaderboard: NextPage = () => {
  const {
    loading: loadingLeaderboardAddresses,
    error: errorLeaderboardAddresses,
    data: leaderboardAddresses,
    refetch,
  } = useQuery(GET_SBT_LEADERBOARD);

  return (
    <>
      {loadingLeaderboardAddresses ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">Loading...</div>
      ) : errorLeaderboardAddresses ? (
        <div className="container mt-8 lg:mt-10 text-center text-accent">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : leaderboardAddresses?.sbtleaderboards?.length === 0 ? (
        <div className="mt-10 flex justify-center"> No top contributions have been minted yet. Wait for tomorrow !</div>
      ) : (
        <main className="container mt-8 lg:mt-10">
          <div className="flex justify-center">
            <h2 className="text-xl lg:text-3xl text-primary">✨ Leaderboard</h2>
          </div>
          <div className="overflow-x-auto flex justify-center mt-16">
            <table className="table flex justify-center border-secondary border-b-2 border-x-secondary">
              <thead>
                <tr>
                  <th>🏆</th>
                  <th className="text-center text-secondary">Name</th>
                  <th className="text-center text-secondary">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leaderboardAddresses?.sbtleaderboards.map(
                  (
                    address: { id: string; username: string | null; status: number; topContributionsCount: number },
                    index: number
                  ) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          {address.username ? (
                            <>
                              <Link href={`/profile/${encodeURIComponent(address.username)}`}>
                                <a className="text-accent text-center">{address.username}</a>
                              </Link>
                            </>
                          ) : (
                            <>{address.id}</>
                          )}
                        </td>
                        <td className="align-middle">
                          <span className="badge badge-default block">{statusesMapping[address.status]}</span>
                        </td>
                        <td>
                          <Link href={`/top-contributions/${encodeURIComponent(address.id)}`}>
                            <a className="btn btn-accent btn-xs">
                              {address.topContributionsCount}
                              {address.topContributionsCount > 1 ? " contributions" : " contribution"}
                            </a>
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </main>
      )}
    </>
  );
};

export default Leaderboard;
