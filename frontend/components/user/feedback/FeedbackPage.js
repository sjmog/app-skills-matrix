import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';

import PageHeader from './../../common/PageHeader';

class FeedbackPageComponent extends React.Component {
  componentWillMount() {}

  render() {
    return (
      <Grid>
        <PageHeader
          title='Feedback'
        />
      </Grid>
    )
  }
}

FeedbackPageComponent.propTypes = {};

export const FeedbackPage = connect(
  function mapStateToProps(state) {
    return ({});
  },
  function mapDispatchToProps(dispatch) {
    return {};
  }
)(FeedbackPageComponent);
