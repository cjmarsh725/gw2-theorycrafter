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

  roughSizeOfObject = ( object ) => {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
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
            if (skill.professions) return skill.professions.length > 0;
            else return false;
          });
          console.log("Length: " + response.data.length + " | " + skills.length);
          console.log("Size: " + this.roughSizeOfObject(response.data) + " | " + this.roughSizeOfObject(skills));
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
