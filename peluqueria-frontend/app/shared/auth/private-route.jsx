import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorBoundary from '../error/ErrorBoundary';
import PageAccessDenied from '../error/PageAccessDenied';

export const PrivateRoute = ({ component: Component, hasAnyAuthorities = [], ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const sessionHasBeenFetched = useSelector((state) => state.auth.sessionHasBeenFetched);
  const account = useSelector((state) => state.auth.account);
  const isAuthorized = hasAnyAuthority(account?.authorities, hasAnyAuthorities);

  const checkAuthorities = (props) =>
    isAuthorized ? (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    ) : (
      <PageAccessDenied showVolver={true} />
    );

  const renderRedirect = (props) => {
    if (!sessionHasBeenFetched) {
      return <div></div>;
    } else {
      return isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      );
    }
  };

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${rest.path}`);

  return <Route {...rest} render={renderRedirect} />;
};

export const hasAnyAuthority = (authorities = [], hasAnyAuthorities = []) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};

export default PrivateRoute;