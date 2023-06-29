import ProfilePage from "@/components/ProfilePage";
import { getUserProjects } from "@/lib/actions";
import { UserProfile } from "@/public/common.types";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const UserProfile = async ({ params }: Props) => {
  const result = (await getUserProjects(params.id, 100)) as {
    user: UserProfile;
  };
  //if there is no result in that case simply return message
  if (!result?.user) {
    return <p className="no-result-text">Failed to fetch user information</p>;
  }

  //if we have a result (user) then return profile page
  return <ProfilePage
  user={result?.user}
  />
};

export default UserProfile;
