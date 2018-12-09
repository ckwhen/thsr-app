const PATH = 'thsr-app/message/';
export const SET_MESSAGE = `${PATH}SET_MESSAGE`;
export const RESET_MESSAGE = `${PATH}RESET_MESSAGE`;

export function setMessage({
  title,
  message,
  onClose,
} = {}) {
  return {
    type: SET_MESSAGE,
    payload: {
      title,
      message,
      onClose,
    },
  };
}
export function resetMessage() {
  return {
    type: RESET_MESSAGE,
  };
}

const initialState = {
  title: '',
  message: '',
  onClose: undefined,
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return Object.assign({}, state, action.payload);
    case RESET_MESSAGE:
      return initialState;
    default:
      return state;
  }
}
