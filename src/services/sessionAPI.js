import API from './API'

export const Login = (body) => API.post('/session/start', body)
