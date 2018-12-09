import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const propTypes = {
  size: PropTypes.string,
};

const Loading = ({ size } = {}) => <FontAwesomeIcon icon={faSpinner} size={size} spin />;

Loading.propTypes = propTypes;

export default Loading;
