import { NextPage } from "next";
import CreateProfileFormParent from "../../components/profile/CreateProfileFormParent";

const CreateProfile: NextPage = () => {
  return (
    <main className="container mt-8 lg:mt-10">
      <div className="text-center">
        <h2 className="text-2xl text-primary p-2 m-1">Create a profile (in less than 2mins)</h2>
        <p className="mt-2">
          Creating a profile enables you to{" "}
          <span className="text-secondary">
            <strong>amplify your network</strong>
          </span>{" "}
          and{" "}
          <span className="text-secondary">
            <strong>make frens</strong>
          </span>
          .
        </p>
      </div>
      <CreateProfileFormParent />
    </main>
  );
};

export default CreateProfile;
