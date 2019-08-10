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
    skills: [],
    currentProfession: "Engineer",
    isDivHidden: Array(6).fill(false)
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

  getCaretIcon = isHidden => {
    if (isHidden) return <i className="fas fa-caret-right"></i>;
    else return <i className="fas fa-caret-down"></i>;
  }

  toggleIsDivHidden = index => {
    const { isDivHidden } = this.state;
    isDivHidden[index] = !isDivHidden[index];
    this.setState({ isDivHidden });
  }

  render() {
    const categories = ["Characters", "Professions", "Traits", "Skills", "Equipment", "Analysis"];
    const components = [
      <Characters />,
      <Professions 
        professions={this.state.professions}
        professionList={this.state.professionList}
        changeProfession={prof => this.setState({ currentProfession: prof })}/>,
      <Traits />,
      <Skills />,
      <Equipment />,
      <Analysis 
        profession={this.state.professions[this.state.currentProfession]}
        skills={this.state.skills}/>
    ]
    return (
      <div className="app">
        <div className="app-header">
          <div className="app-header-logo">
            <span>GW2</span><span className="app-header-logo-end">THEORYCRAFTER</span>
          </div>
        </div>
        <div className="app-main">
          {categories.map((category, i) => {
            return (<React.Fragment key={category}>
              <div className="app-main-container-header"
                  onClick={() => this.toggleIsDivHidden(i)}>
                <span className="app-main-container-header-caret">
                  {this.getCaretIcon(this.state.isDivHidden[i])}
                </span>
                {category}
              </div>
              <div className={"app-main-container" + (this.state.isDivHidden[i] ? 
                              " app-main-container-hidden" : "")}>
                {components[i]}
              </div>
            </React.Fragment>);
          })}
        </div>
      </div>
    );
  }
}

export default App;
