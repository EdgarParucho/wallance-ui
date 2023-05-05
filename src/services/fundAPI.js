import API from './API';

export const Find = (userID) => API.get(`/funds/${userID}`);
export const Create = (body) => API.post('/funds', body);
export const Update = ({ userID, _id, body }) => API.patch(`/funds/${userID}/${_id}`, body);
export const Delete = ({ userID, _id, defaultFundID }) => API.delete(`/funds/${_id}`, { data: { userID, defaultFundID } });
