import * as React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { actionCreators } from '../../../modules/admin/evaluations';
import * as selectors from '../../../modules/admin';
import EvaluationStatusLabel from '../../common/EvaluationStatusLabel';
import Select from '../../common/Select';
import { humanReadableStatus } from '../../common/helpers';

const statusOptions = R.map(s => ({ label: humanReadableStatus[s], value: s }), R.keys(humanReadableStatus));

type EvaluationStatusSelectorProps = {
  status: string,
  evaluationId: string,
  updateStatus: (evaluationId: string, status: string) => void,
};

type LocalComponentState = {
  editing: boolean,
};

class EvaluationStatusSelector extends React.Component<EvaluationStatusSelectorProps, LocalComponentState> {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleEditClick() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  handleChange(e) {
    e.preventDefault();
    const { evaluationId, updateStatus } = this.props;
    updateStatus(evaluationId, e.target.value);
  }

  render() {
    const { status } = this.props;

    return (
      <div>
        {
          this.state.editing
            ? <Select value={status} options={statusOptions} handleChange={this.handleChange} />
            : <EvaluationStatusLabel status={status} editable={true} handleEditClick={this.handleEditClick} />
        }
      </div>
    );
  }
}

export default connect(
  (state, { evaluationId }) => ({
    status: selectors.getEvaluationStatus(state, evaluationId),
  }),
  dispatch => ({
    updateStatus: (evaluationId, status) => dispatch(actionCreators.updateEvaluationStatus(evaluationId, status)),
  }),
)(EvaluationStatusSelector);
