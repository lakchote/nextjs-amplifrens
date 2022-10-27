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
            <h2 className="text-xl lg:text-3xl">✨ Leaderboard</h2>
          </div>
          <div className="overflow-x-auto flex justify-center mt-10">
            <table className="table flex justify-center border-secondary border-b-2 border-x-secondary">
              <thead>
                <tr>
                  <th>🏆</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leaderboardAddresses?.sbtleaderboards.map(
                  (address: { id: string; username: string | null; status: number }, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{address.username ?? address.id}</td>
                        <td className="align-middle">
                          <span className="badge badge-default block">{statusesMapping[address.status]}</span>
                        </td>
                        <td>
                          <Link
                            href={{
                              pathname: "/top-contributions/[username]",
                              query: { username: address.id, profile: address.username },
                            }}
                          >
                            <a className="btn btn-primary btn-xs">Contributions</a>
                          </Link>
                          {address.username && (
                            <>
                              <Link href={`/profile/${encodeURIComponent(address.username)}`}>
                                <a className="btn btn-secondary btn-xs ml-3">Profile</a>
                              </Link>
                            </>
                          )}
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
