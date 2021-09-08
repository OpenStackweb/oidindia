import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { navigate } from "gatsby";
import { getUserProfile, requireExtraQuestions } from "../actions/user-actions";
import HeroComponent from "../components/HeroComponent";

const WithAuthRoute = ({
  children,
  isLoggedIn,
  location,
  userProfile,
  hasTicket,
  isAuthorized,
  getUserProfile,
}) => {
  const [fetchedUserProfile, setFetchedUserProfile] = useState(false);

  const userIsReady = () => {
    // we have an user profile
    return !!userProfile;
  };

  const userIsAuthz = () => {
    return hasTicket || isAuthorized;
  };

  const checkingCredentials = () => {
    return !userIsAuthz() && !fetchedUserProfile;
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    if (!userProfile) {
      getUserProfile();
      return;
    }
    // if the user is not authz and we accessing a private route , get fresh data to recheck
    // authz condition ( new tickets / new groups ) after every render of the route
    if (!fetchedUserProfile && !userIsAuthz()) {
      getUserProfile().then( _ => setFetchedUserProfile(true))
    }
  }, [fetchedUserProfile, isLoggedIn, hasTicket, isAuthorized, userProfile, getUserProfile]);

  if (!isLoggedIn) {
    navigate("/", {state: { backUrl: `${location.pathname}`,},});
    return null;
  }

  // we are checking credentials if userProfile is being loading yet or
  // if we are refetching the user profile to check new data ( user currently is not a authz
  if (!userIsReady() || checkingCredentials()) {
    return <HeroComponent title="Checking credentials..." />;
  }

  // has no ticket -> redirect
  if (!userIsAuthz()) {
    const options = { state: {error: 'no-ticket'}};
    return <HeroComponent title="Checking credentials..." redirectTo="/authz/ticket" options={options} />;
  }

  return children;
};

const mapStateToProps = ({ userState }) => ({
  userProfile: userState.userProfile,
  isAuthorized: userState.isAuthorized,
  hasTicket: userState.hasTicket,
});

export default connect(mapStateToProps, {
  getUserProfile,
  requireExtraQuestions,
})(WithAuthRoute);