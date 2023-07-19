import { Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const UserInfo = ({ username, avatarSrc, onLogout }) => {
    return (
        <div style={{ height: '100%', display: 'flex' }}>

            <div style={{
                padding: '8px 20px', height: '50%', margin: 'auto', display: 'flex', alignItems: 'center', verticalAlign: 'middle',
                color: 'white', fontWeight: 'bold', fontSize: '16px', backgroundColor: '#142c42', borderRadius: '30px'
            }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: '16px', backgroundColor: 'white', color: 'black' }} />
                <div style={{ marginRight: '16px' }}>{username}</div>
                <Button onClick={onLogout} style={{fontWeight:'bold'}} icon={<LogoutOutlined />}>
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default UserInfo;