const initialState = {
  isLoggedIn: false,
  userInfo: {
    userName:'',
    email:'',
    phone:''
  }
}

const userReducer = (state = initialState, action) => {
  switch(action.type){
    case 'TOGGLEISLOGGEDIN' : return {...state,isLoggedIn:!state.isLoggedIn}
    case 'SETUSER': return {...state, userInfo: action.userInfo}
    default: return state
  }
}

export const toggleLogin = () => {
  return({
    type: 'TOGGLEISLOGGEDIN'
  })
}

export const setUser = (userInfo) => {
  return({
    type: 'SETUSER',
    userInfo
  })
}

export default userReducer