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
          {`  ${this.props.criteria}`}
        </h4>
        {
          this.props.questions.length
          ? <Button
              active={this.state.open}
              onClick={() => this.setState({ open: !this.state.open })}>
              {"I'm not sure"}
            </Button>
          : false
        }
        { this.state.open
          ? <div className='skill-panel___info-block'>
              <ul>
                { this.props.questions.map(({ title }) => <li key={title}>{title}</li>) }
              </ul>
            </div>
          : false
        }
      </div>
    );
  }
}

SkillBody.propTypes = {
  questions: PropTypes.array,
  criteria: PropTypes.string.isRequired
};

export default SkillBody;
