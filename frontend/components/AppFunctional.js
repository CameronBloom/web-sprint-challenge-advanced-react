import React from 'react'
import { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [form, setForm] = useState({ email: initialEmail, message: initialMessage });
  const [counter, setCounter] = useState(initialSteps);
  const [currIndex, setCurrIndex] = useState(initialIndex);

  // COORDINATE HELPERS
  // ==================
  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (currIndex < 3) {
      return [(currIndex % 3) + 1, 1];
    } else if (currIndex < 6) {
      return [(currIndex % 3) + 1, 2];
    } else if (currIndex < 9) {
      return [(currIndex % 3) + 1, 3];
    }
  }

  // function getXYMessage() {
  //   // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
  //   // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
  //   // returns the fully constructed string.
  //   const msgName = form.email.split("@")[0];
  //   const msgWin = form.message;
  //   return `${msgName} win #${msgWin}`
  // }

  function reset() {
    // Use this helper to reset all states to their initial values.
    // - clear the form
    // - clear the counter
    // - set the coordinates to the initial value
    setForm({ ...form, "email": initialEmail, "message": initialMessage });
    setCounter(initialSteps);    
    setCurrIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { id } = direction.target;
    switch(id) {
      case "left":
        if (currIndex !== 0 && currIndex !== 3 && currIndex !== 6) {
          setCurrIndex(currIndex - 1);
          setCounter(counter + 1)
          setForm({ ...form, "message": ""});
        } else {
          setForm({ ...form, "message": "You can't go left"});
        }
        break;
      case "up":
        if (currIndex !== 0 && currIndex !== 1 && currIndex !== 2) {
          setCurrIndex(currIndex - 3);
          setCounter(counter + 1);
          setForm({ ...form, "message": ""});
        } else {
          setForm({ ...form, "message": "You can't go up"});
        }
        break;
      case "right":
        if (currIndex !== 2 && currIndex !== 5 && currIndex !== 8) {
          setCurrIndex(currIndex + 1);
          setCounter(counter + 1);
          setForm({ ...form, "message": ""});
        } else {
          setForm({ ...form, "message": "You can't go right"});
        }
        break;
      case "down":
        if (currIndex !== 6 && currIndex !== 7 && currIndex !== 8) {
          setCurrIndex(currIndex + 3);
          setCounter(counter + 1);
          setForm({ ...form, "message": ""});
        } else {
          setForm({ ...form, "message": "You can't go down"});
        }
        break;
      default:
        console.log(`Invalid Argument...`)
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const event = evt;
    getNextIndex(event)
  }

  // FORM HELPERS
  // ============
  function onChange(evt) {
    const { value, name } = evt.target;
    setForm({ ...form, [name]: value});
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { email } = form;
    const arrCoordinates = getXY()
    axios.post("http://localhost:9000/api/result", { "x": arrCoordinates[0], "y": arrCoordinates[1], "steps": counter, "email": email })
      .then(res => {
        console.log("success =>", res.data);
        setForm({ ...form, "email": initialEmail, "message": res.data.message });
        
        
      })
      .catch(err => 
        {
          console.error(err)
          if (email === "") setForm({ ...form, "message": "Ouch: email is required" });
          if (email !== "" && !email.includes("@")) setForm({ ...form, "message": "Ouch: email must be a valid email" });
          if (email !== "" && !email.slice(email.length - 4).includes(".com")) setForm({ ...form, "message": err.response.data.message });
        }
      )
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        {/* <h3 id="coordinates">Coordinates (2, 2)</h3> */}
        <h3 id="coordinates">Coordinates ({getXY().join(", ")})</h3>
        <h3 id="steps">You moved {counter === 1 ? counter + " time" : counter + " times"}</h3>
      </div>
      <div id="grid">
        {/* <Grid currIndex={currIndex} nextIndex={nextIndex} /> */}
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currIndex ? ' active' : ''}`}>
              {idx === currIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{form.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ move }>LEFT</button>
        <button id="up" onClick={ move }>UP</button>
        <button id="right" onClick={ move }>RIGHT</button>
        <button id="down" onClick={ move }>DOWN</button>
        <button id="reset" onClick = { reset }>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" name="email" onChange={onChange} value={form.email}></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  )
}
