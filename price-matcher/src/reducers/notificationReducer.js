const initialState = '';

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADDNOTIFICATION':
      return action.message;
    case 'REMOVENOTIFICATION':
      return '';
    default:
      return state;
  }
};

export const addNotification = (message) => {
  return {
    type: 'ADDNOTIFICATION',
    message,
  };
};

export const RemoveNotification = () => {
  return {
    type: 'REMOVENOTIFICATION',
  };
};

export default notificationReducer;
