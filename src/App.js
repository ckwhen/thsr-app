/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render"] }] */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import Loading from './components/Loading';
import MessageModal from './components/MesssageModal';
import {
  setMessage,
  resetMessage,
} from './reducers/messageReducer';

const propTypes = {
  message: PropTypes.object,
  setMessage: PropTypes.func,
  resetMessage: PropTypes.func,
};

const mapStateToProps = state => ({
  message: state.message,
});
const mapDispatchToProps = {
  setMessage,
  resetMessage,
};

const LoadableIndex = Loadable({
  loader: () => import('./screens/Index'),
  loading: Loading,
});
const LoadableTimetable = Loadable({
  loader: () => import('./screens/Timetable'),
  loading: Loading,
});

class App extends Component {
  static get propTypes() {
    return propTypes;
  }

  render() {
    const {
      message,
    } = this.props;
    return (
      <div className="container">
        <div className="row bottom-buffer">
          <div className="col-12">
            <nav>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" exact to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/timetable">Timetable</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <Route path="/" exact component={LoadableIndex} />
        <Route path="/timetable" component={LoadableTimetable} />
        {message && message.message && (
          <MessageModal
            title={message.title}
            message={message.message}
            onClose={message.onClose || this.props.resetMessage}
          />
        )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
