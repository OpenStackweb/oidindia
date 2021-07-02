import storage from "redux-persist/es/storage";
import {persistCombineReducers, persistStore} from "redux-persist";
import {loggedUserReducer} from "openstack-uicore-foundation/lib/reducers";
import eventReducer from "../reducers/event-reducer";
import summitReducer from "../reducers/summit-reducer";
import userReducer from "../reducers/user-reducer";
import scheduleReducer from "../reducers/schedule-reducer";
import clockReducer from "../reducers/clock-reducer";
import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";

export const RESET_STATE = 'RESET_STATE';

const clientId = typeof window === 'object' ? window.OAUTH2_CLIENT_ID : process.env.OAUTH2_CLIENT_ID;

const config = {
    key: `root_${clientId}`,
    storage,
};

const persistedReducers = persistCombineReducers(config, {
    loggedUserState: loggedUserReducer,
    eventState: eventReducer,
    summitState: summitReducer,
    userState: userReducer,
    scheduleState: scheduleReducer,
    clockState: clockReducer
});

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(persistedReducers, composeEnhancers(applyMiddleware(thunk)));

const onRehydrateComplete = () => {};


export const persistor = persistStore(store, null, onRehydrateComplete);

export default store;