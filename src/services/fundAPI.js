import API from './API'

export const Find = (userID) => API.get(`/funds/${userID}`)
export const Create = (fund) => API.post('/fund', fund)
export const Update = (fund) => API.put('/fund', fund)
export const Delete = (fundID) => API.delete(`/fund/${fundID}`)
