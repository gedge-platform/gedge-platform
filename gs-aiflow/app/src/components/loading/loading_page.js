
import {Spin} from 'antd'
import { LoadingOutlined } from '@ant-design/icons';

const LoadingPage = (props) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 250 }} spin />;
    return (
        <div style={{display:'flex', width:'100%', height:"600px", alignItems:'center', justifyContent:'center',flexDirection:'row'}}>

            <Spin indicator={antIcon} size='large' style={{fontSize:'80px', margin: '0 auto'}} tip="Loading..."/>
        </div>
    );
  }
  
  export default LoadingPage;