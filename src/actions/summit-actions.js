import axios from 'axios';

import { authErrorHandler } from "openstack-uicore-foundation/lib/methods";
import {
    getRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    showSuccessMessage,
} from 'openstack-uicore-foundation/lib/methods';

import { customErrorHandler } from '../utils/customErrorHandler';

export const GET_SUMMIT_DATA = 'GET_SUMMIT_DATA';

export const getSummitData = () => (dispatch, getState) => {

  dispatch(startLoading());

  return getRequest(
    dispatch(startLoading()),
    createAction(GET_SUMMIT_DATA),
    `${window.SUMMIT_API_BASE_URL}/api/public/v1/summits/${window.SUMMIT_ID}?expand=event_types%2C+tracks%2C+track_groups%2C+presentation_levels%2C+locations.rooms%2C+locations.floors`,
    customErrorHandler
  )({})(dispatch).then(() => {
    dispatch(stopLoading());
  }
  ).catch(e => {
    dispatch(stopLoading());
    return (e);
  });
}