import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Lobby from './Lobby';
import Room from './Room';
import Game from './Game';
// import io from 'socket.io-client';
// const endpoint = 'http://13.52.26.197:3500';
// const endpoint = 'http://localhost:3500';


const AKapp = () => {

  // const updateScore = () => {
  //   let socket = io(endpoint);

  //   // setTimeout(() => {
  //     socket.emit('update score', { score, name, room });
  //     socket.on('scoreboard', (scoreboard) => {
  //       setScoreboard(scoreboard);
  //     });
  // }
  return (
    <Router>
      <Route path="/" exact component={Lobby}></Route>
      <Route path="/room" exact component={Room}></Route>
      <Route path="/game" exact component={Game}></Route>
    </Router>
  );
}

export default AKapp;
