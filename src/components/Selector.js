import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

const propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  labelRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  onChange: PropTypes.func,
};

const Selector = (props) => {
  const {
    value,
    options,
    labelRenderer,
    valueRenderer,
    onChange,
  } = props;
  const selectProps = omit(props, ['options', 'labelRenderer', 'valueRenderer']);
  return (
    <select {...selectProps} value={value} onChange={onChange}>
      {
        options && options.map((option) => {
          const optionValue = valueRenderer ? valueRenderer(option) : option.value;
          return (
            <option key={optionValue} value={optionValue}>
              {labelRenderer ? labelRenderer(option) : option.label}
            </option>
          );
        })
      }
    </select>
  );
};

Selector.propTypes = propTypes;

export default Selector;
