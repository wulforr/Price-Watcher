import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPrice, setUrl, setItems } from '../../reducers/watcherReducer';
import watcherService from '../../services/watcher';
import {
  addNotification,
  RemoveNotification,
  setColor,
  setTimeoutId,
} from '../../reducers/notificationReducer';
import style from './style.module.css';

export default function AddWatcher() {
  const url = useSelector((state) => state.watchers.url);
  const price = useSelector((state) => state.watchers.price);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const [addWatcherBtnText, setAddWatcherBtnText] = useState('Add Watcher');
  const [urlError, setUrlError] = useState('');
  const [priceError, setPriceError] = useState('');

  const checkValidation = () => {
    let isValid = true;
    const regexQuery =
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$';
    const urlRegex = new RegExp(regexQuery, 'i');
    console.log(urlRegex.test(url));
    if (!urlRegex.test(url)) {
      setUrlError('Please enter a valid Url');
      isValid = false;
    } else {
      setUrlError('');
    }
    if (isNaN(price) || isNaN(parseInt(price))) {
      setPriceError('Please enter a valid Number');
      isValid = false;
    } else {
      setPriceError('');
    }
    return isValid;
  };

  const handleAddWatcher = async (e) => {
    e.preventDefault();
    const isValid = checkValidation();
    if (!isValid) {
      return;
    }
    setAddWatcherBtnText('Adding...');
    const newWatcher = {
      url,
      maxPrice: price,
    };
    // clear timeout before creating a new timeout this clears if successive clicks from user
    clearTimeout(notification.timeoutId);
    try {
      const res = await watcherService.addWatcher(newWatcher);
      const update = await watcherService.getWatchers();
      // clear the inputs after adding the new watcher
      dispatch(setUrl(''));
      dispatch(setPrice(''));
      dispatch(setItems(update));
      //show notification for adding the new watcher
      dispatch(setColor('green'));
      dispatch(addNotification('Watcher added successfully'));
      const timeoutId = setTimeout(() => dispatch(RemoveNotification()), 2000);
      dispatch(setTimeoutId(timeoutId));
    } catch (err) {
      console.log(err);
      //show notification for error in adding the new watcher
      dispatch(setColor('red'));
      dispatch(addNotification('There was an error while adding the watcher please try again'));
      const timeoutId = setTimeout(() => dispatch(RemoveNotification()), 2000);
      dispatch(setTimeoutId(timeoutId));
    }
    //change the button text back to Add Watcher
    setAddWatcherBtnText('Add Watcher');
  };

  return (
    <div className={style.addWatcherWrapper}>
      <div className={style.formRow}>
        <label>URL</label>
        <input
          type="text"
          onChange={(e) => dispatch(setUrl(e.target.value))}
          value={url}
          className={style.inputText + ' ' + style.urlInput}
        />
        <p className={style.error}>{urlError}</p>
      </div>
      <div className={style.formRow + ' ' + style.priceInputRow}>
        <label>Price</label>
        <input
          type="text"
          onChange={(e) => dispatch(setPrice(e.target.value))}
          value={price}
          className={style.inputText + ' ' + style.priceInput}
        />
        <p className={style.error}>{priceError}</p>
      </div>
      <button className={`btn ${style.addWatcherBtn}`} onClick={handleAddWatcher}>
        {addWatcherBtnText}
      </button>
    </div>
  );
}
