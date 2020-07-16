import React from 'react'
import URI from 'urijs';

export default class
  LogoutButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showLogOut: false,
    };

    this.NONCE_LEN = 16;

    this.initLogOut = this.initLogOut.bind(this);
    this.getLogoutUrl = this.getLogoutUrl.bind(this);
    this.createNonce = this.createNonce.bind(this);

  }

  initLogOut() {
    let location = window.location;
    // check if we are on iframe
    if (window.top)
      location = window.top.location;
    this.getLogoutUrl(window.idToken).toString()
    location.replace(this.getLogoutUrl(window.idToken).toString());
  }

  getLogoutUrl(idToken) {
    let baseUrl = window.IDP_BASE_URL;
    let url = URI(`${baseUrl}/oauth2/end-session`);
    let state = this.createNonce(this.NONCE_LEN);
    let postLogOutUri = window.location.origin + '/auth/logout';
    let backUrl = URI(window.location.href).pathname();

    // store nonce to check it later
    window.localStorage.setItem('post_logout_state', state);
    window.localStorage.setItem('post_logout_back_uri', backUrl);
    /**
     * post_logout_redirect_uri should be listed on oauth2 client settings
     * on IDP
     * "Security Settings" Tab -> Logout Options -> Post Logout Uris
     */
    return url.query({
      "id_token_hint": idToken,
      "post_logout_redirect_uri": encodeURI(postLogOutUri),
      "state": state,
    });
  }

  createNonce(len) {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = '';
    for (let i = 0; i < len; i++) {
      nonce += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return nonce;
  }

  render() {
    let { isLoggedUser, styles } = this.props;

    if (isLoggedUser) {
      return (

        <div className={styles.buttons}>          
          <a className={`${styles.userIcon}`} title="Clear state" onClick={() => { this.props.clearState(); }}>
            <i className="fa fa-trash icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
          {/* <a className={`${styles.userIcon}`}>
            <i className="fa fa-exclamation-circle icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
          <a className={`${styles.userIcon}`}>
            <i className="fa fa-cog icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
          <a className={`${styles.userIcon}`}>
            <i className="fa fa-bell icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>           */}
          <a className={`${styles.userIcon}`} title="Logout" onClick={() => { this.initLogOut(); }}>
            <i className="fa fa-sign-out icon is-medium" style={{fontSize: '1.5rem'}} />
          </a>
        </div>
      );
    } else {
      return null;
    }

  }
}