    import React, {useEffect} from 'react'
    import {BrowserRouter, Switch, Route} from 'react-router-dom'
    import App from './components/App'
    import Login from './components/Login'
    import Signup from './components/Signup'
    import AllWatchers from './components/AllWatchers'
    import watcherService from './services/watcher'
    import { useDispatch } from 'react-redux'
    import {setUser, setLoggedIn} from './reducers/userReducer'
    import SingleWatcher from './components/SingleWatcher'

    export default function Router() {
      const dispatch = useDispatch()
      useEffect(() => {
        console.log('router')
        const user = window.localStorage.getItem('userlogged')
        if(user){
          const userdata = JSON.parse(user)
          // console.log(userdata)
          watcherService.setToken(userdata.token)
          dispatch(setUser(userdata.userInfo))
          dispatch(setLoggedIn())
        }
      }, [dispatch])

      return (
        <div className='container' >
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={App} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={Signup} />
              <Route path='/watchers' component={AllWatchers} />
              <Route path='/singleWatcher' component={SingleWatcher} />
            </Switch>
          </BrowserRouter>
        </div>
      )
    }
