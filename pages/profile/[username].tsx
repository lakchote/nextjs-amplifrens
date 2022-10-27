import { useQuery } from "@apollo/client";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
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
import BackToHomepage from "../../components/BackToHomepage";
import Link from "next/link";

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
    <main className="container">
      <div className="flex justify-center">
        {loadingGetProfileAddress && <div className="h-screen text-accent">Loading...</div>}
        <div className="card glass w-full lg:w-1/2 p-2 m-2">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-2">
              {profileInfo?.username
                ? profileInfo!.username
                : profileAddress === "" && username
                ? truncateStr(username!.toString(), 11)
                : username}
            </h2>
            {loadingSbtCount && <div className="text-accent">Loading...</div>}
            {!sbtCountData?.sbtleaderboards[0] && (
              <span className="badge badge-primary block mx-auto mt-2">
                {statusesMapping[parseInt(statusInfo?.toString() ?? "0")]}
              </span>
            )}
            {sbtCountData?.sbtleaderboards[0] && (
              <div className="my-8 bg-base-100 rounded-md p-8">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
                <Link
                  href={{
                    pathname: "/top-contributions/[username]",
                    query: { username: addressToQuery, profile: profileInfo?.username },
                  }}
                >
                  <a className="font-semibold cursor-pointer">
                    {sbtCountData.sbtleaderboards[0].topContributionsCount > 1
                      ? sbtCountData.sbtleaderboards[0].topContributionsCount + " top contributions"
                      : sbtCountData.sbtleaderboards[0].topContributionsCount + " top contribution"}
                  </a>
                </Link>
                <span className="badge badge-primary block mx-auto mt-2">
                  {statusesMapping[parseInt(statusInfo?.toString() ?? "0")]}
                </span>
              </div>
            )}
            {hasUserProfile && profileInfo && <ShowProfileSocialHandles socialHandles={profileInfo} />}
            <BackToHomepage />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowProfile;
