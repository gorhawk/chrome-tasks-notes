import { configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";
import globalReducer from "./todosSlice";
import uiReducer from "./ui/uiSlice";
import { listenerMiddleware } from "./listenerMiddleware";
import type { GlobalState } from "./types";

export const makeStore = (preloadedState?: { global: GlobalState }) =>
  configureStore({
    reducer: {
      global: globalReducer,
      ui: uiReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
