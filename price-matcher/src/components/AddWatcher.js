import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {setPrice, setUrl} from '../reducers/watcherReducer'
import watcherService from '../services/watcher'

export default function AddWatcher() {
  const url = useSelector(state => state.watchers.url)
  const price = useSelector(state => state.watchers.price)

  const handleAddWatcher = async(e) => {
    e.preventDefault()
    const newWatcher = {
      url,
      maxPrice: price
    }
    await watcherService.addWatcher(newWatcher)
  }

  const dispatch = useDispatch()
  return (
    <div className='addwatcher' >
      <div className='inputSet'>
      <label>URL</label>
      <input type='text' onChange={e=> dispatch(setUrl(e.target.value))} value={url} className='inputText urlInput'/>
      </div>
      <div className='inputSet priceInputRow'>
      <label>Price</label>
      <input type='text' onChange={e=> dispatch(setPrice(e.target.value))} value={price} className='inputText priceInput'/>
      </div>
      <button className='btn addwatcherbtn' onClick={handleAddWatcher} >Add Watcher</button>
    </div>
  )
}
