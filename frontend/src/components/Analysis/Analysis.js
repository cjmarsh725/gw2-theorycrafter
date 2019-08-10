import React, { Component } from 'react';
import './Analysis.css';

class Analysis extends Component {
  render() {
    const { profession, skills } = this.props;
    return skills.length === 0 ? <div>Loading...</div> : (
      <div className="analysis">
        <div className="analysis-skills">
          {console.log(skills.filter(s => s.professions.indexOf(profession.name) === 0))}
        </div>
      </div>
    );
  }
}

export default Analysis;