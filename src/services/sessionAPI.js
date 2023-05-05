import API from './API'

export const Login = (credentials) => API.post('/session/start', credentials)
export const GetOTP = (email) => API.post('/otp', email)
