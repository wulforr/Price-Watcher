import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {setUserName, setPassword, setEmail, setPhone} from '../reducers/signupReducer'
import {useHistory} from 'react-router-dom'
import userService from '../services/user'
import {setUser, setLoggedIn} from '../reducers/userReducer'
import watcherService from '../services/watcher'

export default function Signup() {
  const signup = useSelector(state => state.signup)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleUserNameChange = (e) => {
    dispatch(setUserName(e.target.value))
  }
  const handlePasswordChange = (e) => {
    dispatch(setPassword(e.target.value))
  }
  const handleEmailChange = (e) => {
    dispatch(setEmail(e.target.value))
  }
  const handlePhoneChange = (e) => {
    dispatch(setPhone(e.target.value))
  }

  const handleSignup = async () => {
    const credentials = {
      userName: signup.userName,
      password: signup.password,
      email: signup.email,
      phone: signup.phone
    }
    const res = await userService.signupHandler(credentials)
    dispatch(setUser(res.userInfo))
    dispatch(setLoggedIn())
    watcherService.setToken(res.token)
    window.localStorage.setItem('loggedUser',JSON.stringify(res))
    history.push('/watchers')
  }

  return (
    <div>
      <h1>Signup</h1>
      <input type='text'  onChange={handleUserNameChange} value={signup.userName}/>
      <input type='text' value={signup.password} onChange={handlePasswordChange} />
      <input type='text' value={signup.email} onChange={handleEmailChange} />
      <input type='text' value={signup.phone} onChange={handlePhoneChange} />
      <button className='btn signupbtn' onClick={handleSignup} >Signup</button>
    </div>
  )
}
