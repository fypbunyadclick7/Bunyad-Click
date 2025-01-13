import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importing Cookies

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = Cookies.get('token'); // Get token from cookies

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" /> // If not authenticated, redirect to signin
        )
      }
    />
  );
};

export default PrivateRoute;
