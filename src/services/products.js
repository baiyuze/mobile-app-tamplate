import request from '../utils/request';

export function query(number) {
  console.log(number)
  return request('/app/user/profile');
}
