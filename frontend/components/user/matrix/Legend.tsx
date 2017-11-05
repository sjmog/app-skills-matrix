import * as React from 'react';
import { connect } from 'react-redux';

import { SKILL_STATUS } from '../../../modules/user/skills';

type LegendProps = {
    evaluationId: string,
    updateFilter: (evaluationId: string, filter: string, idsToFilter: string[]) => void,
    matrixSkillsStatusFilter: (evaluationId: string) => string[],
};

const Legend = ({ evaluationId, updateFilter, matrixSkillsStatusFilter }: LegendProps) => {
  return (
      <div>
        <h4>Legend</h4>
        <p role="button" className="skill--legend skill--attained state--icon--ATTAINED" onClick={() => updateFilter(evaluationId, SKILL_STATUS.ATTAINED, matrixSkillsStatusFilter(SKILL_STATUS.ATTAINED))}>Attained</p>
        <p role="button" className="skill--legend skill--newly-attained state--icon--ATTAINED" onClick={() => updateFilter(evaluationId, SKILL_STATUS.ATTAINED, matrixSkillsStatusFilter(SKILL_STATUS.ATTAINED))}>Newly attained</p>
        <p role="button" className="skill--legend skill--objective state--icon--OBJECTIVE" onClick={() => updateFilter(evaluationId, SKILL_STATUS.OBJECTIVE, matrixSkillsStatusFilter(SKILL_STATUS.OBJECTIVE))}>Objective</p>
        <p role="button" className="skill--legend skill--feedback state--icon--FEEDBACK" onClick={() => updateFilter(evaluationId, SKILL_STATUS.FEEDBACK, matrixSkillsStatusFilter(SKILL_STATUS.FEEDBACK))}>Feedback</p>
        <p role="button" className="skill--legend skill--not-attained state--icon--NOT_ATTAINED" onClick={() => updateFilter(evaluationId, SKILL_STATUS.NOT_ATTAINED, matrixSkillsStatusFilter(SKILL_STATUS.NOT_ATTAINED))}>Not attained</p>
        <p role="button" className="skill--legend skill--new state--icon--NEW" onClick={() => updateFilter(evaluationId, SKILL_STATUS.NEW, matrixSkillsStatusFilter(SKILL_STATUS.NEW))}>New skill</p>
      </div>
  );
};

export default Legend;
