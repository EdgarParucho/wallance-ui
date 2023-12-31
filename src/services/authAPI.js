import API from './API'

export const Login = (payload) => API.post('/auth/login', payload);
// TODO: Delegate OTP management to Auth0
export const Sign = ({ OTP, body}) => API.post('/user', body, { headers: { OTP } });
export const RequestOTP = ({ token, body }) => API.post("/auth/otp", body);
