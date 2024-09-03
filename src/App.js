import React from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";

import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider } from "antd";

function App() {
  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#000",
            colorPrimaryHover: "#000",
            borderRadius: 5,
            activeBg: "#124585",
            optionSelectedBg: "#e6f4ff",
            controlItemBgHover: "#e6f4ff",
          },
        }}
      >
        <Route />
      </ConfigProvider>
    </React.Fragment>
  );
}

export default App;
