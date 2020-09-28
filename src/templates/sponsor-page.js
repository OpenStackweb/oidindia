import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import { connect } from 'react-redux'

import SponsorHeader from '../components/SponsorHeader'
import LiveEventWidgetComponent from '../components/LiveEventWidgetComponent'
import ScheduleLiteComponent from '../components/ScheduleLiteComponent'
import AdvertiseComponent from '../components/AdvertiseComponent'
import DocumentsComponent from '../components/DocumentsComponent'
import DisqusComponent from '../components/DisqusComponent'
import SponsorBanner from '../components/SponsorBanner'
import HeroComponent from '../components/HeroComponent'

import SummitObject from '../content/summit.json'
import Sponsors from '../content/sponsors.json'
import SponsorsTiers from '../content/sponsors-tiers.json'

import Layout from '../components/Layout'

import styles from '../styles/sponsor-page.module.scss'

export const SponsorPageTemplate = class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sponsor: null,
      tier: null
    }
  }

  componentWillMount() {
    const { sponsorId } = this.props;
    const sponsor = Sponsors.tierSponsors.map(t => t.sponsors.find(s => s.id === parseInt(sponsorId))).filter(e => e !== undefined)[0];
    const tier = Sponsors.tierSponsors.find(t => t.sponsors.find(s => s === sponsor)).tier;
    const tierData = SponsorsTiers.tiers.find(t => t.value === tier.id);

    if (sponsor) this.setState({ sponsor: sponsor, tier: tierData });
  }

  onEventChange = (ev) => {
    const { eventId } = this.props;
    if (eventId !== `${ev.id}`) {
      navigate(`/a/event/${ev.id}`);
    }
  }

  render() {
    const { loggedUser, user } = this.props;
    const { sponsor, tier } = this.state;
    let { summit } = SummitObject;
    
    const mocketDocuments = {
      slides: [
        {
          id: 55244,
          created: 1596072520,
          last_edited: 1596072520,
          name: "http://relaxdiego.com/2018/02/jenkins-on-jenkins-shared-libraries.html",
          description: null,
          display_on_site: false,
          featured: false,
          order: 2,
          presentation_id: 24533,
          class_name: "PresentationSlide",
          link: "http://relaxdiego.com/2018/02/jenkins-on-jenkins-shared-libraries.html"
        }
      ],
      links: [
        {
          id: 55243,
          created: 1596072520,
          last_edited: 1596072520,
          name: "http://relaxdiego.com/2017/05/swampup-2017-slides.html",
          description: null,
          display_on_site: false,
          featured: false,
          order: 1,
          presentation_id: 24533,
          class_name: "PresentationLink",
          link: "http://relaxdiego.com/2017/05/swampup-2017-slides.html"
        }
      ],
      videos: [
        {
          id: 55245,
          created: 1596072520,
          last_edited: 1596072520,
          name: "http://relaxdiego.com/2018/08/keeping-continuous-integration-continuous.html",
          description: null,
          display_on_site: false,
          featured: false,
          order: 3,
          presentation_id: 24533,
          class_name: "PresentationVideo",
          youtube_id: "http://relaxdiego.com/2018/08/keeping-continuous-integration-continuous.html"
        }
      ],
    }

    if (!sponsor) {
      return <HeroComponent title="Sponsor not found" redirectTo="/a/" />
    } else {
      return (
        <>
          <SponsorHeader sponsor={sponsor} tier={tier} />
          <section className={`section px-0 ${tier.sponsorTemplate === 'big-header' ? 'pt-5' : 'pt-0'} pb-0`}>
            <div className="columns mx-0 my-0 is-multiline">
              {tier.sponsorTemplate === 'big-header' ?
                <React.Fragment>
                  <div className="column is-three-quarters px-5 py-0">
                    <h1>{sponsor.title}</h1>
                    <span>
                      {sponsor.intro}
                    </span>
                  </div>
                  <div className="column is-one-quarter px-5 py-0">
                    <DisqusComponent disqusSSO={user.disqusSSO} className={styles.disqusContainerSponsor} summit={summit} title="" />
                  </div>
                </React.Fragment>
                :
                <React.Fragment>
                  <div className={`column is-half px-5 py-0 ${styles.introHalf}`}>
                    <h1>{sponsor.title}</h1>
                    <span>
                      {sponsor.intro}
                    </span>
                  </div>
                  <div className="column is-half px-0 py-0">
                    <img src={sponsor.pageImage} />
                  </div>
                </React.Fragment>
              }
              <div className="column is-three-quarters px-5 py-0">
                <LiveEventWidgetComponent
                  onEventClick={(ev) => this.onEventChange(ev)}
                />
              </div>
              <div className="column is-one-quarter px-5 py-0">
                <DocumentsComponent event={mocketDocuments} sponsor={true} />
              </div>
              <div className="column is-three-quarters px-5 py-0">
                <ScheduleLiteComponent
                  accessToken={loggedUser.accessToken}
                  onEventClick={(ev) => this.onEventChange(ev)}
                  onViewAllEventsClick={() => this.onViewAllEventsClick()}
                  landscape={false}
                  yourSchedule={false}
                  showNav={false}
                  showAllEvents={false}
                  eventCount={3}
                />
              </div>
              <div className="column is-one-quarter px-5 py-0">
                <AdvertiseComponent section='lobby' column="left" style={{ marginTop: '2em' }} />
              </div>
              <div className="column is-three-quarters px-5 py-0">
                <SponsorBanner />
              </div>
            </div>
          </section>
        </>
      )
    }
  }
}

const SponsorPage = (
  {
    loggedUser,
    sponsorId,
    user,
    getDisqusSSO
  }
) => {

  return (
    <Layout>
      <SponsorPageTemplate
        loggedUser={loggedUser}
        sponsorId={sponsorId}
        user={user}
        getDisqusSSO={getDisqusSSO}
      />
    </Layout>
  )
}

SponsorPage.propTypes = {
  loggedUser: PropTypes.object,
  sponsorId: PropTypes.string,
  user: PropTypes.object,
  getDisqusSSO: PropTypes.func,
}

SponsorPageTemplate.propTypes = {
  loggedUser: PropTypes.object,
  sponsorId: PropTypes.string,
  user: PropTypes.object,
  getDisqusSSO: PropTypes.func,
}

const mapStateToProps = (
  {
    loggedUserState,
    userState,
  }
) => ({

  loggedUser: loggedUserState,
  user: userState,
})

export default connect(mapStateToProps, {})(SponsorPage);