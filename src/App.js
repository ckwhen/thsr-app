/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render"] }] */
import React, { Component } from 'react';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Index from './screens/Index';
import Timetable from './screens/Timetable';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter basename="/">
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

            <Route path="/" exact component={Index} />
            <Route path="/timetable" component={Timetable} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
