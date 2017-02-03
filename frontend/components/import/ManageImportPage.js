import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../modules/users';

class ManageImportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  updateUserState(e) {}

  clearUserForm() {}

  onSubmit(e) {};

  render() {
    return (
      <div>Hello world</div>
    );
  }
}

export const ManageImportPage = connect(
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(ManageImportComponent);
