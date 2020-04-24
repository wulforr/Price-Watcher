import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {setUserName, setPassword, setEmail, setPhone} from '../reducers/signupReducer'

export default function Signup() {
  const signup = useSelector(state => state.signup)
  console.log(signup)
  const dispatch = useDispatch()

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

  return (
    <div>
      <h1>Signup</h1>
      <input type='text'  onChange={handleUserNameChange} value={signup.userName}/>
      <input type='text' value={signup.password} onChange={handlePasswordChange} />
      <input type='text' value={signup.email} onChange={handleEmailChange} />
      <input type='text' value={signup.phone} onChange={handlePhoneChange} />
      <button>Signup</button>
    </div>
  )
}
