import reducer, {
  SET_MESSAGE,
  RESET_MESSAGE,
  setMessage,
  resetMessage,
} from '../reducers/messageReducer';

describe('actions', () => {
  it('should create an action to set message', () => {
    const mockFn = jest.fn();
    const params = {
      title: '訊息',
      message: 'Run the tests',
      onClose: mockFn,
    };
    const expectedAction = {
      type: SET_MESSAGE,
      payload: params,
    };
    expect(setMessage(params)).toEqual(expectedAction)
  });

  it('should create an action to reset message', () => {
    const expectedAction = {
      type: RESET_MESSAGE,
    };
    expect(resetMessage()).toEqual(expectedAction)
  });
});

describe('message reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      title: '',
      message: '',
      onClose: undefined,
    });
  });

  it('should handle SET_MESSAGE', () => {
    const mockFn = jest.fn();
    expect(
      reducer(undefined, {
        type: SET_MESSAGE,
        payload: {
          title: '訊息',
          message: 'Run the tests',
          onClose: mockFn,
        },
      })
    ).toEqual({
      title: '訊息',
      message: 'Run the tests',
      onClose: mockFn,
    });
  });

  it('should handle RESET_MESSAGE', () => {
    expect(
      reducer(undefined, {
        type: RESET_MESSAGE,
      })
    ).toEqual({
      title: '',
      message: '',
      onClose: undefined,
    });
  });
});
