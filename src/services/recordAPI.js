import API from './API';

export const Find = (payload) => API.get("/records", { params: payload });
export const Create = (payload) => API.post('/records', payload);
export const Update = ({ id, body }) => API.patch(`/records/${id}`, body);
export const Delete = ({ id }) => API.delete(`/records/${id}`);
