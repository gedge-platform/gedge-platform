import { PieChartOutlined, DesktopOutlined, TeamOutlined, BarsOutlined, FormOutlined, FileSearchOutlined, FacebookFilled } from '@ant-design/icons';
import { Layout, Menu, theme, notification} from 'antd';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';

import 'css/index.css';
import { NotFound } from 'pages/not_found/notfound';
import { ServiceDefine } from './pages/project_list/service_define';
import { QueryClient, QueryClientProvider } from 'react-query'
import { DagDefine } from './pages/project_dag_editing/dag_define';
import { ReactFlowProvider } from 'reactflow';
import { DagMonitoring } from './pages/project_monitoring/dag_monitoring';
import UserInfo from './components/users/user_info';
import LoginPage from './pages/login/login_page';
import axios from 'axios';
import { UserManagement } from './pages/user_management/user_management';
import { AdminServiceDefine } from 'pages/admin_project_list/admin_service_define';
import Test from './test_page';
import LoadingPage from './components/loading/loading_page';
import { APICheckLogin, APILogout } from 'utils/api';

const queryClient = new QueryClient();
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('project_list')
  const [mainProjectID, setMainProjectID] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [innerTitle, setInnerTitle] = useState('');
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const storage = window.localStorage;

  const storageKeyStr = 'my_storage'

  const items = [
    getItem('AI-Project', '1', <PieChartOutlined />, [
      getItem(<Link to='project_list'>Project</Link>, 'project_list', <BarsOutlined />),
      getItem(<Link to='monitoring/'>Monitoring</Link>, 'monitoring', <DesktopOutlined />),
      getItem(<Link to='editing/'>DAG Editing</Link>, 'editing', <FormOutlined />)
    ]),
    getItem(<a href={'/api/storage'}  target="_blank">MY Storage</a>, storageKeyStr, <FileSearchOutlined />),
  ];
  if (isAdmin == true) {
    items.push(getItem(<Link to='users/'>Users Management</Link>, 'user_management', <TeamOutlined />));
    items.push(getItem(<Link to='admin_project_list/'>Admin Project List</Link>, 'admin_project_list', <BarsOutlined />));
  }


  const handleLogout = () => {
    APILogout().finally(() => {
      notificationData.message = "로그아웃";
      notificationData.description = "로그아웃하였습니다.";
      openNotification();
      storage.removeItem('loggedInfo');
      setLogin('', false, false);
      setIsAdmin(false);
      navigate('/login');
    });
  };

  const navigate = useNavigate();
  const initializeUserInfo = () => {
    const loggedInfo = storage.getItem('loggedInfo'); // 로그인 정보를 로컬스토리지에서 가져옵니다.
    if (!loggedInfo) {
      setLogin('', '', false, false);
      storage.removeItem('loggedInfo');
      navigate('/login');
      return;
    } // 로그인 정보가 없다면 여기서 멈춥니다.
    const obj = JSON.parse(loggedInfo);
    setUsername(obj.userName);
    setUserID(obj.userID);
    setLoggedIn(obj.loggedIn);
    setIsAdmin(obj.isAdmin);

    APICheckLogin().then((res) => {
      setLogin(res.data.data.userID, res.data.data.userName, true, res.data.data.isAdmin);
    })
      .catch((error) => {
        setLogin('', '', false, false);
        storage.removeItem('loggedInfo');
        navigate('/login');
      });

}
  useEffect(()=>{initializeUserInfo();},[navigate]);
  


  var notificationData = { message: "", description: "" }

  const openNotification = () => {
    notification.open({
      message: notificationData.message,
      description:
        notificationData.description,
      onClick: () => {
      },
    });
  };

  const setLogin = (id, name, status, isAdmin) => {
    storage.setItem('loggedInfo', JSON.stringify({userName : name, userID : id, loggedIn : status, isAdmin:isAdmin}))
    setUsername(name);
    setUserID(id);
    setLoggedIn(status)
    setIsAdmin(isAdmin);
  }

  const location = useLocation();
  useEffect(() => {
    var pathList = location.pathname.split('/');
    var key = convertAndSaveKeyFromPath(pathList);
    setInnerTitle(convertTitleFromKey(key));
    
  }, [location]);

  const convertAndSaveKeyFromPath = (pathList) => {
    var key = 'Not Found';
    if(pathList.at(1)){
      if(pathList[1] == 'project_list'){
        key = 'project_list';
      }
      else if(pathList[1] == 'monitoring'){
        key = 'monitoring'
      }
      else if(pathList[1] == 'editing'){
        key = 'editing';
      }
      else if(pathList[1] == 'users'){
        key = 'user_management';
      }
      else if(pathList[1] == 'admin_project_list'){
        key = 'admin_project_list';
      }
    }
    else{
      key = 'project_list';
    }

    setSelectedKey(key);
    return key;

  }

  const convertTitleFromKey = (key) => {
    console.log(key)
      if(key == 'project_list'){
        return '프로젝트 목록';
      }
      else if(key == 'monitoring'){
        return '모니터링';
      }
      else if(key == 'editing'){
        return 'DAG 정의';
      }
      else if(key == 'user_management'){
        return '유저 관리';
      }
      else if(key == 'admin_project_list'){
        return '관리자용 프로젝트 관리';
      }
      else{
        return '유효하지 않은 페이지';
      }
  }


  const handleLogin = (id, name, isAdmin) => {
    notificationData.message = "로그인";
    notificationData.description = "안녕하세요. " + name + "님!\n환영합니다.";
    openNotification();
    window.location.href = '/';
    setLogin(id, name, true, isAdmin);
  };

  return (
    <Content style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage handleLogin={handleLogin}/>}
        />
        <Route
          path="*"
          element={<><Header className="header" style={{ paddingInline: '16px' }}>
            <div style={{ display: 'flex', height: '100%' }}>

              <div
                style={{
                  width: '180px',
                  height: '100%',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0)',
                }}>
                <img id='image_aieyeflow' src='/images/logo_aieye.png' alt='image_aieyeflow' style={{ height: 'auto', width: '100%', verticalAlign: 'middle' }} />
              </div>
              <div style={{ marginLeft: 'auto' }}>
                {loggedIn ? (<UserInfo username={username} avatarSrc={avatarSrc} onLogout={handleLogout} style={{}} />) : (<UserInfo />)}
              </div>
            </div>
          </Header>
            <div ></div>
            <Layout
              style={{
                flex: 1

              }}
            >

              <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                <Menu theme="dark" defaultSelectedKeys={['1']} selectedKeys={[selectedKey]} mode="inline" items={items}/>
              </Sider>
              <Layout className="site-layout">
                <Content
                  style={{
                    padding: '15px',
                    backgroundColor: '#142C42',
                    color: '#ffffff'
                  }}
                >
                  <ReactFlowProvider>
                    <QueryClientProvider client={queryClient}>
                      <div id='body' >
                        <div id='body_main'>
                          <Content className="body-layout">
                            <h2>{innerTitle}</h2>
                            <Routes>
                              <Route path='/' element={<ServiceDefine userID={userID} />}></Route>
                              <Route path='/project_list/*' element={<ServiceDefine userID={userID} />}></Route>
                              <Route path='/monitoring/:projectID' element={<DagMonitoring setProjectID={setMainProjectID} />}></Route>
                              <Route path='/editing/:projectID' element={<DagDefine setProjectID={setMainProjectID} />}></Route>
                              <Route path='/monitoring/' element={<DagMonitoring setProjectID={setMainProjectID} />}></Route>
                              <Route path='/editing/' element={<DagDefine setProjectID={setMainProjectID} />}></Route>
                              <Route path='/test/' element={<LoadingPage/>}></Route>
                              <Route path='/users/' element={loggedIn ?  isAdmin ? <UserManagement userID={userID} /> : <Navigate to={'/not_found'} /> : <LoadingPage/>}></Route>
                              <Route path='/admin_project_list/monitoring/:userID/:projectID' element={loggedIn ? isAdmin ? <DagMonitoring isAdmin={isAdmin} setProjectID={setMainProjectID} /> : <Navigate to={'/not_found'} /> : <LoadingPage/>}></Route>
                              <Route path='/admin_project_list/' element={loggedIn ? isAdmin ? <AdminServiceDefine userID={userID} /> : <Navigate to={'/not_found'} /> : <LoadingPage/>}></Route>
                              <Route path='*' element={<NotFound />}></Route>
                            </Routes>
                          </Content>


                        </div>
                      </div>
                    </QueryClientProvider>
                  </ReactFlowProvider>
                </Content>
              </Layout>
            </Layout></>
                }
        />
      </Routes>

    </Content>
  );
};
export default App;
