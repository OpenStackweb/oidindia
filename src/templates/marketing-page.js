import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, navigate } from 'gatsby'

import Masonry from 'react-masonry-css'
import Slider from "react-slick"

import Layout from '../components/Layout'
import AttendanceTrackerComponent from '../components/AttendanceTrackerComponent'
import MarketingHeroComponent from '../components/MarketingHeroComponent'
import LiteScheduleComponent from '../components/LiteScheduleComponent'
import DisqusComponent from '../components/DisqusComponent'
import {syncData} from '../actions/base-actions';

import Content, { HTMLContent } from '../components/Content'
import Countdown from '../components/Countdown'
import Link from '../components/Link'
import { PHASES } from '../utils/phasesUtils'
import { formatMasonry } from '../utils/masonry'

import settings from '../content/settings';

import styles from "../styles/marketing.module.scss"
import '../styles/style.scss'


export const MarketingPageTemplate = class extends React.Component {

  componentWillMount() {
    const {siteSettings} = this.props;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {lastBuild, syncData} = this.props;
    if (!lastBuild || settings.lastBuild > lastBuild) {
      syncData();
    }
  }

  render() {
    const { content, contentComponent, summit_phase, user, isLoggedUser, location, summit, siteSettings } = this.props;
    const PageContent = contentComponent || Content;

    let scheduleProps = {};
    if (siteSettings.leftColumn.schedule && isLoggedUser && summit_phase !== PHASES.BEFORE) {
      scheduleProps = {
        ...scheduleProps,
        onEventClick: (ev) => navigate(`/a/event/${ev.id}`),
      }
    }

    const sliderSettings = {
      autoplay: true,
      autoplaySpeed: 5000,
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <React.Fragment>
        <AttendanceTrackerComponent />
        <MarketingHeroComponent summit={summit} isLoggedUser={isLoggedUser} location={location} />
        {summit && siteSettings?.countdown?.display && <Countdown summit={summit} text={siteSettings?.countdown?.text} />}
        <div className="columns" id="marketing-columns">
          <div className="column is-half px-6 pt-6 pb-0" style={{ position: 'relative' }}>
            {siteSettings.leftColumn.schedule.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.schedule.title}</b></h2>
                <LiteScheduleComponent
                  {...scheduleProps}
                  page="marketing-site"
                  showAllEvents={true}
                  showSearch={false}
                  showNav={true}
                />
              </React.Fragment>
            }
            {siteSettings.leftColumn.disqus.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.disqus.title}</b></h2>
                <DisqusComponent page="marketing-site"/>
              </React.Fragment>
            }
            {siteSettings.leftColumn.image.display &&
              <React.Fragment>
                <h2><b>{siteSettings.leftColumn.image.title}</b></h2>
                <br />
                <img alt={siteSettings.leftColumn.image.alt} src={siteSettings.leftColumn.image.src} />
              </React.Fragment>
            }
          </div>
          <div className="column is-half px-0 pb-0">
            <Masonry
              breakpointCols={2}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
              {formatMasonry(siteSettings.sponsors).map((item, index) => {
                if (item.images && item.images.length === 1) {
                  return (
                    <div className={'single'} key={index}>
                      {item.images[0].link ?
                        <Link to={item.images[0].link}>
                          <img alt={item.images[0].alt} src={item.images[0].image} />
                        </Link>
                        :
                        <img alt={item.images[0].alt} src={item.images[0].image} />
                      }
                    </div>
                  )
                } else if (item.images && item.images.length > 1) {
                  return (
                    <Slider {...sliderSettings} key={index}>
                      {item.images.map((img, indexSlide) => {
                        return (
                          <div className={styles.imageSlider} key={indexSlide}>
                            {img.link ?
                              <Link to={img.link}>
                                <img alt={img.alt} src={img.image} />
                              </Link>
                              :
                              <img alt={img.alt} src={img.image} />
                            }
                          </div>
                        )
                      })}
                    </Slider>
                  )
                } else {
                  return (
                    <div className="single" key={index} />
                  )
                }
              })}
            </Masonry>
          </div>
        </div>
        <div className="container marketing-section-content">
          <h2>
            About This Event
          </h2>
          <p>OpenInfra, Cloud Native, Magma & Hyperledger Days India 2022 is an open source infrastructure community event jointly hosted by OpenInfra, Cloud Native, Magma and Hyperledger communities.</p>
          <h3>
            Magma Core Foundation
          </h3>
          <p>
            Magma began as a project to bring modern software defined networking techniques to bear on the challenges of rural Internet access. Our experience building rural networks taught us that policy-rich network edges and simple fabrics were a broadly applicable design approach for building flexible, low-cost, and scalable networks, even outside the data center. Magma’s early design decisions reflect this core insight as well as our earliest use cases: small-scale, low-cost community networks and for coverage extension through federation with existing mobile networks.
          </p>
          <h3>
            OpenInfra Foundation
          </h3>
          <p>
            Modern apps rely on automated infrastructure, from massive data center clouds to the smallest edge nodes for IoT and 5G, and none of it is possible without open source software. This is Open Infrastructure: open source technologies enabling everyone to provide infrastructure for others to build solutions on. The OpenInfra Foundation and its 110,000 members from 187 countries exist to ensure each open source component is built and tested together, collaboratively, with a radical approach to openness we call the Four Opens: Open Source, Development, Design and Community.
          </p>
          <h3>Cloud Native Computing Foundation</h3>
          <p>
            Cloud native technologies empower organizations to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. Containers, service meshes, microservices, immutable infrastructure, and declarative APIs exemplify this approach. These techniques enable loosely coupled systems that are resilient, manageable, and observable. Combined with robust automation, they allow engineers to make high-impact changes frequently and predictably with minimal toil. The Cloud Native Computing Foundation seeks to drive adoption of this paradigm by fostering and sustaining an ecosystem of open source, vendor-neutral projects. We democratize state-of-the-art patterns to make these innovations accessible for everyone.
          </p>
          <h3>Hyperledger Foundation</h3>
          <p>
            Hyperledger Foundation is an open source community focused on developing a suite of stable frameworks, tools and libraries for enterprise-grade blockchain deployments. It is a global collaboration, hosted by The Linux Foundation, and includes leaders in finance, banking, Internet of Things, supply chains, manufacturing and Technology. Built under technical governance and open collaboration, individual developers, service and solution providers, government associations, corporate members and end users are all invited to participate in the development and promotion of these game-changing technologies.
          </p>
        </div>
        <PageContent content={content} />
      </React.Fragment>
    )
  }
}

