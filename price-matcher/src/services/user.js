import axios from 'axios';
const baseUrl = 'https://pricewatcherapi.herokuapp.com/api/user';

const loginHandler = async (credentials) => {
  const res = await axios.post(`${baseUrl}/login`, credentials);
  return res.data;
};
const signupHandler = async (credentials) => {
  const res = await axios.post(baseUrl, credentials);
  return res.data;
};

export default { loginHandler, signupHandler };
