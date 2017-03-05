import React, { PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';

import './evaluation.scss';

class AdditionalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <div>
        <Button bsStyle='info' onClick={()=> this.setState({ open: !this.state.open })}>
          {"I'm not sure"}
        </Button>
        <Panel className='info__panel' collapsible expanded={this.state.open}>
          <ul>
          { this.props.questions.map(({ title }) => <li key={title}>{title}</li>) }
          </ul>
        </Panel>
      </div>
    );
  }
}

AdditionalInfo.propTypes = {
  questions: PropTypes.array.isRequired
};

export default AdditionalInfo;