MarketingPageTemplate.propTypes = {
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  summit_phase: PropTypes.number,
  user: PropTypes.object,
  isLoggedUser: PropTypes.bool,
}

const MarketingPage = ({ summit, location, data, summit_phase, user, isLoggedUser, syncData, lastBuild, siteSettings }) => {
  const { html } = data.markdownRemark;

  return (
    <Layout marketing={true} location={location}>
      <MarketingPageTemplate
        contentComponent={HTMLContent}
        content={html}
        location={location}
        summit_phase={summit_phase}
        summit={summit}
        user={user}
        isLoggedUser={isLoggedUser}
        syncData={syncData}
        lastBuild={lastBuild}
        siteSettings={siteSettings}
      />
    </Layout>
  )
}

MarketingPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
  summit_phase: PropTypes.number,
  user: PropTypes.object,
  isLoggedUser: PropTypes.bool,
  getSummitData: PropTypes.func
}

const mapStateToProps = ({ clockState, loggedUserState, userState, summitState, settingState }) => ({
  summit_phase: clockState.summit_phase,
  isLoggedUser: loggedUserState.isLoggedUser,
  user: userState,
  summit: summitState.summit,
  lastBuild: settingState.lastBuild,
  siteSettings: settingState.siteSettings
});

export default connect(mapStateToProps, {
  syncData
})(MarketingPage)

export const marketingPageQuery = graphql`
  query MarketingPageTemplate($id: String!) {    
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {        
        title
      }
    }
  }
`;