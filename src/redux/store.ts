import {
  AnyAction,
  configureStore,
  Dispatch,
  Middleware,
} from "@reduxjs/toolkit";
import authReducer from "./auth";
import logger from "redux-logger";

const middlewares: Middleware<{}, any, Dispatch<AnyAction>>[] = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: middlewares,
});

export type appDispatch = typeof store.dispatch;

export type rootState = ReturnType<typeof store.getState>;
