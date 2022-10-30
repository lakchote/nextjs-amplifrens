import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useVoteContext } from "../../../pages";
import addressesJson from "../../../constants/addresses.json";
import facadeAbi from "../../../constants/abi.json";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DownvoteContribution({ contributionId }: { contributionId: number }) {
  const { downvoted } = useVoteContext();
  const [clicked, setClicked] = useState(false);
  const { config: downvoteConfig } = usePrepareContractWrite({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "downvoteContribution",
    args: [contributionId],
    enabled: clicked,
  });
  const { write: downvote, data, isError, error } = useContractWrite(downvoteConfig);

  const { openConnectModal } = useConnectModal();
  const { isDisconnected } = useAccount();
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (clicked) {
      downvote?.();
      setClicked(false);
    }
    isSuccess
      ? toast.success("Dislike successful")
      : isLoading
      ? toast.info("Disliking contribution...")
      : isError && toast.error(`${"Error : " + error?.message}`);
  }, [clicked, isSuccess, isLoading, isError, downvote, error?.message]);

  const handleVote = () => {
    setClicked(true);
    if (isDisconnected) openConnectModal?.();
  };

  return (
    <a
      className={
        downvoted.includes(contributionId)
          ? "text-primary hover:cursor-not-allowed"
          : "align-middle hover:text-accent hover:cursor-pointer"
      }
      onClick={() => handleVote()}
    >
      <FontAwesomeIcon icon={faThumbsDown} /> Dislike
    </a>
  );
}
