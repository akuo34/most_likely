import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Lobby = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div>
      <h1>Who's Most Likely</h1>
      <div>
        <input placeholder="Name" onChange={(event) => setName(event.target.value)} />
      </div>
      <div>
        <input placeholder="Room Code" onChange={(event) => setRoom(event.target.value)} />
      </div>
      <Link onClick={e => (!room || !name) ? e.preventDefault() : null} to={`/room?name=${name}&room=${room}`}>
        <button type="submit">Join a Room</button>
      </Link>
      <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/room?name=${name}`}>
        <button type="submit">Open a Room</button>
      </Link>
    </div>
  );
}

export default Lobby;
