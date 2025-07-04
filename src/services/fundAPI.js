import API from './API';

export const Create = (payload, { inDemoMode }) => API.post(inDemoMode ? '/public/funds' : '/funds', payload);
export const Update = ({ id, body }, { inDemoMode }) => API.patch(inDemoMode ? `/public/funds/${id}` : `/funds/${id}`, body);
export const Delete = (payload, { inDemoMode }) => API.delete(inDemoMode ? `/public/funds/${payload}` : `/funds/${payload}`);
