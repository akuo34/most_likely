import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Axios from 'axios';
import io from 'socket.io-client';

const Room = () => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  const endpoint = 'localhost:3500';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    if (!room) {
      let options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      var rdmCode = '';

      for (var i = 0; i < 4; i++) {
        rdmCode += options[Math.floor(Math.random() * 26)];
      }
      var newRoom = rdmCode;
    } else {
      var newRoom = room;
    }
    setRoom(newRoom);
    setName(name);

    socket = io(endpoint)

    socket.emit('join', { name, newRoom });
    
    // setPlayers([...players, name]);
    socket.on('players', (players) => {
      setPlayers(players);
    });
    
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [endpoint, location.search]);

  return (
    <div>
      <div>Welcome to room {room}, {name}</div>
      <ul>People in the room: {players.map((player) => {
        return <li>{player}</li>
      })} </ul>
    </div>
  );
}

export default Room;