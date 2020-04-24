import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {setUserName, setPassword} from '../reducers/loginReducer'
import {setUser, toggleLogin} from '../reducers/userReducer'
import userService from '../services/user'
import watcherService from '../services/watcher'
import {useHistory} from 're'

export default function Login() {
  const login = useSelector(state => state.login)
  
  const dispatch = useDispatch()
  
  const handleUserNameChange = (e) => {
    dispatch(setUserName(e.target.value))
  }
  
  const handlePasswordChange = (e) => {
    dispatch(setPassword(e.target.value))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const credentials = {
      userName: login.userName,
      password: login.password
    }
    console.log(credentials)
    const res = await userService.loginHandler(credentials)
    watcherService.setToken(res.token)
    window.localStorage.setItem('userlogged',JSON.stringify(res))
    dispatch(setUser(res.userInfo))
    dispatch(toggleLogin())
    console.log(res)

  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type='text' onChange= {handleUserNameChange} value={login.userName} />
        <input type='text' onChange= {handlePasswordChange} value={login.password} />
        <button onClick={handleLogin} >Login</button>
      </form>
    </div>
  )
}
