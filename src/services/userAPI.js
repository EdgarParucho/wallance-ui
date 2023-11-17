import API from './API';

export const Update = ({ OTP, updateEntries, token }) => API.patch("/user", updateEntries, { headers: { OTP, Authorization: `bearer ${token}` } });
export const Delete = ({ OTP, token }) => API.delete('/user', { headers: { OTP, Authorization: `bearer ${token}` } });
export const ResetPassword = ({ OTP, ...body }) => API.patch("/user/reset", body, { headers: { OTP } });
