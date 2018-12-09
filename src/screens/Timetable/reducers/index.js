import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { keyBy } from 'lodash';
import { CALL_API } from '../../../middlewares/api';
import { THSR_API_SERVER } from '../../../configs';
import {
  DATE_FORMAT,
  TIME_FORMAT,
} from '../../../constants';
import {
  hasAvailableSeat,
  noAvailableSeat,
  isRegularTicket,
  isBusinessTicket,
} from '../../../utils';

momentDurationFormatSetup(moment);

const PATH = 'thsr-app/timetable/';
const FETCH_STATIONS_REQUEST = `${PATH}FETCH_STATIONS_REQUEST`;
const FETCH_STATIONS_SUCCESS = `${PATH}FETCH_STATIONS_SUCCESS`;
const FETCH_STATIONS_FAILURE = `${PATH}FETCH_STATIONS_FAILURE`;
const FETCH_DAILY_TIMETABLE_REQUEST = `${PATH}FETCH_DAILY_TIMETABLE_REQUEST`;
const FETCH_DAILY_TIMETABLE_SUCCESS = `${PATH}FETCH_DAILY_TIMETABLE_SUCCESS`;
const FETCH_DAILY_TIMETABLE_FAILURE = `${PATH}FETCH_DAILY_TIMETABLE_FAILURE`;
const FETCH_OD_FARE_REQUEST = `${PATH}FETCH_OD_FARE_REQUEST`;
const FETCH_OD_FARE_SUCCESS = `${PATH}FETCH_OD_FARE_SUCCESS`;
const FETCH_OD_FARE_FAILURE = `${PATH}FETCH_OD_FARE_FAILURE`;
const FETCH_AVAILABLE_SEAT_STATUS_LIST_REQUEST = `${PATH}FETCH_AVAILABLE_SEAT_STATUS_LIST_REQUEST`;
const FETCH_AVAILABLE_SEAT_STATUS_LIST_SUCCESS = `${PATH}FETCH_AVAILABLE_SEAT_STATUS_LIST_SUCCESS`;
const FETCH_AVAILABLE_SEAT_STATUS_LIST_FAILURE = `${PATH}FETCH_AVAILABLE_SEAT_STATUS_LIST_FAILURE`;
const LOAD_TIMETABLE_REQUEST = `${PATH}LOAD_TIMETABLE_REQUEST`;
const LOAD_TIMETABLE_SUCCESS = `${PATH}LOAD_TIMETABLE_SUCCESS`;
const LOAD_TIMETABLE_FAILURE = `${PATH}LOAD_TIMETABLE_FAILURE`;
const SET_ORIGIN_STATION = `${PATH}SET_ORIGIN_STATION`;
const SET_DESTINATION_STATION = `${PATH}SET_DESTINATION_STATION`;

const initialState = {
  todayObj: moment(),
  originStationID: '',
  destinationStationID: '',
  isStationsFetched: false,
  stations: [],
  isTimetableFetched: false,
  timetable: [],
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIONS_REQUEST:
      return Object.assign({}, state, {
        isStationsFetched: false,
      });
    case FETCH_STATIONS_SUCCESS:
      return Object.assign({}, state, {
        isStationsFetched: true,
        stations: action.response,
      });
    case FETCH_STATIONS_FAILURE:
      return Object.assign({}, state, {
        isStationsFetched: true,
      });
    case LOAD_TIMETABLE_REQUEST:
      return Object.assign({}, state, {
        isTimetableFetched: false,
      });
    case LOAD_TIMETABLE_SUCCESS:
      return Object.assign({}, state, {
        isTimetableFetched: true,
        timetable: action.payload,
      });
    case LOAD_TIMETABLE_FAILURE:
      return Object.assign({}, state, {
        isTimetableFetched: true,
      });
    case SET_ORIGIN_STATION:
    case SET_DESTINATION_STATION:
      return Object.assign({}, state, {
        [action.payload.valueName]: action.payload.value,
      });
    default:
      return state;
  }
}

function setSearchQuery(actionType, valueName, value) {
  return {
    type: actionType,
    payload: {
      valueName,
      value,
    },
  };
}

export function setOriginStation(value) {
  return setSearchQuery(SET_ORIGIN_STATION, 'originStationID', value);
}

export function setDestinationStation(value) {
  return setSearchQuery(SET_DESTINATION_STATION, 'destinationStationID', value);
}

// 取得車站資訊
export function fetchStations() {
  return {
    [CALL_API]: {
      url: `${THSR_API_SERVER}Station`,
      params: {
        $top: 30,
        $format: 'JSON',
      },
      types: [
        FETCH_STATIONS_REQUEST,
        FETCH_STATIONS_SUCCESS,
        FETCH_STATIONS_FAILURE,
      ],
    },
  };
}

