import CreateProfileFormParent from "../../components/profile/CreateProfileFormParent";

export default function CreateProfile() {
  return (
    <main className="container mt-8">
      <div className="text-center">
        <h2 className="text-2xl text-accent p-2 m-1">Create a profile (in less than 2mins)</h2>
        <p className="mt-2">
          Creating a profile enables you to <strong>amplify your network</strong> and <strong>make frens</strong>.
        </p>
      </div>
      <CreateProfileFormParent />
    </main>
  );
}
