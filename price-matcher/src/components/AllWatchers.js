import React, { useEffect } from 'react'
import watcherService from '../services/watcher'
import {useDispatch, useSelector} from 'react-redux'
import {setIsLoading, removeIsLoading, setItems} from '../reducers/watcherReducer'
import Login from './Login'
import AddWatcher from './AddWatcher'
// import watcher from './Watcher'
import Watcher from './Watcher'

export default function AllWatchers() {
  const dispatch = useDispatch()
  const allWatchers = useSelector(state => state.watchers)
  const isLoggedIn = useSelector(state => state.User.isLoggedIn)

  useEffect(() => {
    console.log('allwatcher', isLoggedIn)
    async function fetchwatchers(){
      if(isLoggedIn){
      dispatch(setIsLoading())
      const res = await watcherService.getWatchers()
      dispatch(setItems(res))
      dispatch(removeIsLoading())
    }}
    fetchwatchers()
  }, [dispatch, isLoggedIn])  

  // console.log(allWatchers)

  return (
    isLoggedIn ?
    <div className='allwatchers'>
      <AddWatcher />
      { allWatchers.items.map(ele => <Watcher details={ele} key={ele._id} />)  }
    </div> :
    <Login />
  )
}
