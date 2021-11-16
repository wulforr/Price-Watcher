import axios from 'axios';
const baseUrl = 'https://pricewatcherapi.herokuapp.com/api/user';
const watcherBaseUrl = 'https://pricewatcherapi.herokuapp.com/api/watcher';

let token = null;

let config = {
  headers: { Authorization: token },
};

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

const getWatchers = async () => {
  const res = await axios.get(baseUrl, config);
  return res.data;
};

const addWatcher = async (newWatcher) => {
  const res = await axios.post(watcherBaseUrl, newWatcher, config);

  return res.data;
};

const deleteWatcher = async (id) => {
  const res = await axios.delete(`${watcherBaseUrl}/${id}`, config);

  return res.data;
};

export default { setToken, getWatchers, addWatcher, deleteWatcher };
