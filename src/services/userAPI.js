import API from './API'

export const PreValidate = ({ email, mustBeNew }) => API.post(`/users/pre-validate?mustBeNew=${mustBeNew}`, { email });
export const Create = (body) => API.post('/users', body);
export const Update = ({ userID, OTP, body }) => API.patch(`/users/${userID}`, body, { headers: { OTP } });
export const Delete = ({ OTP, userID }) => API.delete(`/users/${userID}`, { headers: { OTP } });
