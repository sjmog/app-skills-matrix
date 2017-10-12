import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';

import { actionCreators } from '../../../modules/user/evaluations';
import { SKILL_STATUS } from '../../../modules/user/skills';
import * as selectors from '../../../modules/user';
import PageHeader from '../../common/PageHeader';
import headerPropBuilder from './evaluationHeaderPropBuilder';

import './evaluation.scss';

// TODO fix types
type EvaluationPageHeaderProps = {
  view: string,
  evaluationName: string,
  subjectName: string,
  status: string,
  evaluationId: string,
  actions: any,
  skillsRequiringFeedback: string[],
};

class EvaluationPageHeader extends React.Component<EvaluationPageHeaderProps, any> {
  constructor(props) {
    super(props);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  evaluationComplete() {
    this.props.actions.evaluationComplete(this.props.evaluationId);
  }

  render() {
    const { view, evaluationName, subjectName, status, skillsRequiringFeedback } = this.props;
    const headerProps = headerPropBuilder(skillsRequiringFeedback, subjectName, evaluationName, this.evaluationComplete, status);

    return (
      <Row>
        <PageHeader {...headerProps[view]} />
      </Row>
    );
  }
}

export default connect(
  (state, props) => {
    const evalId = props.evaluationId;
    const skillUids = selectors.getSkillUids(state, evalId);

    return ({
      view: selectors.getView(state, evalId),
      evaluationName: selectors.getEvaluationName(state, evalId),
      subjectName: selectors.getSubjectName(state, evalId),
      status: selectors.getEvaluationStatus(state, evalId),
      skillsRequiringFeedback: selectors.getSkillsWithCurrentStatus(state, SKILL_STATUS.FEEDBACK, skillUids),
    });
  },
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch),
  }),
)(EvaluationPageHeader);
