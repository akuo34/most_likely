import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Buttons from './Buttons';
import { Link } from 'react-router-dom';

const Game = (props) => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [waitingOn, setWaitingOn] = useState('');
  const [ready, setReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [lastRound, setLastRound] = useState(false);
  const [displayChamp, setDisplayChamp] = useState(false);
  const [displayScoreboard, setDisplayScoreboard] = useState(true);
  const [champ, setChamp] = useState([]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [score, setScore] = useState(0);
  const [winners, setWinners] = useState([]);
  const [host, setHost] = useState('');
  const [scoreboard, setScoreboard] = useState({});
  const [displayText, setDisplayText] = useState(true);
  const [displayPrompt, setDisplayPrompt] = useState(false);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [displayWinners, setDisplayWinners] = useState(false);
  const instructions = 'How to play: Select the player you think best satisfies the prompt. If you believe you will be the most picked person, vote for yourself.'
  // const endpoint = 'http://13.52.26.197:3500';
  // const endpoint = 'http://localhost:3500';
  // const socket = io(endpoint);
  const socket = props.socket;

  const clickHandler = (event) => {
    // let socket = io(endpoint);
    let vote = event.target.value;
    console.log(vote);
    socket.emit('vote', { vote, name, room });
    socket.on('winner', ({ winners }) => {
      setWinners(winners);
      console.log(winners);
      setDisplayWinners(true);


      if (lastRound) {
        var firstVote = Object.keys(scoreboard)[0];
        var largestVote = scoreboard[firstVote];
        var winner = firstVote;
        var champs = [];
        Object.keys(scoreboard).forEach((key) => {
          if (scoreboard[key] > largestVote) {
            largestVote = scoreboard[key];
            winner = key;
          }
        })
        champs.push(winner);
        Object.keys(scoreboard).forEach((key) => {
          if (scoreboard[key] === largestVote && key !== winner) {
            champs.push(key);
          }
        })
        setChamp(champs);

        setDisplayPrompt(false);
        setDisplayButtons(false);
        setDisplayWinners(false);
        setDisplayChamp(true);
        setLastRound(lastRound);
        setDisplayScoreboard(false);

      }

      if (winners.indexOf(vote) !== -1 && vote === name) {
        setScore(score + 2);
        // socket.emit('update score', { score: score + 2, name, room });
        // socket.on('scoreboard', (scoreboard) => {
        //   setScoreboard(scoreboard);
        //   socket.off();
        // });
      } else if (winners.indexOf(vote) !== -1) {
        setScore(score + 1);
        // socket.emit('update score', { score: score + 1, name, room });
        // socket.on('scoreboard', (scoreboard) => {
        //   setScoreboard(scoreboard);
        //   socket.off();
        // });
      } else {
        setScore(score);
        // socket.emit('update score', { score, name, room });
        // socket.on('scoreboard', (scoreboard) => {
        //   setScoreboard(scoreboard);
        // socket.off();
        // });
      }
    });

    if (!lastRound && name === host) {
      setReady(true);
    }
    // } else if (lastRound) {
    //   var firstVote = Object.keys(scoreboard)[0];
    //   var largestVote = scoreboard[firstVote];
    //   var winner = firstVote;
    //   var winners = [];
    //   Object.keys(scoreboard).forEach((key) => {
    //     if (scoreboard[key] > largestVote) {
    //       largestVote = scoreboard[key];
    //       winner = key;
    //     }
    //   })
    //   winners.push(winner);
    //   Object.keys(scoreboard).forEach((key) => {
    //     if (scoreboard[key] === largestVote && key !== winner) {
    //       winners.push(key);
    //     }
    //   })
    //   setChamp(winners);

    //     setDisplayPrompt(false);
    //     setDisplayButtons(false);
    //     setDisplayWinners(false);
    //     setDisplayChamp(true);
    //     setLastRound(lastRound);

    // }
    setDisplayButtons(false);
  }

  useEffect(() => {
    // let socket = io(endpoint);

    // setTimeout(() => {
    socket.emit('update score', { score, name, room });
    socket.on('scoreboard', (scoreboard) => {
      setScoreboard(scoreboard);
      // socket.off();
    });
    // })
  }, [score]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setRoom(room);
    setName(name);

    // let socket = io(endpoint);

    socket.emit('wait', { name, room });
    socket.on('waiting on', ({ message, initialScore, host }) => {
      setWaitingOn(message);
      setScoreboard(initialScore);
      setHost(host);
    });

    socket.on('ready', ({ message, ready, players, initialScore, host }) => {
      setWaitingOn(message);
      setReady(ready);
      setPlayers(players);
      setScoreboard(initialScore);
      setHost(host);
    });

  }, []);

  useEffect(() => {

    // let socket = io(endpoint)

    if (ready) {
      socket.emit('get prompt', { room, name });
      setReady(false);
    }

    socket.on('send prompt', ({ currentPrompt, lastRound }) => {

      if (lastRound) {
        // setDisplayPrompt(false);
        // setDisplayButtons(false);
        // setDisplayWinners(false);
        // setDisplayChamp(true);
        setLastRound(lastRound);
      }
      setCurrentPrompt(currentPrompt);
      setDisplayText(false);
      setDisplayPrompt(true);
      setDisplayButtons(true);
      setDisplayWinners(false);
    });
  }, [ready]);

  return (
    <div className="container-app">
      {displayText ? <h2>{waitingOn}</h2> : null}
      {displayText ? <h3 className="instructions">{instructions}</h3> : null}
      {displayPrompt ? <h3 className="instructions">{currentPrompt}</h3> : null}
      {displayButtons ?
        <div className="container-buttons">
          {displayButtons ? <Buttons players={players} clickHandler={clickHandler}></Buttons> : null}

        </div> : null
      }
            {displayWinners ? winners.map((winner) => {
              return (
                <h3>{winner} is!!</h3>
              )
            }) : null}
      {displayChamp ?
        <div class="container-banner">
          <h1 className="banner">{champ} is the winner!!</h1>
          <a href="http://10.50.67.138:3000/" class="button-exit">Exit game</a>
        </div> : null}
      {displayScoreboard ?
        <div className="AK-wrapper-scoreboard">
          <h3 className="AK-header-scores">Scores</h3>
          <div className="AK-container-scoreboard">
            <ul className="AK-scoreboard room-list">
              {Object.keys(scoreboard).map((player, key) => {
                return <li key={key}>{player}</li>
              })}
            </ul>
            <ul className="AK-scoreboard">
              {Object.values(scoreboard).map((value, key) => {
                return <li key={key}>{value}</li>
              })}
            </ul>
          </div>
        </div> : null
      }
    </div>
  );
}

export default Game;