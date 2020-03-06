import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Buttons from './Buttons';

const Game = () => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [waitingOn, setWaitingOn] = useState('');
  const [ready, setReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [score, setScore] = useState(0);
  const [displayText, setDisplayText] = useState(true);
  const [displayPrompt, setDisplayPrompt] = useState(false);
  const [displayButtons, setDisplayButtons] = useState(false);
  const instructions = 'How to play: Select the player you think best satisfies the prompt. If you believe you will be the most picked person, vote for yourself.'
  const endpoint = 'localhost:3500';

  const clickHandler = (event) => {
    console.log(event.target.value);
    let socket = io(endpoint);
    let vote = event.target.value;
    socket.emit('vote', { vote, name, room });
    setDisplayButtons(false);
  }

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setRoom(room);
    setName(name);

    let socket = io(endpoint);

    socket.emit('wait', { name, room });
    socket.on('waiting on', ({ message }) => {
      setWaitingOn(message);
    });

    socket.on('ready', ({message, ready, players}) => {
      setWaitingOn(message);
      setReady(ready);
      setPlayers(players);
    })
  }, []);

  useEffect(() => {
    
    let socket = io(endpoint)

    if (ready) {
      socket.emit('get prompt', {room, name});
      setReady(false);
    }

    socket.on('send prompt', ({currentPrompt}) => {

      console.log(currentPrompt);
      setCurrentPrompt(currentPrompt);
      setDisplayText(false);
      setDisplayPrompt(true);
      setDisplayButtons(true);
    });
  }, [ready]);

  return (
    <div>
      <div>
        {displayText ? waitingOn : null}

      </div>
      <div>
        {displayText ? instructions : null}

      </div>
      <div>
        {displayPrompt ? currentPrompt : null}
        {displayButtons ? <Buttons players={players} clickHandler={clickHandler}></Buttons> : null} 
      </div>
    </div>
  );
}

export default Game;