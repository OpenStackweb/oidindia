import { authErrorHandler } from "openstack-uicore-foundation/lib/methods";

import {
  getRequest,
  createAction,
  stopLoading,
  startLoading,
  showMessage,
  showSuccessMessage,
} from 'openstack-uicore-foundation/lib/methods';

export const GET_DISQUS_SSO = 'GET_DISQUS_SSO';
export const GET_ROCKETCHAT_SSO = 'GET_ROCKETCHAT_SSO';

export const getDisqusSSO = () => (dispatch, getState) => {

  let { loggedUserState: { accessToken } } = getState();

  dispatch(startLoading());

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_DISQUS_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/disqus/fnvirtual-poc/profile?access_token=${accessToken}`,
    authErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}


export const getRocketChatSSO = () => (dispatch, getState) => {

  let { loggedUserState: { accessToken } } = getState();

  dispatch(startLoading());

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_ROCKETCHAT_SSO),
    `${window.IDP_BASE_URL}/api/v1/sso/rocket-chat/fnvirtual-poc/profile?access_token=${accessToken}`,
    authErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}
