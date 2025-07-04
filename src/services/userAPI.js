import API from './API';

export const GetUser = ({ inDemoMode }) => API.get(inDemoMode ? '/public/user' : '/user');
export const UpdateUser = (payload) => API.patch('/user', payload);
export const DeleteUser = () => API.delete('/user');
