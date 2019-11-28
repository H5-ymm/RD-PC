import { $post } from '../axios/$axios'

export const goLogin = data => $post('/login/login', data);