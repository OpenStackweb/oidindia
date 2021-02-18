import React from "react"
import { Helmet } from 'react-helmet'
import { connect } from "react-redux";
import axios from 'axios'

import envVariables from '../utils/envVariables';
import expiredToken from '../utils/expiredToken';

// these two libraries are client-side only
import ScheduleLite from 'schedule-lite';
import 'schedule-lite/index.css';

import HomeSettings from '../content/home-settings.json'
import EventsData from '../content/events.json'
import SummitData from '../content/summit.json'
import MarketingData from '../content/colors.json'

const ScheduleComponent = class extends React.Component {

  render() {

    const { userProfile, accessToken } = this.props;

    const scheduleProps = {
      apiBaseUrl: envVariables.SUMMIT_API_BASE_URL,
      marketingApiBaseUrl: envVariables.MARKETING_API_BASE_URL,
      eventBaseUrl: "/a/event",
      trackBaseUrl: "/a/tracks",
      speakerBaseUrl: "/a/speakers",
      roomBaseUrl: "/a/rooms",
      summitId: parseInt(envVariables.SUMMIT_ID),
      onAuthError: (err, res) => expiredToken(err),
      onRef: ref => this.child = ref,
      defaultImage: HomeSettings.schedule_default_image,
      eventsData: EventsData,
      summitData: SummitData.summit,
      marketingData: MarketingData.colors,
      userProfile: userProfile,
      eventCallback: (action, event) => {
        const url = `${envVariables.SUMMIT_API_BASE_URL}/api/v1/summits/${envVariables.SUMMIT_ID}/members/me/schedule/${event.id}`;
        switch (action) {
          case 'ADDED_TO_SCHEDULE': {
            const action = axios.post(
              url, { access_token: accessToken }
            ).catch(e => console.log('ERROR: ', e));
            return action
          }
          case 'REMOVED_FROM_SCHEDULE': {
            console.log('over here')
            const action = axios.delete(
              url, { data: { access_token: accessToken } }
            ).catch(e => console.log('ERROR: ', e));
            return action
          }
        }
      }
    };

    const { className } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/awesome-bootstrap-checkbox/1.0.2/awesome-bootstrap-checkbox.min.css" />
        </Helmet>
        <div className={className ? className : this.props.page === 'marketing-site' ? 'schedule-container-marketing' : 'schedule-container'}>
          <ScheduleLite {...scheduleProps} {...this.props} />
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ userState, loggedUserState }) => ({
  userProfile: userState.userProfile,
  accessToken: loggedUserState.accessToken
})


export default connect(mapStateToProps, {})(ScheduleComponent)