import React, { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'

import styles from '../styles/profile.module.scss'

const ProfilePopupComponent = ({ userProfile, closePopup, showProfile }) => {

  const editorRef = useRef(null);

  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);


  // state = {
  //   image: 'avatar.jpg',
  //   allowZoomOut: false,
  //   position: { x: 0.5, y: 0.5 },
  //   scale: 1,
  //   rotate: 0,
  //   borderRadius: 0,
  //   preview: null,
  //   width: 200,
  //   height: 200,
  //   disableCanvasRotation: false,
  // }

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  }

  const handlePositionChange = (position) => {
    setPosition({ position });
  }

  const rotateLeft = (e) => {
    e.preventDefault();
    setRotate(rotate - 90);
  }
  const rotateRight = (e) => {
    e.preventDefault();
    setRotate(rotate + 90);
  }

  return (

    < div className={`${styles.modal} ${showProfile ? styles.isActive : ''}`}>
      <div className={`${styles.modalBackground}`}></div>
      <div className={`${styles.modalCard} ${styles.profilePopup}`}>
        <header className={`${styles.modalCardHead}`}>
          <p className={`${styles.modalCardTitle}`}>Edit profile</p>
          <i onClick={() => closePopup()} className={`${styles.closeIcon} fa fa-times icon is-large`}></i>
        </header>
        <section className={`${styles.modalCardBody}`}>
          <div className={styles.modalCardPicture}>
            <div className={styles.title}>Profile picture</div>
            <div className={styles.picture}>
              <AvatarEditor
                ref={editorRef}
                image={userProfile.pic}
                width={width}
                height={height}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                position={position}
                onPositionChange={handlePositionChange}
                scale={scale}
                borderRadius={5}
                rotate={parseFloat(rotate)}
              />
              <div>
                <div className={`columns ${styles.inputRow}`}>
                  <div className='column is-one-quarter'>Zoom:</div>
                  <div className='column is-two-thirds'>
                    <input
                      name="scale"
                      type="range"
                      max="2"
                      onChange={(e) => handleScale(e)}
                      step="0.01"
                      defaultValue="1"
                    />
                  </div>
                </div>
                <div className={`columns ${styles.inputRow}`}>
                  <div className='column is-one-quarter'>Rotate:</div>
                  <div className='column is-two-thirds'>
                    <button className={`button is-large ${styles.button}`} onClick={rotateLeft}>
                      <i className={`fa fa-undo icon is-large`} />Left
                  </button>
                    <button className={`button is-large ${styles.button}`} onClick={rotateRight}>
                      <i className={`fa fa-undo icon is-large`} />Right
                  </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className={styles.modalCardForm}>
            <div className={styles.title}>Profile Info</div>
            <div className={styles.form}>
              <div className={`columns ${styles.inputRow}`}>
                <div className='column is-one-quarter'>First Name</div>
                <div className='column is-two-thirds'>
                  <input className={`${styles.input} ${styles.isMedium}`} type="text" placeholder="First Name" />
                </div>
              </div>
              <div className={`columns ${styles.inputRow}`}>
                <div className='column is-one-quarter'>Last Name</div>
                <div className='column is-two-thirds'>
                  <input className={`${styles.input} ${styles.isMedium}`} type="text" placeholder="Last Name" />
                </div>
              </div>
              <div className={`columns ${styles.inputRow}`}>
                <div className='column is-one-quarter'>Company</div>
                <div className='column is-two-thirds'>
                  <input className={`${styles.input} ${styles.isMedium}`} type="text" placeholder="Company" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className={`${styles.modalCardFoot}`}>
          <button onClick={() => closePopup()} className="button is-large">Discard</button>
          <button className="button is-large">Update</button>
        </footer>
      </div>
    </div >
  )
}

export default ProfilePopupComponent