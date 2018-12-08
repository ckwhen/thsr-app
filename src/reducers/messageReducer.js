const PATH = 'thsr-app/message/';
const SET_MESSAGE = `${PATH}SET_MESSAGE`;
const RESET_MESSAGE = `${PATH}RESET_MESSAGE`;

export function setMessage({
  title,
  message,
  onClose,
  onCancel,
} = {}) {
  return {
    type: SET_MESSAGE,
    payload: {
      title,
      message,
      onClose,
      onCancel,
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
  onCancel: undefined,
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
