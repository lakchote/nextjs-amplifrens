import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useDebounce } from "usehooks-ts";
import contributionCategories from "../../../constants/categoryMapping";
import facadeAbi from "../../../constants/abi.json";
import addressesJson from "../../../constants/addresses.json";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function CreateContribution() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(0);
  const [url, setUrl] = useState("");
  const inputToggle = useRef<HTMLInputElement>(null);
  const debouncedUrl = useDebounce(url, 300);
  const { config } = usePrepareContractWrite({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "createContribution",
    args: [Number(category), title, debouncedUrl],
    enabled: Boolean(debouncedUrl),
  });
  const { write, data, isError, error } = useContractWrite(config);

  const { openConnectModal } = useConnectModal();
  const { isDisconnected } = useAccount();
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handlePost = (e: React.FormEvent) => {
    if (isDisconnected) openConnectModal?.();
    write?.();
    e.preventDefault();
  };

  useEffect(() => {
    isSuccess
      ? toast.success("Post created")
      : isLoading
      ? toast.info("Creating new post...")
      : isError && toast.error(`${"Error : " + error?.message}`);
    if (isSuccess) {
      setTimeout(() => {
        inputToggle!.current!.checked = false;
      }, 1000);
    }
  }, [isError, error, isSuccess, isLoading]);

  return (
    <>
      <label
        htmlFor="contribution-create-modal"
        className="flex btn btn-primary btn-sm lg:btn-md rounded-md items-center text-center hover:border-white border-transparent border-2 text-sm lg:text-md"
        onClick={() => isDisconnected && openConnectModal?.()}
      >
        New contribution
      </label>
      <input type="checkbox" id="contribution-create-modal" className="modal-toggle" ref={inputToggle} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label htmlFor="contribution-create-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>
          <h3 className="text-xl text-primary">Post a contribution</h3>
          <form className="form-control mt-6">
            <div className="justify-end items-center">
              <label htmlFor="contribution-create-category" className="max-w-lg font-semibold">
                Category
              </label>
              <select
                className="mb-4 select select-bordered w-full max-w-lg focus:select-primary"
                onChange={(e) => setCategory(parseInt(e.target.value))}
              >
                {contributionCategories.map((category, index) => (
                  <option key={category} value={index}>
                    {category}
                  </option>
                ))}
              </select>
              <label htmlFor="contribution-create-title" className="font-semibold">
                Title
              </label>
              <input
                id="contribution-create-title"
                className="mb-4 input input-bordered w-full max-w-lg focus:input-primary"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="contribution-create-url" className="font-semibold">
                URL
              </label>
              <input
                id="contribution-create-url"
                className="input input-bordered w-full max-w-lg focus:input-primary mb-5"
                onChange={(e) => setUrl(e.target.value)}
              />
              <button className="btn btn-primary" onClick={(e) => handlePost(e)}>
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}