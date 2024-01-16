import API from './API';

export const GetUser = () => API.get("/user");
export const UpdateUser = (payload) => API.patch("/user", payload);
export const DeleteUser = () => API.delete('/user');
