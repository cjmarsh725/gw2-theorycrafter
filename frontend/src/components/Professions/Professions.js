import React, { Component } from 'react';
import './Professions.css';

class Professions extends Component {
  render() {
    const { professions, professionList } = this.props;
    return (
      <div className="professions">
        {professionList.map(prof => {
          return (
            <div className="professions-select-btn">
              <img alt={prof} src={professions[prof].icon_big} />
              <div className="professions-select-btn-label">{prof}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Professions;