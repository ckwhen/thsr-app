import { combineReducers } from 'redux';
import timetable from '../screens/Timetable/reducers';

const reducer = combineReducers({
  timetable,
});

export default reducer;
