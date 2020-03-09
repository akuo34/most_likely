import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Lobby = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div className="container-app">
      <h1>Who's Most Likely?</h1>
      <div>
        <input className="input" placeholder="Enter your name" onChange={(event) => setName(event.target.value.toUpperCase())} value={name} />
      </div>
      <h3>Enter a code to join your friends</h3>
      <div className="container-code-button">
        <div>
          <input className="input input-code" placeholder="Enter code" onChange={(event) => setRoom(event.target.value.toUpperCase())} value={room} />
        </div>
        <Link onClick={e => (!room || !name) ? e.preventDefault() : null} to={`/room?name=${name}&room=${room}`}>
          <button className="button" type="submit">Join a room</button>
        </Link>
      </div>
      <h3>Or start a new room</h3>
      <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/room?name=${name}`}>
        <button className="button" type="submit">New room</button>
      </Link>
    </div>
  );
}

export default Lobby;
