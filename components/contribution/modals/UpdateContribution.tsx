import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "usehooks-ts";
import contributionCategories from "../../../constants/categoryMapping";
import facadeAbi from "../../../constants/abi.json";
import addressesJson from "../../../constants/addresses.json";
import { useEffect, useState } from "react";

export default function UpdateContribution({ contributionId }: { contributionId: number }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(0);
  const [url, setUrl] = useState("");

  const debouncedUrl = useDebounce(url, 300);
  const { config } = usePrepareContractWrite({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "updateContribution",
    args: [contributionId, category, title, debouncedUrl],
    enabled: Boolean(debouncedUrl),
  });
  const { write, data, isError, error } = useContractWrite(config);

  const { openConnectModal } = useConnectModal();
  const { isDisconnected } = useAccount();
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleUpdate = (e: React.FormEvent) => {
    if (isDisconnected) openConnectModal?.();
    write?.();
    e.preventDefault();
  };

  useEffect(() => {
    isSuccess
      ? toast.success("Post updated")
      : isLoading
      ? toast.info("Updating post...")
      : isError && toast.error(`${"Error : " + error?.message}`);
  }, [isError, error, isSuccess, isLoading]);

  return (
    <>
      <label
        htmlFor={"contribution-update-modal" + contributionId}
        className="hover:text-primary hover:cursor-pointer items-center text-center text-sm lg:text-md"
        onClick={() => isDisconnected && openConnectModal?.()}
      >
        <FontAwesomeIcon icon={faRefresh} className="mr-1" /> Update contribution
      </label>
      <input type="checkbox" id={"contribution-update-modal" + contributionId} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor={"contribution-update-modal" + contributionId}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-xl text-primary">Update contribution</h3>
          <form className="form-control mt-6">
            <label htmlFor="contribution-update-category" className="label max-w-lg font-semibold">
              <span className="label-text">Category</span>
            </label>
            <select
              id="contribution-update-category"
              className="mb-4 select select-bordered w-full max-w-lg focus:select-primary"
              onChange={(e) => setCategory(parseInt(e.target.value))}
            >
              {contributionCategories.map((category, index) => (
                <option key={category} value={index}>
                  {category}
                </option>
              ))}
            </select>
            <label htmlFor="contribution-update-title" className="label font-semibold">
              <span className="label-text">Title</span>
            </label>
            <input
              id="contribution-update-title"
              className="mb-4 input input-bordered w-full max-w-lg focus:input-primary"
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="contribution-update-url" className="label font-semibold">
              <span className="label-text">URL</span>
            </label>
            <input
              id="contribution-update-url"
              className="input input-bordered w-full max-w-lg focus:input-primary mb-5"
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn btn-primary" onClick={(e) => handleUpdate(e)}>
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
