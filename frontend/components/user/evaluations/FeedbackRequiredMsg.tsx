import * as React from 'react';
import SkillNamesList from './SkillNamesList';

type FeedbackRequiredMsgProps = {
  skillsRequiringFeedback: string[],
};

const FeedbackRequiredMsg = ({ skillsRequiringFeedback }:  FeedbackRequiredMsgProps) =>
  <div>Feedback needs to be gathered for the following skills and their statuses need to be updated:
    <SkillNamesList skillUids={skillsRequiringFeedback}/>
  </div>;

export default FeedbackRequiredMsg;
