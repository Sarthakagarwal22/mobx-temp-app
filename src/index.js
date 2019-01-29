import React from "react";
import { render } from "react-dom";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

class Temprature {
  id = Math.random();
  @observable unit = "C";
  @observable temp;
  tempAc;

  constructor(temp) {
    this.tempAC = this.temp = +temp;
  }

  @computed
  get tempF() {
    return +this.tempAC * (9 / 5) + 32;
  }

  @computed
  get tempK() {
    return +this.tempAC + 273.15;
  }

  @computed
  get tempC() {
    return this.tempAC;
  }
  @action
  updateTemprature(unit) {
    if (unit === "K") {
      this.temp = this.tempK;
      this.unit = "K";
    }
    if (unit === "F") {
      this.temp = this.tempF;
      this.unit = "K";
    }
    if (unit === "C") {
      this.temp = this.tempC;
      this.unit = "C";
    }
  }

  @action
  setTemprature() {
    this.tempAC = prompt("New Temp in Celcius", this.tempAC);
    this.updateTemprature(this.unit);
  }
}

const temps = observable({
  tempratureArray: []
});
temps.pushTemp = function(temp) {
  var tempObj = new Temprature(temp);
  this.tempratureArray.push(tempObj);
};

@observer
class TempratureView extends React.Component {
  render() {
    const temp = this.props.temp;
    return (
      <div>
        <input
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            temp.pushTemp(this.input.value);
            this.input.value = "";
          }}
        >
          {" "}
          Add Temp
        </button>
        <ul>
          {temp.tempratureArray.length > 0 &&
            temp.tempratureArray.map(t => <TempView temprature={t} />)}
        </ul>
      </div>
    );
  }
}

const TempView = observer(({ temprature }) => (
  <li key={temprature.id} onDoubleClick={() => temprature.setTemprature()}>
    {temprature.temp}
    {temprature.unit}
    <button onClick={() => temprature.updateTemprature("K")}>K</button>
    <button onClick={() => temprature.updateTemprature("F")}>F</button>
    <button onClick={() => temprature.updateTemprature("C")}>C</button>
  </li>
));

render(
  <div>
    <TempratureView temp={temps} />
  </div>,
  document.getElementById("root")
);
