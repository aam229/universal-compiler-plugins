import React from 'react';
import PropTypes from 'prop-types';

export default class UserAgent extends React.Component {
  getChildContext() {
    let userAgent;
    if (this.props.headers && this.props.headers['user-agent']) {
      userAgent = this.props.headers['user-agent'];
    } else if (typeof navigator !== 'undefined') {
      userAgent = navigator.userAgent;
    } else {
      userAgent = null;
    }
    return { userAgent };
  }

  render() {
    return this.props.children;
  }
}

UserAgent.childContextTypes = {
  userAgent: PropTypes.string,
};
UserAgent.propTypes = {
  children: PropTypes.element.isRequired,
  headers: PropTypes.shape({
    'user-agent': PropTypes.string,
  }).isRequired,
};
