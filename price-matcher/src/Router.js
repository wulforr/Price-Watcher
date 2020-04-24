import React, {useEffect} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import App from './components/App'
import Login from './components/Login'
import Signup from './components/Signup'
import AllWatchers from './components/AllWatchers'
import watcherService from './services/watcher'
import { useDispatch } from 'react-redux'
import {setUser, toggleLogin} from './reducers/userReducer'

export default function Router() {
  const dispatch = useDispatch()
  useEffect(() => {
    const user = window.localStorage.getItem('userlogged')
    if(user){
      const userdata = JSON.parse(user)
      watcherService.setToken(user.token)
      dispatch(setUser(userdata.userInfo))
      dispatch(toggleLogin())
    }
  }, [dispatch])

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={App} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <Route path='/watchers' component={AllWatchers} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
