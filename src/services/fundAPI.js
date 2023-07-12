import API from './API';

export const Create = ({ token, ...body }) => API.post('/funds', body, { headers: { Authorization: `bearer ${token}` } });
export const Update = ({ id, body, token  }) => API.patch(`/funds/${id}`, body, { headers: { Authorization: `bearer ${token}` } });
export const Delete = ({ id, token }) => API.delete(`/funds/${id}`, { headers: { Authorization: `bearer ${token}` } });
