import { combineReducers } from 'redux';
import message from './messageReducer';
import timetable from '../screens/Timetable/reducers';

const reducer = combineReducers({
  timetable,
  message,
});

export default reducer;
