import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import './../evaluation.scss';

class SkillBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <div className="skill-body">
        <p>{`  ${this.props.criteria}`}</p>
        {
          this.props.questions.length
          ? <Button
            active={this.state.open}
            onClick={() => this.setState({ open: !this.state.open })}
          >
            {"I'm not sure"}
          </Button>
          : false
        }
        { this.state.open
          ? <div className="skill-body___info-block">
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
  criteria: PropTypes.string.isRequired,
};

export default SkillBody;
