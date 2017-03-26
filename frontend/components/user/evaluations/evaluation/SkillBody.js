import React, { PropTypes } from 'react';
import { Button, Panel, Glyphicon } from 'react-bootstrap';

import './../evaluation.scss';

class SkillBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <div>
        <h4>
          <Button bsSize='xsmall' onClick={()=> this.setState({ open: !this.state.open })}>
            <Glyphicon glyph='info-sign'/>
          </Button>
          {`  ${this.props.criteria}`}
        </h4>
        <Panel className='skill-panel___info' collapsible expanded={this.state.open}>
          <ul>
          { this.props.questions.map(({ title }) => <li key={title}>{title}</li>) }
          </ul>
        </Panel>
      </div>
    );
  }
}

SkillBody.propTypes = {
  questions: PropTypes.array,
  criteria: PropTypes.string.isRequired
};

export default SkillBody;
