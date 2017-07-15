import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-bootstrap';

import UserDetails from './UserDetails';
import Evaluations from './Evaluations';
import MenteeEvaluations from './MenteeEvaluations';

const Dashboard = ({ userDetails, mentorDetails, template, evaluations, menteeEvaluations }) => (
  <Grid>
    {
      userDetails
        ? <div>
          <Row>
            <UserDetails
              user={userDetails}
              mentor={mentorDetails}
              template={template}
            />
          </Row>
          <Row>
            <Evaluations
              evaluations={evaluations}
            />
          </Row>
          <Row>
            <MenteeEvaluations
              menteeEvaluations={menteeEvaluations}
            />
          </Row>
        </div>
        : <h1>{'You aren\'t logged in!'}</h1>
    }
  </Grid>
);


Dashboard.propTypes = {
  userDetails: PropTypes.object,
  mentorDetails: PropTypes.object,
  template: PropTypes.object,
  evaluations: PropTypes.array,
  menteeEvaluations: PropTypes.array,
};

export const DashboardPage = connect(
  state => state.user,
)(Dashboard);
