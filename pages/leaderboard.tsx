import { useQuery } from "@apollo/client";
import { GET_SBT_LEADERBOARD } from "../constants/subgraphQueries";
import Link from "next/link";
import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import truncateStr from "../utils/truncate";

const Leaderboard: NextPage = () => {
  const {
    loading: loadingLeaderboardAddresses,
    error: errorLeaderboardAddresses,
    data: leaderboardAddresses,
  } = useQuery(GET_SBT_LEADERBOARD);

  const handleDisplayTopLeaderboard = (index: number) => {
    if (index > 2) {
      return <span className="btn btn-xs border-none btn-circle mr-4">{index + 1}</span>;
    }
    return index === 0 ? (
      <span className="btn btn-xs border-none bg-yellow-400 btn-circle mr-4">{index + 1}</span>
    ) : index === 1 ? (
      <span className="btn btn-xs border-none text-neutral bg-gray-600 btn-circle mr-4">{index + 1}</span>
    ) : (
      <span className="btn btn-xs border-none text-neutral bg-amber-900 btn-circle mr-4">{index + 1}</span>
    );
  };

  return (
    <>
      {loadingLeaderboardAddresses ? (
        <div className="container pt-9 lg:pt-10 text-center text-neutral">Loading...</div>
      ) : errorLeaderboardAddresses ? (
        <div className="container pt-9 lg:pt-10 text-center text-neutral">
          There was an error.
          <br /> Please reach out on Discord or Twitter.
        </div>
      ) : leaderboardAddresses?.sbtleaderboards?.length === 0 ? (
        <div className="pt-10 flex justify-center"> No top contributions have been minted yet. Wait for tomorrow !</div>
      ) : (
        <main className="container px-2 pt-9 lg:pt-10 leaderboard-container bg-cover lg:max-w-full">
          <div className="flex w-full lg:w-4/12 mx-auto border rounded-sm border-gray-800 bg-base-100 leaderboard flex-col justify-center">
            <div className="p-5 flex items-center bg-base-100 text-xl tracking-wider border-b border-gray-800">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
              Most valuable Contributoors
            </div>
            <div className="bg-gradient-to-r from-secondary to-accent">
              {leaderboardAddresses?.sbtleaderboards.map(
                (
                  address: { id: string; username: string | null; status: number; topContributionsCount: number },
                  index: number
                ) => {
                  return (
                    <div className="flex flex-row py-5 pl-4 pb" key={index}>
                      {handleDisplayTopLeaderboard(index)}
                      {address.username ? (
                        <>
                          <Link href={`/profile/${encodeURIComponent(address.id)}`}>
                            <a className="text-neutral text-center">{address.username}</a>
                          </Link>
                        </>
                      ) : (
                        <>{truncateStr(address.id, 11)}</>
                      )}
                      <div className="flex w-full justify-end pr-4">
                        <Link href={`/top-contributions/${encodeURIComponent(address.id)}`}>
                          <a className="font-bold">{address.topContributionsCount}</a>
                        </Link>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Leaderboard;
