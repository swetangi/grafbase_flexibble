import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  projectsQuery,
  updateProjectMutation,
} from "@/graphql";
import { ProjectForm } from "@/public/common.types";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === "production";

const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
  : " http://127.0.0.1:4000/graphql";

const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
  : "letmein";

const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    //client request
    return await client.request(query, variables);
  } catch (err) {
    throw err;
  }
};

export const getUser = (email: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);
  const variables = {
    input: {
      name: name,
      email: email,
      avatarUrl: avatarUrl,
    },
  };
  return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken=async ()=>{
  try {

    const response= await fetch(`${serverUrl}/api/auth/token`);
    return response.json();
    
  } catch (error) {
    throw error;
  }
}

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  //upload image in cloudinary
  const imageUrl = await uploadImage(form.image);
  if (imageUrl.url) {
    client.setHeader('Authorization',`Bearer ${token}`);
    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

export const fetchAllProjects=async (category?:string,endcursor?:string)=>{
  client.setHeader("x-api-key", apiKey);

  return makeGraphQLRequest(projectsQuery,{category,endcursor})

}

export const getProjectDetails = (id:string)=>{
  client.setHeader("x-api-key", apiKey);

  return makeGraphQLRequest(getProjectByIdQuery,{id})

}

export const getUserProjects = (id:string , last ?: string)=>{
  client.setHeader("x-api-key", apiKey);

  return makeGraphQLRequest(getProjectsOfUserQuery,{id,last})

}

export const deleteProject = (id:string , token: string)=>{
  client.setHeader('Authorization',`Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation,{id})

}

export const updateProject = async (form:ProjectForm ,projectId:string , token: string)=>{
  //first we have to check if user has also redeployed their image already kept same image as before because may be only title change
  //so we need to check if url of image is base64 string if it is then it's a new upload if it's not if it contains cloudinary in there then it's an old upload
  function isBase64DataURL(value: string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/;
    return base64Regex.test(value);
  }

  let updatedForm={...form};
  const isUploadingNewImage = isBase64DataURL(form.image);

  //if we uploading a new image
  if(isUploadingNewImage)
  {
    const imageUrl=await uploadImage(form.image);

    if(imageUrl.url){
      updatedForm={
        ...form,
        image: imageUrl.url
      }
    }
  }
  const variables={
    id:projectId,
    input:updatedForm
  }
  client.setHeader('Authorization',`Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation,variables)

}