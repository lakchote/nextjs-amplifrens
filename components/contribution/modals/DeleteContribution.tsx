import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import facadeAbi from "../../../constants/abi.json";
import addressesJson from "../../../constants/addresses.json";
import React, { useEffect } from "react";

export default function DeleteContribution({ contributionId }: { contributionId: number }) {
  const { config } = usePrepareContractWrite({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "removeContribution",
    args: [contributionId],
    enabled: Boolean(contributionId),
  });
  const { write, data, isError, error } = useContractWrite(config);

  const { openConnectModal } = useConnectModal();
  const { isDisconnected } = useAccount();
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleDelete = (e: React.FormEvent) => {
    if (isDisconnected) openConnectModal?.();
    write?.();
    e.preventDefault();
  };

  useEffect(() => {
    isSuccess
      ? toast.success("Post deleted")
      : isLoading
      ? toast.info("Deleting post...")
      : isError && toast.error(`${"Error : " + error?.message}`);
  }, [isError, error, isSuccess, isLoading]);

  return (
    <>
      <label
        htmlFor={"contribution-delete-modal" + contributionId}
        className="hover:text-primary hover:cursor-pointer items-center text-center text-sm lg:text-md"
        onClick={() => isDisconnected && openConnectModal?.()}
      >
        <FontAwesomeIcon icon={faRemove} className="mr-1" /> Delete contribution
      </label>
      <input type="checkbox" id={"contribution-delete-modal" + contributionId} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor={"contribution-delete-modal" + contributionId}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-xl text-primary mb-6">Delete contribution</h3>
          <p>
            Deleting a contribution is <strong>irreversible</strong>.
          </p>
          <button className="btn btn-accent mt-6" onClick={(e) => handleDelete(e)}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
