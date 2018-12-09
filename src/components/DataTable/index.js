import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';
import DataTableHeader from './DataTableHeader';

const propTypes = {
  dataId: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  columnMeta: PropTypes.arrayOf(PropTypes.shape({
    columnName: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    customComponent: PropTypes.func,
    sortable: PropTypes.bool,
  })).isRequired,
  emptyText: PropTypes.string,
  isLoading: PropTypes.bool,
};

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      prevDataId: props.dataId,
    };
    this.handleColumnSort = this.handleColumnSort.bind(this);
  }

  static get propTypes() {
    return propTypes;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.dataId !== state.prevDataId) {
      return {
        prevDataId: props.dataId,
        data: props.data,
      };
    }
    return null;
  }

  handleColumnSort(columnName, toggledColumnSort) {
    const cloneData = [...this.state.data];
    cloneData.sort((a, b) => {
      if (a[columnName] < b[columnName]) return -1;
      if (a[columnName] > b[columnName]) return 1;
      return 0;
    });
    if (toggledColumnSort) {
      cloneData.reverse();
    }
    this.setState({ data: cloneData });
  }

  render() {
    const {
      columnMeta,
      emptyText,
      isLoading,
    } = this.props;
    const { data } = this.state;

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            {columnMeta.map((meta, idx) => (
              <DataTableHeader
                {...meta}
                key={idx}
                onColumnSort={this.handleColumnSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {(() => {
            if (isLoading) {
              return (
                <tr>
                  <td colSpan={columnMeta.length} className="text-center">
                    <Loading size="lg" />
                  </td>
                </tr>
              );
            }
            if (!data.length && !isLoading) {
              return (
                <tr>
                  <td colSpan={columnMeta.length} className="text-center">
                    {emptyText}
                  </td>
                </tr>
              );
            }
            return data.map((rowdata, index) => (
              <tr key={index}>
                {columnMeta.map((meta, cellIndex) => {
                  const { columnName, customComponent } = meta;
                  const cellData = rowdata[columnName];
                  let cell = null;
                  if (cellData && customComponent) {
                    cell = React.cloneElement(React.createElement(customComponent), {
                      rowdata,
                      data: cellData,
                      metadata: meta,
                    });
                  } else if (cellData) {
                    cell = cellData;
                  }
                  return (
                    <td key={`${index}-${cellIndex}`}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ));
          })()}
        </tbody>
      </table>
    );
  }
}

export default DataTable;
