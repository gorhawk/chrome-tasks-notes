import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { makeStore } from "./src/redux/store";
import Application from "./src/components/Application";
import { loadState } from "./src/storage/storage";
import type { GlobalState } from "./src/redux/types";

const init = (globalState: GlobalState | undefined) => {
  console.log(globalState);
  const wrapper = document.getElementById("js-wrapper");
  const store = makeStore(globalState ? { global: globalState } : undefined);
  const root = createRoot(wrapper!);
  root.render(
    <Provider store={store}>
      <Application />
    </Provider>,
  );
};

loadState(init);
