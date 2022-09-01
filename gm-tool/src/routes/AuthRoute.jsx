import React from "react";
import { Redirect, Route } from "react-router";
import { getItem } from "../utils/sessionStorageFn";

const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        getItem("userRole") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default AuthRoute;
