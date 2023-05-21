import API from './API';

export const Create = (body) => API.post('/funds', body);
export const Update = ({ userID, _id, body }) => API.patch(`/funds/${userID}/${_id}`, body);
export const Delete = ({ userID, _id, defaultFundID }) => API.delete(`/funds/${userID}/${_id}`, { data: { defaultFundID } });
