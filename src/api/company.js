import { $post, $cityPost } from '../axios/$axios'

export const getCompanyList = data => $post('/company/companyList', data);

export const getCompanyInfo = data => $post('/company/company_info', data);

export const companyCheck = data => $post('/company/save_status', data);

export const companyEdit = data => $post('/company/company_edit', data);

export const companyLog = data => $post('/company/company_log', data);

export const resetPassword = data => $post('/company/reset_password', data);

export const companyDel = data => $post('/company/company_del', data);

export const companyLock = data => $post('/company/save_lock', data);

export const getProvincesList = () => $cityPost('/company/getProvincesList')

export const getCitysList = data => $cityPost('/company/getCitysList',data)

export const getAreasList = data => $cityPost('/company/getAreasList',data)