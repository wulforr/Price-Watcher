import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {setPrice, setUrl, setItems} from '../reducers/watcherReducer'
import watcherService from '../services/watcher'

export default function AddWatcher() {
  const url = useSelector(state => state.watchers.url)
  const price = useSelector(state => state.watchers.price)
  const dispatch = useDispatch()

  const handleAddWatcher = async(e) => {
    e.preventDefault()
    const newWatcher = {
      url,
      maxPrice: price
    }
    try{
      const res = await watcherService.addWatcher(newWatcher)
      const update = await watcherService.getWatchers()
      dispatch(setItems(res))
    }
    catch(err){
      console.log(err)
    }
  }

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
