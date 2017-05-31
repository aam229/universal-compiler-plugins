import React from 'react';
import PropTypes from 'prop-types';
import applicationConfig from 'application-runtime-config';

let ignoreNextLoad = !!applicationConfig.ssr;

export const connect = loader => (WrappedComponent) => {
  WrappedComponent.load = loader;
  // We don't do any of this stuff on the server
  if (process.env.JS_ENV === 'server') {
    return WrappedComponent;
  }
  class AsyncConnect extends React.Component {
    componentWillMount() {
      if (ignoreNextLoad) {
        ignoreNextLoad = false;
        return;
      }
      loader(this.context.store, this.props.match.params, null);
    }

    componentWillReceiveProps(newProps) {
      this.maybeLoadAsync(this.props, newProps);
    }

    componentDidUpdate(prevProps) {
      this.maybeLoadAsync(prevProps, this.props);
    }

    maybeLoadAsync(prevProps, newProps) {
      const {
        url: prevLocation,
        params: prevParams,
      } = prevProps.match;
      const {
        url: nextLocation,
        params: nextParams,
      } = newProps.match;

      if (prevLocation === nextLocation) {
        return;
      }
      loader(this.context.store, nextParams, prevParams);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  const wrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  AsyncConnect.contextTypes = { store: PropTypes.object.isRequired };
  AsyncConnect.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }).isRequired,
  };
  AsyncConnect.displayName = `AsyncConnect(${wrappedComponentName})`;
  AsyncConnect.WrappedComponent = WrappedComponent;
  return AsyncConnect;
};
