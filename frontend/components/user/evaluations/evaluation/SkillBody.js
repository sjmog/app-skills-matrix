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
      </div>
    );
  }
}

SkillBody.propTypes = {
  questions: PropTypes.array,
  criteria: PropTypes.string.isRequired
};

export default SkillBody;
