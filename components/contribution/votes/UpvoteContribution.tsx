import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePrepareContractWrite, useContractWrite, useAccount, useWaitForTransaction } from "wagmi";
import { useVoteContext } from "../../../pages";
import addressesJson from "../../../constants/addresses.json";
import facadeAbi from "../../../constants/abi.json";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UpvoteContribution({ contributionId }: { contributionId: number }) {
  const { upvoted } = useVoteContext();
  const [clicked, setClicked] = useState(false);
  const { config: upvoteConfig } = usePrepareContractWrite({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "upvoteContribution",
    args: [contributionId],
    enabled: clicked,
  });

  const { write: upvote, data, isError, error } = useContractWrite(upvoteConfig);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const { openConnectModal } = useConnectModal();
  const { isDisconnected } = useAccount();

  useEffect(() => {
    if (clicked) {
      upvote?.();
      setClicked(false);
    }
    isSuccess
      ? toast.success("Like successful")
      : isLoading
      ? toast.info("Liking contribution...")
      : isError && toast.error(`${"Error : " + error?.message}`);
  }, [clicked, error?.message, isError, isLoading, isSuccess, upvote]);

  const handleVote = () => {
    setClicked(true);
    if (isDisconnected) openConnectModal?.();
  };

  return (
    <a
      className={
        upvoted.includes(contributionId)
          ? "text-primary mx-2.5 hover:cursor-not-allowed"
          : "mx-2.5 hover:text-accent hover:cursor-pointer"
      }
      onClick={() => handleVote()}
    >
      <FontAwesomeIcon icon={faThumbsUp} /> Like
    </a>
  );
}
