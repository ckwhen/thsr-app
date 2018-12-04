/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render"] }] */
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Index from './screens/Index';
import Timetable from './screens/Timetable';

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
