import React, { Component } from 'react';
import './Professions.css';

class Professions extends Component {
  render() {
    const { professions, professionList, changeProfession } = this.props;
    return (
      <div className="professions">
        {professionList.length === 0 ? <div>Loading...</div> : null}
        {professionList.map(prof => {
          return (
            <div key={prof + " button"} 
                className="professions-select-btn"
                onClick={() => changeProfession(prof)}>
              <img alt={prof + " icon"} src={professions[prof].icon_big} />
              <div className="professions-select-btn-label">{prof}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Professions;