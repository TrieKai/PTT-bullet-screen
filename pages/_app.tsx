import React from "react";

import "../styles/globals.scss";

const MyApp: React.FC<any> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
