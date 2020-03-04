import React from 'react';
import Axios from 'axios';

export default class AKapp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prompts: [],
      displayed: null
    }
  }

  componentDidMount() {
    this.getAllPrompts();
  }

  getAllPrompts() {
    Axios.get('/api')
      .then((response) => {

        var firstPromptIndex = Math.floor(Math.random()*(response.data.length));
        var displayed = response.data[firstPromptIndex];
        response.data.splice(firstPromptIndex, 1);

        this.setState({
          prompts: response.data,
          displayed
        }, () => console.log(this.state));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (

      <div>HI</div>
    )
  }
};
