import React, { PropTypes } from "react";
import { connect } from "react-redux";

import UserDetails from "./UserDetails";
import Evaluations from "./Evaluations";

const Dashboard = () =>
  (<div>
    { this.props.user ? <div>
      <h1 className="header">Dashboard</h1>
      <UserDetails
        user={this.props.user}
        mentor={this.props.mentor}
        template={this.props.template}
      />
      <Evaluations
        evaluations={this.props.evaluations}
      />
    </div> : <h1>{`You aren't logged in!`}</h1> }
  </div>);


Dashboard.propTypes = {
  user: PropTypes.object,
  mentor: PropTypes.object,
  template: PropTypes.object,
  evaluations: PropTypes.array,
};

export const DashboardPage = connect(
  function mapStateToProps(state) {
    return state.dashboard;
  }
)(Dashboard);
