import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Lobby from './Lobby';
import Room from './Room';
import Game from './Game';
import io from 'socket.io-client';



const AKapp = () => {
  const endpoint = 'http://13.52.26.197:3500';
  // const endpoint = 'http://localhost:3500';
  const socket = io.connect(endpoint);

  return (
    <Router>
      <Route path="/" exact component={Lobby}></Route>
      {/* <Route path="/room" exact component={Room}></Route> */}
      {/* <Route path="/game" exact component={Game}></Route> */}
      <Route path="/room" render={(props) => <Room {...props} socket={socket}/>}></Route>
      <Route path="/game" render={(props) => <Game {...props} socket={socket}/>}></Route>
    </Router>
  );
}

export default AKapp;
