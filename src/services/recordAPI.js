import API from './API';

export const Find = (payload, { inDemoMode }) => API.get(inDemoMode ? '/public/record' : '/record', { params: payload });
export const Create = (payload, { inDemoMode }) => API.post(inDemoMode ? '/public/record' : '/record', payload);
export const Update = ({ id, body }, { inDemoMode }) => API.patch(inDemoMode ? `/public/record/${id}` : `/record/${id}`, body);
export const Delete = ({ id }, { inDemoMode }) => API.delete(inDemoMode ? `/public/record/${id}` : `/record/${id}`);
