import React from 'react';
import PropTypes from 'prop-types';

export const connect = loader => (WrappedComponent) => {
  WrappedComponent.load = loader;
  // We don't do any of this stuff on the server

  if (process.env.JS_ENV === 'server') {
    return WrappedComponent;
  }
  class AsyncConnect extends React.Component {
    constructor() {
      super();
      this.state = {
        loads: 0,
      };
    }

    componentWillMount() {
      if (window.ucReactRouterAsyncLoad.skipFirstLoad) {
        return;
      }
      this.load(this.props.match.params, null);
    }

    componentWillReceiveProps(newProps) {
      this.maybeLoadAsync(this.props, newProps);
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
      this.load(nextParams, prevParams);
    }

    load(nextParams, prevParams) {
      this.setState({ loads: this.state.loads + 1 });
      return loader(this.context.store, nextParams, prevParams)
        .then(() => this.setState({ loads: this.state.loads - 1 }))
        .catch((err) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(err, err.stack);
          }
          this.setState({ loads: this.state.loads - 1 });
        });
    }

    render() {
      const {
        loads,
      } = this.state;
      return <WrappedComponent {...this.props} isAsyncLoading={loads !== 0} />;
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
