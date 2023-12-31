import API from './API';

export const Update = (payload) => API.patch("/user", payload);
export const Delete = () => API.delete('/user');

// TODO: Delegate OTP management to Auth0
export const ResetPassword = ({ OTP, ...body }) => API.patch("/user/reset", body, { headers: { OTP } });
