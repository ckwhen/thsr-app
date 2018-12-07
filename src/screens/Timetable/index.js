import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Selector from '../../components/Selector';
import {
  setOriginStation,
  setDestinationStation,
  fetchStations,
  loadTimetable,
} from './reducers';

const propTypes = {
  loadTimetable: PropTypes.func,
  setOriginStation: PropTypes.func,
  setDestinationStation: PropTypes.func,
  fetchStations: PropTypes.func,
  originStationID: PropTypes.string,
  destinationStationID: PropTypes.string,
  trainDate: PropTypes.any,
  stations: PropTypes.array,
  timetable: PropTypes.arrayOf(PropTypes.shape({
    trainNo: PropTypes.string,
    trainDate: PropTypes.string,
    direction: PropTypes.number,
    originStationName: PropTypes.object,
    originDepartureTime: PropTypes.string,
    destinationStationName: PropTypes.object,
    destinationArrivalTime: PropTypes.string,
    totalTime: PropTypes.string,
    fare: PropTypes.number,
    isBusinessSeat: PropTypes.bool,
  })),
};

const mapStateToProps = state => state.timetable;
const mapDispatchToProps = {
  setOriginStation,
  setDestinationStation,
  fetchStations,
  loadTimetable,
};

class Timetable extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static get propTypes() {
    return propTypes;
  }

  componentDidMount() {
    this.props.fetchStations()
      .then((response) => {
        // 設定 search bar 預設為第一筆車站資料
        if (response && response.length) {
          const firstStation = response[0];
          this.props.setOriginStation(firstStation.stationID);
          this.props.setDestinationStation(firstStation.stationID);
        }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      originStationID,
      destinationStationID,
    } = this.props;
    return this.props.loadTimetable(originStationID, destinationStationID);
  }

  render() {
    const {
      originStationID,
      destinationStationID,
      stations,
      timetable,
    } = this.props;
    return (
      <div>
        <div>
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <Selector
              id="originStationID"
              name="originStationID"
              value={originStationID}
              options={stations}
              onChange={event => this.props.setOriginStation(event.target.value)}
              labelRenderer={option => option.stationName.zhTw}
              valueRenderer={option => option.stationID}
            />
            <Selector
              id="destinationStationID"
              name="destinationStationID"
              value={destinationStationID}
              options={stations}
              onChange={event => this.props.setDestinationStation(event.target.value)}
              labelRenderer={option => option.stationName.zhTw}
              valueRenderer={option => option.stationID}
            />
            <button className="btn btn-primary mb-2" type="submit">Submit form</button>
          </form>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">起站名稱</th>
                <th scope="col">起站發車時間</th>
                <th scope="col">訖站名稱</th>
                <th scope="col">訖站到達時間</th>
                <th scope="col">總共乘車時間</th>
                <th scope="col">票價</th>
              </tr>
            </thead>
            <tbody>
              {
                timetable && timetable.map((time) => {
                  const {
                    trainNo,
                    trainDate,
                    originStationName,
                    originDepartureTime,
                    destinationStationName,
                    destinationArrivalTime,
                    totalTime,
                    fare,
                    isBusinessSeat,
                  } = time;
                  return (
                    <tr key={`${trainNo}-${trainDate}-${originDepartureTime}`}>
                      <td>{originStationName.zhTw}</td>
                      <td>{originDepartureTime}</td>
                      <td>{destinationStationName.zhTw}</td>
                      <td>{destinationArrivalTime}</td>
                      <td>{totalTime}</td>
                      <td>
                        {fare}
                        {isBusinessSeat && <span title={'此價格為商務車箱票價'}>i</span>}
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timetable);
