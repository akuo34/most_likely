import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';


const Room = (props) => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  // const endpoint = 'http://13.52.26.197:3500';
  // const endpoint = 'http://localhost:3500';
  const socket = props.socket;


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

    // let socket = io.connect(endpoint);
    socket.emit('join', { name, newRoom });

    // setPlayers([...players, name]);
    socket.on('players', (players) => {
      setPlayers(players);
      // socket.off();
    });

    // return () => {
    //   socket.emit('disconnect', { name, newRoom });
    //   socket.on('players', (players) => {
    //     setPlayers(players);
    //   })
    //   socket.off();
    // }
  }, []);

  return (
    <div className="container-app">
      <h2>Welcome, {name}!</h2>
      <h3>Room code: {room}</h3>
      <h3>People in the room:</h3>
      <ul className="room-list">
        {players.map((player, key) => {
          return <li key={key}>{player}</li>
        })}
      </ul>
      {players.length > 2 ?
        <Link to={`/game?room=${room}&name=${name}`}>
          <button className="button" type="submit">Ready!</button>
        </Link> : null
      }
    </div>
  );
}

export default Room;
