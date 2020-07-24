import React from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import watcherService from '../services/watcher';
import { useSelector, useDispatch } from 'react-redux';
import { setItems } from '../reducers/watcherReducer';
import { addNotification, RemoveNotification } from '../reducers/notificationReducer';

export default function Watcher({ details }) {
  const history = useHistory();
  const items = useSelector((state) => state.watchers.items);
  const dispatch = useDispatch();

  const deleteWatcherWrapper = async (e) => {
    //stop propogation of events otherwise it would open details of watcher with chart
    e.stopPropagation();
    //make a copy of items before deleting
    const itemsBeforeDeletion = [...items];
    //remove item from state before removing from database to give user feeling that it is deleted
    const tempItems = items.filter((ele) => ele._id !== details._id);
    console.log(tempItems, details);
    dispatch(setItems(tempItems));
    try {
      await watcherService.deleteWatcher(details._id);
      dispatch(addNotification('Added watcher successfully'));
      setTimeout(() => dispatch(RemoveNotification()), 2000);
    } catch (err) {
      console.log(err);
      //if deletion of item is failed revert back changes
      dispatch(setItems(itemsBeforeDeletion));
      dispatch(addNotification('There was an error while adding the watcher please try again'));
      setTimeout(() => dispatch(RemoveNotification()), 2000);
    }
  };

  return (
    <div
      className="watcher"
      onClick={() => {
        history.push('/singleWatcher', { details });
      }}
    >
      <div className="topRight">
        {/* <div>Add</div> */}
        <div
          className="delete"
          onClick={(e) => {
            deleteWatcherWrapper(e);
          }}
        >
          <FontAwesomeIcon icon={faTrash} color="white" />
        </div>
      </div>
      <h3>{details.title}</h3>
      <p>yourprice - {details.maxPrice}</p>
      <p>currentPrice - {details.pastPrices[details.pastPrices.length - 1].price}</p>
    </div>
  );
}
