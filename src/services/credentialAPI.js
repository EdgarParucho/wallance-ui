import API from './API'

export const Sign = ({ OTP, body}) => API.post('/credentials/sign', body, { headers: { OTP } });
export const Login = (body) => API.post('/credentials/login', body)
export const RequestOTP = ({ token, body }) => API.post("/credentials/otp", body, { headers: { Authorization: `bearer ${token}` } });
export const ResetPassword = ({ OTP, ...body }) => API.patch("/credentials/reset", body, { headers: { OTP } });