// 取得該日起迄站時刻表
export function fetchDailyTimetable(originStationID, destinationStationID, trainDate) {
  return {
    [CALL_API]: {
      url: `${THSR_API_SERVER}DailyTimetable/OD/${originStationID}/to/${destinationStationID}/${trainDate}`,
      params: {
        $orderby: 'OriginStopTime/DepartureTime',
      },
      types: [
        FETCH_DAILY_TIMETABLE_REQUEST,
        FETCH_DAILY_TIMETABLE_SUCCESS,
        FETCH_DAILY_TIMETABLE_FAILURE,
      ],
    },
  };
}

// 取得起迄站票價
export function fetchODFare(originStationID, destinationStationID) {
  return {
    [CALL_API]: {
      url: `${THSR_API_SERVER}ODFare/${originStationID}/to/${destinationStationID}`,
      types: [
        FETCH_OD_FARE_REQUEST,
        FETCH_OD_FARE_SUCCESS,
        FETCH_OD_FARE_FAILURE,
      ],
    },
  };
}

// 取得動態指定車站對號座剩餘座位
export function fetchAvailableSeatStatusList(stationID) {
  return {
    [CALL_API]: {
      url: `${THSR_API_SERVER}AvailableSeatStatusList/${stationID}`,
      types: [
        FETCH_AVAILABLE_SEAT_STATUS_LIST_REQUEST,
        FETCH_AVAILABLE_SEAT_STATUS_LIST_SUCCESS,
        FETCH_AVAILABLE_SEAT_STATUS_LIST_FAILURE,
      ],
    },
  };
}

// 取得時刻表表格資料
export function loadTimetable(originStationID, destinationStationID) {
  return (dispatch, getState) => {
    const { todayObj } = getState().timetable;
    dispatch({ type: LOAD_TIMETABLE_REQUEST });
    return Promise.all([
      dispatch(fetchDailyTimetable(
        originStationID,
        destinationStationID,
        todayObj.format(DATE_FORMAT),
      )),
      dispatch(fetchODFare(originStationID, destinationStationID)),
      dispatch(fetchAvailableSeatStatusList(originStationID)),
    ])
      .then((response) => {
        const [dailyTimetable, odFare, availableSeatStatusList] = response;
        const fares = (odFare && odFare.length && odFare[0].fares) || [];
        let availableSeatHash = {};
        if (
          availableSeatStatusList
          && availableSeatStatusList.length
        ) {
          availableSeatHash = keyBy(availableSeatStatusList[0].availableSeats, 'trainNo');
        }

        const timetable = dailyTimetable
          .map((time) => {
            const {
              trainDate,
              originStopTime,
              destinationStopTime,
              dailyTrainInfo: {
                trainNo,
                direction,
              },
            } = time;
            const originDepartureTime = moment(originStopTime.departureTime, TIME_FORMAT);
            const destinationArrivalTime = moment(destinationStopTime.arrivalTime, TIME_FORMAT);

            // 取得迄站的剩餘座位資料
            const trainWithAvailableSeat = availableSeatHash[trainNo];
            let stopStation = {};
            if (
              trainWithAvailableSeat
              && trainWithAvailableSeat.stopStations
              && trainWithAvailableSeat.stopStations.length
            ) {
              stopStation = trainWithAvailableSeat.stopStations
                .find(station => station.stationID === destinationStopTime.stationID);
            }
            const {
              businessSeatStatus,
              standardSeatStatus,
            } = stopStation;

            // 取得總乘車時間
            const totalTime = moment
              .duration(destinationArrivalTime.diff(originDepartureTime), 'milliseconds')
              .format(TIME_FORMAT, { trim: false });

            // 取得票價
            let fare = 0;
            let isBusinessSeat = false;
            if (hasAvailableSeat(standardSeatStatus)) {
              fare = fares.find(item => isRegularTicket(item.ticketType)).price;
            } else if (hasAvailableSeat(businessSeatStatus)) {
              isBusinessSeat = true;
              fare = fares.find(item => isBusinessTicket(item.ticketType)).price;
            }

            // 過濾條件
            if (
              // 排除尚未發車的車次
              originDepartureTime.isSameOrBefore(todayObj)
              // 排除標準車箱與商務車箱皆已滿坐的車次
              || (noAvailableSeat(businessSeatStatus) && noAvailableSeat(standardSeatStatus))
            ) {
              return null;
            }
            return Object.assign({}, {
              trainNo,
              trainDate,
              direction,
              totalTime,
              fare,
              isBusinessSeat,
              originStationName: originStopTime.stationName,
              originDepartureTime: originStopTime.departureTime,
              destinationStationName: destinationStopTime.stationName,
              destinationArrivalTime: destinationStopTime.arrivalTime,
            });
          })
          // 排除不符合過濾條件的車次
          .filter(time => time);

        dispatch({
          type: LOAD_TIMETABLE_SUCCESS,
          payload: timetable,
        });
        return Promise.resolve(timetable);
      })
      .catch((error) => {
        dispatch({ type: LOAD_TIMETABLE_FAILURE });
        return Promise.reject(error);
      });
  };
}
