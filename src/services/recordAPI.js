import API from './API';

export const Find = (payload, { inDemoMode }) => API.get(inDemoMode ? '/public/records' : '/records', { params: payload });
export const Create = (payload, { inDemoMode }) => API.post(inDemoMode ? '/public/records' : '/records', payload);
export const Update = ({ id, body }, { inDemoMode }) => API.patch(inDemoMode ? `/public/records/${id}` : `/records/${id}`, body);
export const Delete = ({ id }, { inDemoMode }) => API.delete(inDemoMode ? `/public/records/${id}` : `/records/${id}`);
