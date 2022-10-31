import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContributionInterface } from "../../interfaces/contribution";
import { useAccount } from "wagmi";
import UpvoteContribution from "./votes/UpvoteContribution";
import DownvoteContribution from "./votes/DownvoteContribution";
import UpdateContribution from "./modals/UpdateContribution";
import DeleteContribution from "./modals/DeleteContribution";
import contributionCategories from "../../constants/categoryMapping";
import truncateStr from "../../utils/truncate";
import Link from "next/link";

export default function Contribution({
  contribution,
  hasVoteActions,
}: {
  contribution: ContributionInterface;
  hasVoteActions: boolean;
}) {
  const { address } = useAccount();
  const date = new Date(contribution.timestamp * 1000).toLocaleString("default", { dateStyle: "short" });

  return (
    <div className="lg:w-full mb-16">
      <div className="lg:w-5/12 mx-2 mt-6 p-8 lg:mt-8 lg:p-8 rounded-lg lg:mx-auto border border-accent shadow-lg shadow-accent">
        <div className="flex items-center">
          <div className="badge sm:badge-sm md:badge-md lg:badge-lg badge-default p-4 mr-3 w-20">
            {contributionCategories[contribution.category]}
          </div>
          <div className="font-bold lg:text-lg">
            <a className="text-primary hover:text-accent" href={contribution.url}>
              {contribution.title}
            </a>
            <div className="text-xs pt-1">
              <Link
                href={`/profile/${encodeURIComponent(
                  contribution.hasProfile ? contribution.username : contribution.from
                )}`}
              >
                <a className="font-extralight text-secondary hover:text-accent">
                  by {contribution.hasProfile ? contribution.username : truncateStr(contribution.from, 11)}
                </a>
              </Link>
              <span className="ml-10 font-extralight">{contribution.bestContribution && date}</span>
            </div>
          </div>
        </div>
        <div className="text-sm mt-4 px-6">
          <FontAwesomeIcon icon={faThumbsUp} className={contribution.votes > 0 ? "text-accent" : ""} />{" "}
          {contribution.votes}
        </div>
        {hasVoteActions && (
          <>
            <div className="divider"></div>
            <div className="flex justify-around text-sm">
              {!address || contribution.from.toUpperCase() !== address.toUpperCase() ? (
                <>
                  <UpvoteContribution contributionId={contribution.contributionId} />
                  <DownvoteContribution contributionId={contribution.contributionId} />
                </>
              ) : (
                <>
                  <UpdateContribution contributionId={contribution.contributionId} />
                  <DeleteContribution contributionId={contribution.contributionId} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
