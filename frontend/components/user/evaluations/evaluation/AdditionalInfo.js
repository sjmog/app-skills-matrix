import React, { PropTypes } from 'react';
import { Button, Panel, Glyphicon } from 'react-bootstrap';

import './../evaluation.scss';

class AdditionalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <div>
        <Button bsStyle='info' onClick={()=> this.setState({ open: !this.state.open })}>
          <Glyphicon glyph='question-sign'/>
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
