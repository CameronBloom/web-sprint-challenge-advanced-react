import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   message: initialMessage,
    //   email: initialEmail, 
    //   currIndex: initialIndex,
    //   counter: initialSteps
    // }
    this.state = initialState
  }

  // CALCULATION
  getXY = () => {
    const { index } = this.state;
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (index < 3) {
      return [(index % 3) + 1, 1];
    } else if (index < 6) {
      return [(index % 3) + 1, 2];
    } else if (index < 9) {
      return [(index % 3) + 1, 3];
    }
  }

  // CALCULATION
  // getXYMessage = () => {
  //   // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
  //   // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
  //   // returns the fully constructed string.
  //   const { email, steps } = this.state
  //   const msgName = email.split("@")[0];
  //   const msgWin = 37 + (6 * steps);
  //   return `${msgName} win #${msgWin}`
  // }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    const { message, email, index, steps } = initialState
    this.setState({ "message": message, "email": email, "index": index, "steps": steps })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    
  }

  // STATE CHANGE
  onChange = (evt) => {
    // You will need this to update the value of the input.
    const { name, value  } = evt.target;
    this.setState({ [name]: value });
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { email, steps } = this.state;
    const arrCoordinates = this.getXY()
    axios.post("http://localhost:9000/api/result", { "x": arrCoordinates[0], "y": arrCoordinates[1], "steps": steps, "email": email })
      .then(res => {
        console.log("success =>", res.data);
        this.setState({ "message": res.data.message, "email": initialEmail });
      })
      .catch(err => console.error(err))
  }

  render() {
    const { className } = this.props
    const { email, message, index, steps } = this.state
    
    return (
      <div id="wrapper" className={ className }>
        <div className="info">
          <h3 id="coordinates">Coordinates ({ this.getXY().join(", ")} )</h3>
          <h3 id="steps">You moved { steps } times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={ idx } className={ `square${idx === index ? ' active' : ''}` }>
                { idx === index ? 'B' : null }
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{ message }</h3>
        </div>
        <div id="keypad">
          <button id="left">LEFT</button>
          <button id="up">UP</button>
          <button id="right">RIGHT</button>
          <button id="down">DOWN</button>
          <button id="reset" onClick = { this.reset }>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" name="email" onChange={ this.onChange } value={ email }></input>
          <input id="submit" type="submit" onClick={ this.onSubmit }></input>
        </form>
      </div>
    )
  }
}
