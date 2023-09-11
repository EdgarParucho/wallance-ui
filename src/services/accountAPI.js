import API from './API';

export const Update = ({ OTP, updateEntries, token }) => API.patch("/account", updateEntries, { headers: { OTP, Authorization: `bearer ${token}` } });
export const Delete = ({ OTP, token }) => API.delete('/account', { headers: { OTP, Authorization: `bearer ${token}` } });
