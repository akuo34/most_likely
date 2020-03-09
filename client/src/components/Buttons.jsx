import React from 'react';

const Buttons = (props) => {
  return (
    <div>
      {props.players.map((player) => {
        return (
          <div>
            <button onClick={props.clickHandler} value={player}>{player}</button>
          </div>
        )
      })}
    </div>
  )
}

export default Buttons;