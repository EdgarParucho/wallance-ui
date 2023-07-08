import API from './API';

export const Update = ({ OTP, updateEntries }) => API.patch("/account", updateEntries, { headers: { OTP } });
export const Delete = ({ OTP }) => API.delete('/account', { headers: { OTP } });
