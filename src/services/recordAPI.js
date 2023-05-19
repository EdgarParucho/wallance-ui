import API from './API';

export const Find = (userFunds) => API.get(`/records/${userFunds}`);
export const Create = (body) => API.post('/records', body);
export const Update = ({ userID, _id, body }) => API.patch(`/records/${userID}/${_id}`, body);
export const Delete = ({ userID, _id }) => API.delete(`/records/${userID}/${_id}`);
