import API from './API';

export const Create = (payload, { inDemoMode }) => API.post(inDemoMode ? '/public/fund' : '/fund', payload);
export const GetFunds = ({ inDemoMode }) => API.get(inDemoMode ? '/public/fund' : '/fund');
export const Update = ({ id, body }, { inDemoMode }) => API.patch(inDemoMode ? `/public/fund/${id}` : `/fund/${id}`, body);
export const Delete = (payload, { inDemoMode }) => API.delete(inDemoMode ? `/public/fund/${payload}` : `/fund/${payload}`);
