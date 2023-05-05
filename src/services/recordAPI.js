import API from './API'

export const Find = (fundsIDs) => API.post('/records', fundsIDs)
export const Create = (record) => API.post('/records', record)
export const Update = (record) => API.put('/records', record)
export const Delete = (recordID) => API.delete(`/records/${recordID}`)
