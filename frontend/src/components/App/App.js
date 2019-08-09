import React, { Component } from "react";
import axios from "axios";
import Analysis from "../Analysis/Analysis"
import Characters from "../Characters/Characters"
import Equipment from "../Equipment/Equipment"
import Professions from "../Professions/Professions"
import Skills from "../Skills/Skills"
import Traits from "../Traits/Traits"
import "./App.css";

class App extends Component {
  state = {
    professionList: [],
    professions: {},
    skills: []
  }

  componentDidMount() {
    axios.get("https://api.guildwars2.com/v2/professions").then(response => {
      const professionList = response.data;
      const profRequests = [];
      professionList.forEach(profession => {
        profRequests.push(axios.get(`https://api.guildwars2.com/v2/professions/${profession}`));
      });
      const professions = {};
      axios.all(profRequests).then(response => {
        const profData = response.map(res => res.data);
        professionList.forEach(profession => {
          professions[profession] = profData.find(data => data.id === profession);
        });
        axios.get("https://api.guildwars2.com/v2/skills?ids=all").then(response => {
          const skills = response.data.filter(skill => {
            if (skill.professions) return skill.professions.length === 1;
            else return false;
          });
          this.setState({ professionList, professions, skills });
        }).catch(error => console.error("All skills request: " + error));
      }).catch(error => console.error("Individual professions request: " + error));
    }).catch(error => console.error("Profession list request: " + error));
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <div className="app-header-logo">
            <span>GW2</span><span className="app-header-logo-end">THEORYCRAFTER</span>
          </div>
        </div>
        <div className="app-main">
          <div className="app-main-container">
            <div className="app-main-container-header">
              <i className="fas fa-caret-right"></i>
              Characters
            </div>
            <Characters />
          </div>
          <Professions />
          <Traits />
          <Skills />
          <Equipment />
          <Analysis />
        </div>
      </div>
    );
  }
}

export default App;
