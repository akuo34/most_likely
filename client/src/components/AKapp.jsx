import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Lobby from './Lobby';
import Room from './Room';

const AKapp = () => {
  return (
    <Router>
      <Route path="/" exact component={Lobby}></Route>
      <Route path="/room" exact component={Room}></Route>
    </Router>
  );
}

export default AKapp;



// export default class AKapp extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       prompts: [],
//       displayed: null
//     }
//   }

//   componentDidMount() {
//     this.getAllPrompts();
//   }

//   getAllPrompts() {
//     Axios.get('/api')
//       .then((response) => {

//         var firstPromptIndex = Math.floor(Math.random()*(response.data.length));
//         var displayed = response.data[firstPromptIndex];
//         response.data.splice(firstPromptIndex, 1);

//         this.setState({
//           prompts: response.data,
//           displayed
//         }, () => console.log(this.state));
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }

//   render() {
//     return (
//       <div>
//         <Lobby />
//       </div>
//     );
//   }
// };
