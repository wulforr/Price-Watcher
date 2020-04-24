const initialState = {
  isloading: true,
  items: []
}

const watcherReducer = (state = initialState, action) => {
  switch(action.type){
    case 'TOGGLEISLOADING' : return {...state,isloading:!state.isloading}
    case 'SETITEMS': return {...state,items:action.items}
    default: return state
  }
}

export const toggleIsLoading = () => {
  return {
    type: 'TOGGLEISLOADING'
  }
}

export const setItems = (items) => {
  return {
    type: 'SETITEMS',
    items
  }
}

export default watcherReducer