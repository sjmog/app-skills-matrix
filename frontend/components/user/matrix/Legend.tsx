import * as React from 'react';
import { connect } from 'react-redux';

import { SKILL_STATUS } from '../../../modules/user/skills';

type LegendProps = {
    evaluationId: string,
    updateFilter: (evaluationId: string, idsToFilter: string[]) => void,
    matrixSkillsStatusFilter: (evaluationId: string) => string[],
};

const Legend = ({ evaluationId, updateFilter, matrixSkillsStatusFilter }: LegendProps) => {
  return (
      <div>
        <h4>Legend</h4>
        <p role="button" className="skill--legend skill--attained state--icon--ATTAINED" onClick={() => updateFilter(evaluationId, matrixSkillsStatusFilter(SKILL_STATUS.ATTAINED))}>Attained</p>
        <p className="skill--legend skill--newly-attained state--icon--ATTAINED">Newly attained</p>
        <p className="skill--legend skill--objective state--icon--OBJECTIVE">Objective</p>
        <p className="skill--legend skill--feedback state--icon--FEEDBACK">Feedback</p>
        <p className="skill--legend skill--not-attained state--icon--NOT_ATTAINED">Not attained</p>
        <p className="skill--legend skill--new state--icon--NEW">New skill</p>
      </div>
  );
};

export default Legend;
