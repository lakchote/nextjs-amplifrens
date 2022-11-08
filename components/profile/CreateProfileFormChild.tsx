import { faArrowAltCircleLeft, faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "usehooks-ts";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import facadeAbi from "../../constants/abi.json";
import addressesJson from "../../constants/addresses.json";
import { useProfileContext } from "../../pages/_app";

export default function CreateProfileFormChild({
  username,
  websiteUrl,
  email,
  showParentForm,
  setShowParentForm,
}: {
  username: string;
  websiteUrl: string;
  email: string;
  showParentForm: boolean;
  setShowParentForm: Dispatch<SetStateAction<boolean>>;
}) {
  const { setProfileUsername } = useProfileContext();
  const [lensHandle, setLensHandle] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const router = useRouter();
  const debouncedUsername = useDebounce(username, 300);
  const { config } = usePrepareContractWrite({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "createUserProfile",
    args: [
      {
        lensHandle: lensHandle,
        discordHandle: discordHandle,
        twitterHandle: twitterHandle,
        username: username,
        email: email,
        websiteUrl: websiteUrl,
        valid: true,
      },
    ],
    enabled: Boolean(debouncedUsername),
  });
  const { write, data, isError, error } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleCreate = (e: React.FormEvent) => {
    write?.();
    e.preventDefault();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile created");
      setProfileUsername(debouncedUsername);
    }
    isLoading ? toast.info("Creating profile...") : isError && toast.error(`${"Error : " + error?.message}`);
  }, [isError, error, isSuccess, isLoading, router, debouncedUsername, setProfileUsername]);

  return (
    <>
      {showParentForm && (
        <button className="btn btn-sm btn-secondary text-neutral mt-3" onClick={() => setShowParentForm(false)}>
          <FontAwesomeIcon className="mr-1" icon={faArrowAltCircleRight} /> Next
        </button>
      )}
      {!showParentForm && (
        <>
          <button className="btn btn-sm btn-secondary text-neutral mt-3 mb-6" onClick={() => setShowParentForm(true)}>
            <FontAwesomeIcon className="mr-1" icon={faArrowAltCircleLeft} /> Previous
          </button>
          <label htmlFor="profile-create-lens" className="label font-semibold">
            <span className="label-text text-neutral">Lens handle</span>
          </label>
          <input
            id="profile-create-lens"
            placeholder={lensHandle}
            className="mb-4 input input-bordered w-full max-w-lg focus:input-neutral"
            onChange={(e) => setLensHandle(e.target.value)}
          />
          <label htmlFor="profile-create-twitter" className="label font-semibold">
            <span className="label-text text-neutral">Twitter</span>
          </label>
          <input
            id="profile-create-twitter"
            placeholder={twitterHandle}
            className="mb-4 input input-bordered w-full max-w-lg focus:input-neutral"
            onChange={(e) => setTwitterHandle(e.target.value)}
          />
          <label htmlFor="profile-create-discord" className="label font-semibold">
            <span className="label-text text-neutral">Discord</span>
          </label>
          <input
            id="profile-create-discord"
            placeholder={discordHandle}
            className="mb-4 input input-bordered w-full max-w-lg focus:input-neutral"
            onChange={(e) => setDiscordHandle(e.target.value)}
          />
          <button className="btn btn-accent text-neutral mt-3" onClick={handleCreate}>
            Create
          </button>
        </>
      )}
    </>
  );
}
