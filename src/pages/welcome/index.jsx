import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import _ from 'lodash';
import './index.less';

console.log(_,'===lodash====');


class IndexPage extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="normal">
        <h1 className="title">Yay! Welcome to dva!!</h1>
        <div className="welcome" />
        <ul className="list">
          <Button type='primary' onClick={() => {
                if(navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                      function (position) {  
                          var longitude = position.coords.longitude;  
                          var latitude = position.coords.latitude;  
                          alert(longitude);
                          console.log(longitude)
                          console.log(latitude)
                          
              
                      }
                    ) 
                 }
          }} className='btn-button'>按钮</Button>
        </ul>
      </div>
    );
  }

}



IndexPage.propTypes = {
};

export default connect()(IndexPage);
