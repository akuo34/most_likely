import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Lobby from './Lobby';
import Room from './Room';
import Game from './Game';

const AKapp = () => {
  return (
    <Router>
      <Route path="/" exact component={Lobby}></Route>
      <Route path="/room" exact component={Room}></Route>
      <Route path="/game" exact component={Game}></Route>
    </Router>
  );
}

export default AKapp;
