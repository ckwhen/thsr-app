/* eslint class-methods-use-this: ["error", { "exceptMethods": ["render"] }] */
import React, { Component } from 'react';

class Index extends Component {
  render() {
    return (
      <div>
        <h1>THSR App</h1>
        <p>請點擊上方 Timetable 頁面查詢當天是否還有剩餘座位</p>
      </div>
    );
  }
}

export default Index;
