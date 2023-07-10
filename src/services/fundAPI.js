import API from './API';

export const Create = (body) => API.post('/funds', body);
export const Update = ({ id, body }) => API.patch(`/funds/${id}`, body);
export const Delete = (id) => API.delete(`/funds/${id}`);
