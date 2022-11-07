import { useState } from "react";
import CreateProfileFormChild from "./CreateProfileFormChild";

export default function CreateProfileFormParent() {
  const [username, setUsername] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [showParentForm, setShowParentForm] = useState(true);

  return (
    <>
      <div className="flex justify-center">
        <ul className="steps steps-vertical lg:steps-horizontal mt-10">
          <li className={`step ${showParentForm && "step-accent text-neutral"}`}>General</li>
          <li className={`step ${!showParentForm && "step-accent"}`}>Social</li>
        </ul>
      </div>
      <div className="flex justify-center">
        <form className="mt-6">
          {showParentForm && (
            <>
              <label htmlFor="profile-create-username" className="label font-semibold">
                <span className="label-text text-neutral">
                  Username <span className="text-xs">(required)</span>
                </span>
              </label>
              <input
                id="profile-create-username"
                placeholder={username}
                className="mb-4 input input-bordered w-full max-w-lg focus:input-neutral"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="profile-create-website" className="label font-semibold">
                <span className="label-text text-neutral">Website</span>
              </label>
              <input
                id="profile-create-website"
                placeholder={websiteUrl}
                className="mb-4 input input-bordered w-full max-w-lg focus:input-neutral"
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <label htmlFor="profile-create-email" className="label font-semibold">
                <span className="label-text text-neutral">Email</span>
              </label>
              <input
                id="profile-create-email"
                placeholder={email}
                className="mb-4 input input-bordered w-full max-w-lg focus:input-neutral"
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
          <CreateProfileFormChild
            username={username}
            websiteUrl={websiteUrl}
            email={email}
            showParentForm={showParentForm}
            setShowParentForm={setShowParentForm}
          />
        </form>
      </div>
    </>
  );
}
