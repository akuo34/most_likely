import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Axios from 'axios';

const Game = () => {
  const [prompts, setPrompts] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [waitingOn, setWaitingOn] = useState('');
  const [ready, setReady] = useState(false);
  const [scores, setScores] = useState({});
  const [displayText, setDisplayText] = useState(true);
  const [displayPrompt, setDisplayPrompt] = useState(false);
  const instructions = 'How to play: Select the player you think best satisfies the prompt. If you believe you will be the most picked person, vote for yourself.'
  const endpoint = 'localhost:3500';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    // setRoom(room);
    setName(name);

    let socket = io(endpoint);

    socket.emit('wait', { name, room });
    socket.on('waiting on', ({ message }) => {
      setWaitingOn(message);
    });

    socket.on('ready', ({message, ready}) => {
      setWaitingOn(message);
      setReady(ready);
    })
    // socket.emit('join', {name, newRoom});
    // Axios.get('/api')
    // .then((response) => {
    //   console.log(currentPrompt);
    //   if (!currentPrompt) {
    //     var rdmPrompt = Math.floor(Math.random()*120);
    //     var currentPrompt = response.data[rdmPrompt].prompt;
    //   }
    //   var prompts = response.data;

    //   console.log(rdmPrompt);
    //   console.log(prompts);
    //   console.log(currentPrompt);
    //   // setPrompts(prompts);
    //   // setCurrentPrompt(currentPrompt);

    //   let socket = io('localhost:3500');

    //   socket.emit('send prompts', { prompts, currentPrompt, room });

    //   socket.on('prompts', ({ prompts, currentPrompt, room }) => {
    //     setPrompts(prompts);
    //     setCurrentPrompt(currentPrompt);
    //     setRoom(room);
    //   });

    //   return () => {
    //     socket.emit('disconnect', { name, room });
    //     // socket.on('players', (players) => {
    //     //   setPlayers(players);
    //     // })
    //     socket.off();
    //   }
    // })
    // .catch((err) => {
    //   console.error(err);
    // });
  }, []);

  useEffect(() => {
    
    let socket = io(endpoint)

    if (ready) {
      socket.emit('get prompt', {room});
      setReady(false);
    }

    socket.on('send prompt', ({currentPrompt}) => {

      console.log(currentPrompt);
      setCurrentPrompt(currentPrompt);
      setDisplayText(false);
      setDisplayPrompt(true);
    });
    // Axios.get('/api')
    //   .then((response) => {
    //     var prompts = response.data;
    //     var rdmPrompt = Math.floor(Math.random() * (prompts.length + 1));
    //     var currentPrompt = prompts[rdmPrompt].prompt;
    //     setCurrentPrompt(currentPrompt);
    //     prompts.splice(rdmPrompt, 1);
    //     setPrompts(prompts);
    //     setDisplayPrompt(true);
    //   })
  });

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
      </div>
    </div>
  );
}

export default Game;