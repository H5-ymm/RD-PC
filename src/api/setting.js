import { post, $post, upload } from '../axios/$axios'

export const changeConfig = data => post('/config/changeConfig', data);

export const getFkeyword = () => post('/config/getFkeyword');

export const saveFkeyword = (data) => $post('/config/saveFkeyword', data);

export const uploadFile = (data) => upload(data);