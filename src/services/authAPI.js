import API from './API'

export const Sign = ({ OTP, body}) => API.post('/user', body, { headers: { OTP } });
export const Login = (body) => API.post('/auth/login', body)
export const RequestOTP = ({ token, body }) => API.post("/auth/otp", body, { headers: { Authorization: `bearer ${token}` } });
