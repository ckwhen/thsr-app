import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import callApi from './middlewares/api';
import rootReducer from './reducers';

const middlewares = [];

if (process.env.NODE_ENV === 'production') {
  middlewares.push(callApi, thunk);
} else {
  middlewares.push(callApi, thunk, logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const store = createStoreWithMiddleware(rootReducer, {});

export default store;
