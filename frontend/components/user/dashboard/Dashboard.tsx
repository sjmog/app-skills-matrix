import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Row } from 'react-bootstrap';

import UserDetails from './UserDetails';
import Evaluations from './Evaluations';
import MenteeEvaluations from './MenteeEvaluations';

// TODO: fix types
type DashboardProps = {
  userDetails: any,
  mentorDetails: any,
  template: any,
  evaluations: any[],
  menteeEvaluations: any[],
};

const Dashboard = ({ userDetails, mentorDetails, template, evaluations, menteeEvaluations }: DashboardProps) => (
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

export const DashboardPage = connect(
  state => state.user,
)(Dashboard);
