import { ContributionInterface } from "../../interfaces/contribution";
import { useAccount } from "wagmi";
import Avatar from "boring-avatars";
import TimeAgo from "react-timeago";
import UpvoteContribution from "./votes/UpvoteContribution";
import DownvoteContribution from "./votes/DownvoteContribution";
import UpdateContribution from "./modals/UpdateContribution";
import DeleteContribution from "./modals/DeleteContribution";
import contributionCategories from "../../constants/categoryMapping";
import statusesMapping from "../../constants/statusMapping";
import truncateStr from "../../utils/truncate";
import Link from "next/link";
import { useVoteContext } from "../../pages";

export default function Contribution({
  contribution,
  hasVoteActions,
}: {
  contribution: ContributionInterface;
  hasVoteActions: boolean;
}) {
  const { address } = useAccount();
  const { upvoted } = useVoteContext();
  const handleUpdateDelete = () => {
    if (hasVoteActions && contribution.from.toUpperCase() === address?.toUpperCase()) {
      return (
        <>
          <div className="divider mt-4"></div>
          <div className="flex justify-evenly mb-4">
            <>
              <UpdateContribution contributionId={contribution.contributionId} />
              <DeleteContribution contributionId={contribution.contributionId} />
            </>
          </div>
        </>
      );
    }
  };
  return (
    <div className="lg:flex lg:mb-3 lg:flex-column lg:items-start lg:justify-center text-neutral">
      <div className="border-y lg:border border-gray-800 lg:rounded-lg bg-base-100">
        <div className="lg:pl-4 lg:py-3 pl-2 flex items-center">
          <Avatar
            size={25}
            name={contribution?.username ?? contribution.from}
            variant="beam"
            colors={["#4610AD", "#5F74EA", "#491F98", "#35068C", "#491F98", "#D1E0FF"]}
          />
          <div className="ml-3 py-3 font-semibold lowercase">
            <Link href={`/profile/${encodeURIComponent(contribution.from)}`}>
              <a className="cursor-pointer bg-clip-text bg-gradient-to-r from-neutral to-accent-content text-transparent">
                {contribution.hasProfile ? contribution.username : truncateStr(contribution.from, 11)}
              </a>
            </Link>
            <span className="ml-2 badge badge-secondary">{statusesMapping[contribution.fromStatus]}</span>
          </div>
        </div>
        <div className="min-h-[343px] lg:min-w-[500px] lg:min-h-[500px] flex items-center justify-center font-semibold bg-contribution-title">
          <a
            className="text-neutral rounded-full p-2 lg:p-3 border-none hover:bg-accent-focus text-center font-medium bg-accent"
            href={contribution.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-accent-content inline-flex mr-1">
              ({contributionCategories[contribution.category]})
            </span>
            {contribution.title}
          </a>
        </div>
        <div className="pt-4 pb-2 pl-4">
          {!upvoted.includes(contribution.contributionId) ? (
            <UpvoteContribution contribution={contribution} />
          ) : (
            <DownvoteContribution contributionId={contribution.contributionId} />
          )}
        </div>
        <span className="text-sm pl-4 font-semibold">{contribution.votes} likes</span>

        <div className="pb-4 pl-4 text-xs pt-1 uppercase text-neutral-focus">
          <TimeAgo date={contribution.timestamp * 1000} />
        </div>
        {handleUpdateDelete()}
      </div>
    </div>
  );
}
