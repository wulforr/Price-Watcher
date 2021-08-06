import React from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import watcherService from '../../services/watcher';
import { useSelector, useDispatch } from 'react-redux';
import { setItems } from '../../reducers/watcherReducer';
import {
  addNotification,
  RemoveNotification,
  setColor,
  setTimeoutId,
} from '../../reducers/notificationReducer';
import { getPrice, getFormattedText } from '../../utils/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { getPast30DaysData } from '../../utils/utils';
import style from './style.module.css';

export default function Watcher({ details }) {
  const history = useHistory();
  const items = useSelector((state) => state.watchers.items);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const data = getPast30DaysData(details.pastPrices);
  console.log('data', data);

  const deleteWatcherWrapper = async (e) => {
    //stop propogation of events otherwise it would open details of watcher with chart
    e.stopPropagation();
    //make a copy of items before deleting
    const itemsBeforeDeletion = [...items];
    //remove item from state before removing from database to give user feeling that it is deleted
    const tempItems = items.filter((ele) => ele._id !== details._id);
    console.log(tempItems, details);
    dispatch(setItems(tempItems));
    // clear timeout before creating a new timeout this clears if successive clicks from user
    clearTimeout(notification.timeoutId);
    try {
      await watcherService.deleteWatcher(details._id);
      dispatch(setColor('green'));
      dispatch(addNotification('Deleted watcher successfully'));
      const timeoutId = setTimeout(() => dispatch(RemoveNotification()), 2000);
      dispatch(setTimeoutId(timeoutId));
    } catch (err) {
      console.log(err);
      //if deletion of item is failed revert back changes
      dispatch(setItems(itemsBeforeDeletion));
      dispatch(setColor('red'));
      dispatch(addNotification('There was an error while deleting the watcher please try again'));
      const timeoutId = setTimeout(() => dispatch(RemoveNotification()), 2000);
      dispatch(setTimeoutId(timeoutId));
    }
  };

  return (
    <div
      className={style.watcher}
      onClick={() => {
        history.push('/singleWatcher', { details });
      }}
    >
      <div className={style.topRight}>
        {/* <div>Add</div> */}
        <div
          className={style.delete}
          onClick={(e) => {
            deleteWatcherWrapper(e);
          }}
        >
          <FontAwesomeIcon icon={faTrash} color="white" />
        </div>
      </div>
      <div className={style.cardContent}>
        <h3>{getFormattedText(details.title)}</h3>
        <div className={style.priceDetails}>
          <p>Current Price - {getPrice(details)}</p>
          <p>Threshold price - {details.maxPrice}</p>
        </div>
        <div className={style.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={300} height={100} data={data}>
              <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
