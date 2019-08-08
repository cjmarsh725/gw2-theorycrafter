import React, { Component } from "react";
import { BrowserRouter as Router, NavLink, Route } from "react-router-dom";
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
          console.log("All: " + response.data.length + " | Size: " + JSON.stringify(response.data).length);
        }).catch(error => console.error("All skills request: " + error));
        const skillRequests = [];
        profData.forEach(data => {
          Object.keys(data.weapons).forEach(weapon => {
            data.weapons[weapon].skills.forEach(skill => {
              skillRequests.push(`https://api.guildwars2.com/v2/skills/${skill.id}`);
            });
          });
          data.training.forEach(training => {
            if (training.category === "Skills" || training.category === "EliteSpecializations") {
              training.track.forEach(track => {
                if (track.skill_id) {
                  skillRequests.push(`https://api.guildwars2.com/v2/skills/${track.skill_id}`);
                }
              })
            }
          });
        });
        axios.all(skillRequests).then(response => {
          console.log("Profession skills: " + response.length);
        }).catch(error => console.error("Profession skills request: " + error));
        this.setState({ professionList, professions });
      }).catch(error => console.error("Individual professions request: " + error));
    }).catch(error => console.error("Profession list request: " + error));
  }

  render() {
    return (
      <Router>
        <div className="app">
          <div className="app-header">
            <div className="app-header-logo">
              <span>GW2</span><span className="app-header-logo-end">THEORYCRAFTER</span>
            </div>
          </div>
          <div className="app-main">
            <div className="app-main-sidebar">
              <NavLink className="app-main-sidebar-link" to="/">CHARACTERS</NavLink>
              <NavLink className="app-main-sidebar-link" to="/professions">PROFESSIONS</NavLink>
              <NavLink className="app-main-sidebar-link" to="/traits">TRAITS</NavLink>
              <NavLink className="app-main-sidebar-link" to="/skills">SKILLS</NavLink>
              <NavLink className="app-main-sidebar-link" to="/equipment">EQUIPMENT</NavLink>
              <NavLink className="app-main-sidebar-link" to="/analysis">ANALYSIS</NavLink>
            </div>
            <div className="app-main-routes">
              <Route path="/" exact component={Characters} />
              <Route path="/professions" component={Professions} />
              <Route path="/traits" component={Traits} />
              <Route path="/skills" component={Skills} />
              <Route path="/equipment" component={Equipment} />
              <Route path="/analysis" component={Analysis} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
