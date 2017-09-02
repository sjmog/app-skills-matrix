import * as React from 'react';

import './../evaluation.scss';

type SkillBodyProps = {
  questions: { title: string }[],
  criteria: string,
};

class SkillBody extends React.Component<SkillBodyProps, any> {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { questions } = this.props;

    return (
      <div className="skill-body">
        <p>{`  ${this.props.criteria} `}
        </p>
        {
          questions && questions.length
            ? <div><ul>{questions.map(({ title }, i) => <li key={i}>{title}</li>)}</ul></div> : false
        }
      </div>
    );
  }
}

export default SkillBody;
