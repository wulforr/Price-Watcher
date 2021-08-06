import React, { useEffect } from 'react';
import watcherService from '../../services/watcher';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading, removeIsLoading, setItems } from '../../reducers/watcherReducer';
import Login from '../Login';
import AddWatcher from '../AddWatcher';
import Notification from '../Notification';
import WatcherCard from '../WatcherCard';
import style from './style.module.css';

export default function AllWatchers() {
  const dispatch = useDispatch();
  const allWatchers = useSelector((state) => state.watchers);
  const isLoggedIn = useSelector((state) => state.User.isLoggedIn);
  const notification = useSelector((state) => state.notification);
  const isLoading = useSelector((state) => state.watchers.isloading);

  const fetchwatchers = async () => {
    if (isLoggedIn) {
      dispatch(setIsLoading());
      const res = await watcherService.getWatchers();
      dispatch(setItems(res));
      dispatch(removeIsLoading());
    }
  };

  useEffect(() => {
    console.log('mounted');
    return () => console.log('unmounted');
  }, []);

  useEffect(() => {
    console.log('allwatcher', isLoggedIn);
    fetchwatchers();
  }, [dispatch, isLoggedIn]);

  console.count('rendered');

  return isLoggedIn ? (
    <div className={style.allwatchers}>
      {notification.message.length > 0 ? <Notification /> : <></>}
      <AddWatcher fetchwatchers={fetchwatchers} />
      {allWatchers.items.length > 0 ? (
        allWatchers.items.map((ele) => <WatcherCard details={ele} key={ele._id} />)
      ) : (
        <div>
          {isLoading
            ? 'Please wait while we load your watchers'
            : 'Add some watcher to track their prices everyday.'}
        </div>
      )}
    </div>
  ) : (
    <Login />
  );
}
