import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import ProductList from 'components/productList';
import "./index.less";


class Products extends React.Component {

  constructor() {
    super();
  }

  handleDelete(id) {
    let { dispatch, products } = this.props;
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }

  componentDidMount() {
    let { dispatch, products } = this.props;
    dispatch({
      type: 'products/query',
      payload: "12312",
    });
  }

  render() {
    let { dispatch, products } = this.props;
    console.log(this.props,"======================")
    return (
      <div>
        <h2>List of </h2>
        <img className="test" src={`/img/yay.jpg`} alt=""/>
        <ProductList onDelete={this.handleDelete.bind(this)} tableList={products.list} />
      </div>
    );
  }
}

export default connect(({ products }) => {
  return { products };
})(Products);

