import React from 'react'

import styles from '../styles/advertise.module.scss'

import Content from '../content/ads.json'

const AdvertiseComponent = ({ section, column, id }) => {

  const sectionAds = Content.ads.find(ad => ad.section === section).columns.find(c => c.column === column).columnAds;

  if (sectionAds.length > 0) {
    return (
      sectionAds.map((ad, index) => {
        return (
          ad.id ?
            ad.id === id ?
              column === 'center' ?
                <div>Centro</div>
                :
                <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
                  <img src={ad.image} alt="sponsor" />
                  {ad.button.text && ad.button.link &&
                    <a className={styles.link} href={ad.button.link}>
                      <button className={`${styles.button} button is-large`}>
                        <b>{ad.button.text}</b>
                      </button>
                    </a>
                  }
                </div>
              :
              null
            :
            column === 'center' ?
              <div className={`${styles.sponsorContainerCenter}`} key={index}>
                <div className={styles.containerText}>
                  <span className={styles.adText} style={ad.image ? { textAlign: 'left' } : null}>
                    <b>Upload your picture and participate with the #yocovirtualsummit</b>
                  </span>
                  <a className={styles.link} href={ad.button.link}>
                    <button className={`${styles.button} button is-large`} style={ad.image ? { width: '100%' } : null}>
                      <b>{ad.button.text}</b>
                    </button>
                  </a>
                </div>
                {ad.image && <div className={styles.containerImage} style={{ backgroundImage: `url(${ad.image})` }}></div>}
              </div>
              :
              <div className={`${styles.sponsorContainer} sponsor-container`} key={index}>
                <img src={ad.image} alt="sponsor" />
                {ad.button.text && ad.button.link &&
                  <a className={styles.link} href={ad.button.link}>
                    <button className={`${styles.button} button is-large`}>
                      <b>{ad.button.text}</b>
                    </button>
                  </a>
                }
              </div>
        )
      })
    )
  } else {
    return null;
  }
}

export default AdvertiseComponent;