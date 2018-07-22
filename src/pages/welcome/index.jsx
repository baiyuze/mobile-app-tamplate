import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import './index.less';


class IndexPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="normal">
        <h1 className="title">Yay! Welcome to dva!!</h1>
        <div className="welcome" />
        <ul className="list">
          <Button className='btn-button'>按钮</Button>
        </ul>
      </div>
    );
  }

}



IndexPage.propTypes = {
};

export default connect()(IndexPage);
