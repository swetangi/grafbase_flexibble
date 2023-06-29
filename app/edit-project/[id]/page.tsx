import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getProjectDetails } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import { ProjectInterface } from "@/public/common.types";
import { redirect } from "next/navigation";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();

  //if we don't have a user then we have to simply redirect to the home page means we are not create post

  if (!session?.user) {
    redirect("/");
  }

  const result = (await getProjectDetails(id)) as {
    project?: ProjectInterface;
  };

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>
      <ProjectForm type="edit" session={session} project={result?.project} />
    </Modal>
  );
};

export default EditProject;
