import API from './API'

export const Find = (fundsIDs) => API.post('/records', fundsIDs)
export const Create = (record) => API.post('/record', record)
export const Update = (record) => API.put('/record', record)
export const Delete = (recordID) => API.delete(`/record/${recordID}`)
