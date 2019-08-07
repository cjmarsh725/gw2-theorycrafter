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
      const requests = [];
      professionList.forEach(profession => {
        requests.push(axios.get(`https://api.guildwars2.com/v2/professions/${profession}`));
      });
      const professions = {};
      axios.all(requests).then(response => {
        professionList.forEach(profession => {
          professions[profession] = response.map(res => res.data).find(data => data.id === profession);
        });
        this.setState({ professionList, professions });
      }).catch(error => console.error("Individual professions endpoint: " + error));
    }).catch(error => console.error("Profession list endpoint: " + error));
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
              <i class="fas fa-caret-right"></i>
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
