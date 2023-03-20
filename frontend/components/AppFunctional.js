import React from 'react'
import { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 420
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [form, setForm] = useState({ email: initialEmail, message: initialMessage });
  const [counter, setCounter] = useState(initialSteps);

  let currIndex = initialIndex;

  // COORDINATE HELPERS
  // ==================
  // function getXY() {
  //   // It it not necessary to have a state to track the coordinates.
  //   // It's enough to know what index the "B" is at, to be able to calculate them.
  // }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return "this is the xy message"
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setForm({ ...form, "email": initialEmail, "message": initialMessage });
    setCounter(initialSteps)
    
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { id } = direction.target;
    switch(id) {
      case "left":
        if (currIndex !== 0 && currIndex !== 3 && currIndex !== 6) {
          currIndex = currIndex - 1;
        }
        break;
      case "up":
        if (currIndex - 3 >= 0) {
          currIndex = currIndex - 3;
        }
        break;
      case "right":
        if (currIndex !== 2 && currIndex !== 5 && currIndex !== 8) {
          currIndex = currIndex + 1;
        }
        break;
      case "down":
        if (currIndex !== 6 && currIndex !== 7 && currIndex !== 8) {
          currIndex = currIndex + 3;
        }
        break;
      default:
        console.log(`Invalid Argument...`)
    }
    console.log(`new: ${currIndex}`);
  }

  // function move(evt) {
  //   // This event handler can use the helper above to obtain a new index for the "B",
  //   // and change any states accordingly.
  // }

  // FORM HELPERS
  // ============
  function onChange(evt) {
    const { value, name } = evt.target;
    setForm({ ...form, [name]: value});
  }

  function onSubmit(evt) {
    evt.preventDefault();
    setForm({ ...form, "email": initialEmail, "message": getXYMessage()});
  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates (2, 2)</h3>
        {/* <h3 id="coordinates">Coordinates ({coordinates.join(", ")})</h3> */}
        <h3 id="steps">You moved {counter} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === initialIndex ? ' active' : ''}`}>
              {idx === initialIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{form.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ getNextIndex }>LEFT</button>
        <button id="up" onClick={ getNextIndex }>UP</button>
        <button id="right" onClick={ getNextIndex }>RIGHT</button>
        <button id="down" onClick={ getNextIndex }>DOWN</button>
        <button id="reset">reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" name="email" onChange={onChange} value={form.email}></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  )
}
