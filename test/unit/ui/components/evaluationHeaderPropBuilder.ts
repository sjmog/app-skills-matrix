import { expect } from 'chai';
import * as R from 'ramda';

import { EVALUATION_STATUS, EVALUATION_VIEW } from '../../../../frontend/modules/user/evaluations';
const { MENTOR } = EVALUATION_VIEW;
const { SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;
import headerPropBuilderInit from '../../../../frontend/components/user/evaluations/evaluationHeaderPropBuilder';
const headerPropBuilderInitLenient = headerPropBuilderInit as any;

const defaultArguments = {
  requiresFeedback: false,
  subjectName: 'SUBJECT_NAME',
  evaluationName: 'EVALUATION_NAME',
  onClick: () => 'ON-CLICK',
  status: SELF_EVALUATION_COMPLETE,
};

describe('Evaluation Page Header Prop Builder', () => {
  it('returns props when given a valid view and status', () => {
    const headerProps = headerPropBuilderInitLenient(...R.values(defaultArguments));
    const { title, btnText, btnDisabled, btnOnClick, alert } = headerProps[MENTOR];

    expect(title).to.eql('SUBJECT_NAME');
    expect(alert).to.be.an('object');
    expect(btnText).to.be.a('string').with.length.above(1);
    expect(btnOnClick()).to.be.eql('ON-CLICK');
    expect(btnDisabled).to.eql(true);
  });

  it('returns undefined when the view is invalid', () => {
    const headerProps = headerPropBuilderInitLenient(...R.values(defaultArguments));

    expect(headerProps['INVALID_VIEW']).to.eql(undefined);
  });

  it('sets the values of status dependent props to undefined when the status is invalid', () => {
    const args = { ...defaultArguments, status: 'INVALID_STATUS' };
    const headerProps = headerPropBuilderInitLenient(...R.values(args));
    const { title, btnText, btnDisabled, btnOnClick, alert } =  headerProps[MENTOR];

    expect(title).to.eql('SUBJECT_NAME');
    expect(btnText).to.be.a('string').with.length.above(4);
    expect(btnOnClick()).to.be.eql('ON-CLICK');

    expect(alert).to.be.undefined;
    expect(btnDisabled).to.be.undefined;
  });
});
