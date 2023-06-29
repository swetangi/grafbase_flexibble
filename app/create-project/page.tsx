import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const CreateProject = async () => {
  const session = await getCurrentUser();

  //if we don't have a user then we have to simply redirect to the home page means we are not create post

  if (!session?.user) {
    redirect('/');
  }

  return (
    <Modal>
      <h3 className="modal-head-text">Create a New Project</h3>
      <ProjectForm type="create" session={session} />
    </Modal>
  );
};

export default CreateProject;
