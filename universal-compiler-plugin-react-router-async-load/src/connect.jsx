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
    constructor() {
      super();
      this.state = {
        loads: 0,
      };
    }

    componentWillMount() {
      if (ignoreNextLoad) {
        ignoreNextLoad = false;
        return;
      }
      this.load(this.props.match.params, null);
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
      this.load(nextParams, prevParams);
    }

    load(nextParams, prevParams) {
      this.setState({ loads: this.state.loads + 1 });
      return loader(this.context.store, nextParams, prevParams)
        .then(() => this.setState({ loads: this.state.loads - 1 }))
        .catch(() => this.setState({ loads: this.state.loads - 1 }));
    }

    render() {
      return <WrappedComponent {...this.props} isAsyncLoading={this.state.loads !== 0} />;
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
