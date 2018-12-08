import './style.css';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

const MessageModal = ({
  title,
  message,
  onClose,
} = {}) => (
  <div className="message-modal" tabIndex="-1">
    <div className="message-modal__dialog">
      <div className="message-modal__content">
        <div className="message-modal__header">
          {title || '訊息'}
          <button
            type="button"
            className="close message-modal__close"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="message-modal__body">
          <p>{message}</p>
        </div>
        <div className="message-modal__footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
);

MessageModal.propTypes = propTypes;

export default MessageModal;
