import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import uuidv4 from 'uuid/v4';
import Selector from '../../components/Selector';
import DataTable from '../../components/DataTable';
import {
  setMessage,
  resetMessage,
} from '../../reducers/messageReducer';
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
  setMessage: PropTypes.func,
  resetMessage: PropTypes.func,
};

const mapStateToProps = state => state.timetable;
const mapDispatchToProps = {
  setOriginStation,
  setDestinationStation,
  fetchStations,
  loadTimetable,
  setMessage,
  resetMessage,
};

class Timetable extends Component {
  constructor() {
    super();
    this.state = {
      timetableId: uuidv4(),
    };
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
      })
      .catch(error => this.props.setMessage(error));
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      originStationID,
      destinationStationID,
    } = this.props;
    if (originStationID === destinationStationID) {
      return this.props.setMessage({
        message: '起站與迄站不能設為相同',
        onClose: this.props.resetMessage,
      });
    }
    return this.props.loadTimetable(originStationID, destinationStationID)
      .then(() => this.setState({ timetableId: uuidv4() }))
      .catch(error => this.props.setMessage(error));
  }

  render() {
    const {
      originStationID,
      destinationStationID,
      stations,
      timetable,
    } = this.props;
    return (
      <div className="row">
        <div className="col-12">
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <Selector
              className="form-control mb-2 mr-sm-2"
              id="originStationID"
              name="originStationID"
              value={originStationID}
              options={stations}
              onChange={event => this.props.setOriginStation(event.target.value)}
              labelRenderer={option => option.stationName.zhTw}
              valueRenderer={option => option.stationID}
            />
            <Selector
              className="form-control mb-2 mr-sm-2"
              id="destinationStationID"
              name="destinationStationID"
              value={destinationStationID}
              options={stations}
              onChange={event => this.props.setDestinationStation(event.target.value)}
              labelRenderer={option => option.stationName.zhTw}
              valueRenderer={option => option.stationID}
            />
            <button className="btn btn-primary mb-2" type="submit">
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </button>
          </form>
        </div>
        <div className="col-12">
          <DataTable
            timetableId={this.state.timetableId}
            data={timetable}
            emptyText="查無資料"
            columnMeta={[
              {
                columnName: 'originStationName',
                displayName: '起站名稱',
                customComponent: ({ data } = {}) => <div>{data.zhTw}</div>,
              },
              {
                columnName: 'originDepartureTime',
                displayName: '起站發車時間',
                sortable: true,
              },
              {
                columnName: 'destinationStationName',
                displayName: '訖站名稱',
                customComponent: ({ data } = {}) => <div>{data.zhTw}</div>,
              },
              {
                columnName: 'destinationArrivalTime',
                displayName: '訖站到達時間',
              },
              {
                columnName: 'totalTime',
                displayName: '總共乘車時間',
                sortable: true,
              },
              {
                columnName: 'fare',
                displayName: '票價',
                customComponent: ({ data, rowdata } = {}) => (
                  <div>
                    {data}
                    {rowdata.isBusinessSeat && (
                      <FontAwesomeIcon
                        className="icon-tip"
                        icon={faExclamationCircle}
                        title="此價格為商務車箱票價"
                      />
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timetable);
