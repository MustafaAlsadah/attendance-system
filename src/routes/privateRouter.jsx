import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ component: Component, ...rest }) {
  // Check if the user is authenticated
  const { currentUser } = useAuth(); // Replace with your own authentication check

  return (
    <Route
      {...rest}
      render={(props) =>
         currentUser ? ( <Component {...props} /> ) : ( <Navigate to={{ pathname: '/login', state: { from: props.location } }} /> )
      }
    />
  );
}

export default PrivateRoute;