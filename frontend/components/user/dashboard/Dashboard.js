import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';


import UserDetails from './UserDetails';
import Evaluations from './Evaluations';
import MenteeEvaluations from './MenteeEvaluations';

const Dashboard = ({ user, mentor, template, evaluations, menteeEvaluations }) => (
  <Grid>
    {
      user
        ? <div>
            <h1 className="header">Dashboard</h1>
            <UserDetails
              user={user}
              mentor={mentor}
              template={template}
            />
            <Evaluations
              evaluations={evaluations}
            />
            <MenteeEvaluations
              menteeEvaluations={menteeEvaluations}
            />
          </div>
        : <h1>{`You aren't logged in!`}</h1>
    }
  </Grid>
);


Dashboard.propTypes = {
  user: PropTypes.object,
  mentor: PropTypes.object,
  template: PropTypes.object,
  evaluations: PropTypes.array,
  menteeEvaluations: PropTypes.array,
};

export const DashboardPage = connect(
  function mapStateToProps(state) {
    return state.dashboard;
  }
)(Dashboard);
