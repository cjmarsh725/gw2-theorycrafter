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
      <Router>
        <div className="app">
          <div className="app-header">
            <div className="app-header-logo">
              <span>GW2</span><span className="app-header-logo-end">THEORYCRAFTER</span>
            </div>
          </div>
          <div className="app-main">
            <div className="app-main-sidebar">
              <NavLink className="app-main-sidebar-link" to="/">Characters</NavLink>
              <NavLink className="app-main-sidebar-link" to="/professions">Professions</NavLink>
              <NavLink className="app-main-sidebar-link" to="/traits">Traits</NavLink>
              <NavLink className="app-main-sidebar-link" to="/skills">Skills</NavLink>
              <NavLink className="app-main-sidebar-link" to="/equipment">Equipment</NavLink>
              <NavLink className="app-main-sidebar-link" to="/analysis">Analysis</NavLink>
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
