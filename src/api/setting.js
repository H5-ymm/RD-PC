import { post } from '../axios/$axios'

export const changeConfig = data => post('/config/changeConfig', data);