import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const propTypes = {
  columnName: PropTypes.string,
  displayName: PropTypes.string,
  sortable: PropTypes.bool,
  onColumnSort: PropTypes.func,
};

class DataTableHeader extends Component {
  constructor() {
    super();
    this.state = {
      isActived: false,
      toggledColumnSort: false,
    };
    this.handleColumnSort = this.handleColumnSort.bind(this);
  }

  static get propTypes() {
    return propTypes;
  }

  handleColumnSort(columnName) {
    const { toggledColumnSort } = this.state;
    this.props.onColumnSort(columnName, toggledColumnSort);
    this.setState({
      isActived: true,
      toggledColumnSort: !toggledColumnSort,
    });
  }

  render() {
    const {
      columnName,
      displayName,
      sortable,
    } = this.props;
    const { toggledColumnSort, isActived } = this.state;
    const sortIcon = (toggledColumnSort)
      ? <FontAwesomeIcon className="icon-tip" icon={faCaretUp} />
      : <FontAwesomeIcon className="icon-tip" icon={faCaretDown} />;
    return (
      <th scope="col" onClick={sortable && this.handleColumnSort.bind(this, columnName)}>
        {displayName || columnName}
        {isActived && sortable && sortIcon}
      </th>
    );
  }
}

export default DataTableHeader;
