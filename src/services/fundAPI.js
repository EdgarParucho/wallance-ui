import API from './API';

export const Create = (payload) => API.post('/funds', payload);
export const Update = ({ id, body }) => API.patch(`/funds/${id}`, body);
export const Delete = (payload) => API.delete(`/funds/${payload}`);
