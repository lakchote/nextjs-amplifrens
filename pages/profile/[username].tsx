import { useQuery } from "@apollo/client";
import { faArrowLeft, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { GET_PROFILE_ADDRESS, GET_SBT_COUNT } from "../../constants/subgraphQueries";
import truncateStr from "../../utils/truncate";
import addressesJson from "../../constants/addresses.json";
import facadeAbi from "../../constants/abi.json";
import ShowProfileSocialHandles from "../../components/profile/ShowProfileSocialHandles";
import statusesMapping from "../../constants/statusMapping";
import Link from "next/link";
import Avatar from "boring-avatars";

const ShowProfile: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [profileAddress, setProfileAddress] = useState<string>("");
  const [addressToQuery, setAddressToQuery] = useState<string | undefined>("");
  const { data: getProfileAddress, loading: loadingGetProfileAddress } = useQuery(GET_PROFILE_ADDRESS, {
    variables: {
      username: username,
    },
  });

  const { data: sbtCountData, loading: loadingSbtCount } = useQuery(GET_SBT_COUNT, {
    variables: {
      address: addressToQuery,
    },
  });

  const { data: hasUserProfile } = useContractRead({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "hasUserProfile",
    args: addressToQuery,
    enabled: Boolean(addressToQuery),
  });

  const { data: profileInfo } = useContractRead({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "getUserProfile",
    args: addressToQuery,
    enabled: Boolean(hasUserProfile),
  });

  const { data: statusInfo } = useContractRead({
    addressOrName: addressesJson[process.env.NEXT_PUBLIC_CHAIN_ID as keyof typeof addressesJson].address,
    contractInterface: facadeAbi,
    functionName: "sbtStatus",
    args: addressToQuery,
    enabled: Boolean(addressToQuery),
  });

  useEffect(() => {
    if (getProfileAddress?.profiles.length > 0) {
      setProfileAddress(getProfileAddress!.profiles[0].address);
      setAddressToQuery(getProfileAddress!.profiles[0].address);
    } else {
      setAddressToQuery(username?.toString());
    }
  }, [getProfileAddress, username]);

  return (
    <main className="container pt-6 px-2 lg:p-10 bg-cover">
      <div className="flex justify-center">
        {loadingGetProfileAddress && <div className="h-screen text-accent">Loading...</div>}
        <div className="border flex-col border-gray-800 rounded-lg bg-base-100 w-full lg:w-1/2 pb-10">
          <div className="items-center text-center">
            <div className="flex pt-6 pl-4">
              <a
                className="cursor-pointer hover:text-neutral"
                onClick={() => {
                  router.back();
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              </a>
            </div>
            <div className="pt-6 pb-4 flex justify-center">
              <Avatar
                size={100}
                name={profileInfo?.username ?? username}
                variant="beam"
                colors={["#4610AD", "#5F74EA", "#491F98", "#35068C", "#491F98", "#D1E0FF"]}
              />
            </div>
            <h2 className="text-2xl lg:text-3xl mb-2">
              <span className="text-neutral">
                {profileInfo?.username
                  ? profileInfo!.username
                  : profileAddress === "" && username
                  ? truncateStr(username!.toString(), 11)
                  : username}
              </span>
            </h2>
            {loadingSbtCount && <div className="text-neutral">Loading...</div>}
            <span className="badge badge-accent block mx-auto mt-2">
              {statusesMapping[parseInt(statusInfo?.toString() ?? "0")]}
            </span>
            {sbtCountData?.sbtleaderboards[0] && (
              <div className="pt-6">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
                <Link
                  href={{
                    pathname: "/top-contributions/[username]",
                    query: { username: addressToQuery },
                  }}
                >
                  <a className="font-semibold cursor-pointer text-accent-content hover:text-neutral">
                    {sbtCountData.sbtleaderboards[0].topContributionsCount > 1
                      ? sbtCountData.sbtleaderboards[0].topContributionsCount + " top contributions"
                      : sbtCountData.sbtleaderboards[0].topContributionsCount + " top contribution"}
                  </a>
                </Link>
              </div>
            )}
            <div className="mt-8 lg:pt-6 flex flex-row justify-evenly">
              {hasUserProfile && profileInfo && <ShowProfileSocialHandles socialHandles={profileInfo} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowProfile;
