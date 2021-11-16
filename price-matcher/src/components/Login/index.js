import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName, setPassword } from '../../reducers/loginReducer';
import { setUser, setLoggedIn } from '../../reducers/userReducer';
import userService from '../../services/user';
import watcherService from '../../services/watcher';
import { useHistory, Link } from 'react-router-dom';
import style from './style.module.css';

export default function Login() {
  const login = useSelector((state) => state.login);
  const user = useSelector((state) => state.User);

  const dispatch = useDispatch();
  const history = useHistory();

  const [loginBtnText, setLoginBtnText] = useState('Login');
  const [errorMsgText, setErrorMsgText] = useState('');

  useEffect(() => {
    if (user.isLoggedIn) {
      history.push('/watchers');
    }
  }, [user.isLoggedIn, history]);

  const handleUserNameChange = (e) => {
    dispatch(setUserName(e.target.value));
  };

  const handlePasswordChange = (e) => {
    dispatch(setPassword(e.target.value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginBtnText('Logging in...');
    const credentials = {
      userName: login.userName,
      password: login.password,
    };
    try {
      const res = await userService.loginHandler(credentials);
      watcherService.setToken(res.token);
      window.localStorage.setItem('userlogged', JSON.stringify(res));
      dispatch(setUser(res.userInfo));
      dispatch(setLoggedIn());
      history.push('/watchers');
    } catch (err) {
      setLoginBtnText('Login');
      setErrorMsgText('Username or Password is incorrect');
    }
  };

  const handleGuestLogin = async () => {
    setLoginBtnText('Logging in...');
    const credentials = {
      userName: 'guest',
      password: 'guest123',
    };
    try {
      const res = await userService.loginHandler(credentials);
      watcherService.setToken(res.token);
      window.localStorage.setItem('userlogged', JSON.stringify(res));
      dispatch(setUser(res.userInfo));
      dispatch(setLoggedIn());
      history.push('/watchers');
    } catch (err) {
      setLoginBtnText('Login');
      setErrorMsgText('There were some issues logging you in please try again');
    }
  };

  return (
    <div className={style.loginWrapper}>
      <div className={style.loginContainer}>
        <h1>Login</h1>
        <div className={style.formRow}>
          <label>Username</label>
          <input
            type="text"
            onChange={handleUserNameChange}
            value={login.userName}
            className={style.inputText}
          />
        </div>

        <div className={style.formRow}>
          <label>Password</label>
          <input
            type="password"
            onChange={handlePasswordChange}
            value={login.password}
            className={style.inputText}
          />
        </div>
        <button onClick={handleLogin} className={`btn ${style.loginBtn}`}>
          {loginBtnText}
        </button>
        <div className={style.guestUserText}>
          Login as a{' '}
          <span className={style.guestUserLink} onClick={handleGuestLogin}>
            Guest User.
          </span>
        </div>
        <div className={style.loginErrorMsg}>{errorMsgText}</div>
        <div className={style.loginText}>
          Don't have an account?
          <Link to="/signup" className={style.signupTextLink}>
            {' Register for free'}
          </Link>
        </div>
      </div>
    </div>
  );
}
