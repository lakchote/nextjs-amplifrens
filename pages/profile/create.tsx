import { NextPage } from "next";
import CreateProfileFormParent from "../../components/profile/CreateProfileFormParent";

const CreateProfile: NextPage = () => {
  return (
    <main className="container p-10 bg-cover">
      <div className="text-center">
        <h2 className="text-2xl text-neutral p-2 m-1">Create a profile</h2>
        <p className="mt-2 text-neutral">
          Creating a profile enables you to <strong>amplify your network </strong>
          and <strong>make frens</strong>.
        </p>
      </div>
      <CreateProfileFormParent />
    </main>
  );
};

export default CreateProfile;
