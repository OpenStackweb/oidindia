import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import URI from "urijs";
import { handleResetReducers } from '../actions/event-actions'
import { doLogin } from 'openstack-uicore-foundation/lib/methods'

import envVariables from '../utils/envVariables'

import HeroComponent from '../components/HeroComponent'

export const TokenExpirePageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  redirectToLogin() {
    const { location, handleResetReducers } = this.props;

    let defaultPath = envVariables.AUTHORIZED_DEFAULT_PATH ? envVariables.AUTHORIZED_DEFAULT_PATH : '/a/';
    let previousLocation = location.state?.backUrl ? location.state.backUrl : defaultPath;
    let backUrl = URI.encode(previousLocation);
    setTimeout(() => {
      handleResetReducers();
      doLogin(backUrl);
    }, 3000);
  }

  render() {
    this.redirectToLogin();
    return (
      <HeroComponent
        title="Checking credentials..."
      />
    )
  }
}

TokenExpirePageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  location: PropTypes.object,
  handleResetReducers: PropTypes.func,
}

const TokenExpirePage = ({ loggedUser, location, handleResetReducers }) => {

  return (
    <TokenExpirePageTemplate
      loggedUser={loggedUser}
      location={location}
      handleResetReducers={handleResetReducers}
    />
  )

}

TokenExpirePage.propTypes = {
  loggedUser: PropTypes.object,
  location: PropTypes.object,
  handleResetReducers: PropTypes.func,
}

const mapStateToProps = ({ loggedUserState }) => ({
  loggedUser: loggedUserState
})

export default connect(mapStateToProps, { handleResetReducers })(TokenExpirePage);
