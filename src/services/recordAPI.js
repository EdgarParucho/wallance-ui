import API from './API';

export const Find = ({ token, filters }) => API.get("/records", { headers: { Authorization: `bearer ${token}` }, params: filters });
export const Create = ({ token, body }) => API.post('/records', body, { headers: { Authorization: `bearer ${token}` } });
export const Update = ({ token, id, body }) => API.patch(`/records/${id}`, body, { headers: { Authorization: `bearer ${token}` } });
export const Delete = ({ token, id }) => API.delete(`/records/${id}`, { headers: { Authorization: `bearer ${token}` } });
