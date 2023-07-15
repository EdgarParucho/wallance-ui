import API from './API'

export const Sign = ({ OTP, body}) => API.post('/credentials/sign', body, { headers: { OTP } });
export const Login = (body) => API.post('/credentials/login', body)
export const RequestOTP = (body) => API.post("/credentials/otp", body);
export const ResetPassword = ({ OTP, ...body }) => API.patch("/credentials/reset", body, { headers: { OTP } });
