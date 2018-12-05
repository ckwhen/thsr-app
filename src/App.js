/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render"] }] */
import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Index from './screens/Index';
import Timetable from './screens/Timetable';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter basename="/">
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/timetable">Timetable</Link>
                </li>
              </ul>
            </nav>

            <Route path="/" exact component={Index} />
            <Route path="/timetable" component={Timetable} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
