import API from './API'

export const Create = (credentials) => API.post('/user', credentials)
export const UpdatePassword = (data) => API.put('/password', data)
export const UpdateEmail = (data) => API.put('/email', data)
export const DeleteAccount = (data) => API.delete(`/user/${data.userID}`, { headers: { 'OTP': data.token } })
