import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { APILogin } from 'utils/api';

const LoginPage = (props) => {
    const handleLogin = props.handleLogin;
    const onFinish = (values) => {
        APILogin(values)
            .then((res) => {
                if (res.data.status == 'success') {
                    handleLogin(res.data.data.userID, res.data.data.userName, res.data.data.isAdmin);
                }
                else {
                    setSubmitText(res.data.msg);
                }
            })
            .catch((error) => {
                setSubmitText('login error');
            });
        // 로그인 처리 로직을 구현합니다.
    };

    const [submitText, setSubmitText] = useState('');

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#001529', fontFamily: 'Noto Sans KR' }}>

            <div style={{ margin: 'auto', backgroundColor: 'traspernant', width: '1100px', height: '700px', display: 'flex', borderRadius: '30px', overflow: 'hidden' }}>
                <div style={{ width: '550px', padding: '0px', display: 'flex', backgroundColor: '#FFFFFF' }}>
                    <div style={{ margin: '0px 95px' }}>
                        <div style={{ paddingTop: '82px', fontSize: '52pt', fontWeight: 'bold', display: 'inline-block', color:'#033E6B' }}>Welcome!
                        </div>
                        <div style={{ paddingTop: '8px', fontSize: '24px', fontWeight: 'normal', display: 'inline-block' , color:'#033E6B'}}>환영합니다!
                        </div>
                        <Form
                            name="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            style={{ paddingTop:'50px', width: '100%' }}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="ID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your ID!',
                                    },
                                ]}
                            >
                                <Input style={{backgroundColor:'#F1F1F5', borderRadius:'0px', fontSize:'14pt'}} placeholder={"아이디를 입력해주세요."}/>
                            </Form.Item>

                            <Form.Item
                                name="PW"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password className='pass_input' style={{backgroundColor:'#F1F1F5', borderRadius:'0px', fontSize:'14pt'}} placeholder={"비밀번호를 입력해주세요."}/>
                            </Form.Item>

                            <Button id='login-form_Submit' style={{alignItems:'center', height:'60px', fontSize:'24pt', fontWeight:'bold', backgroundColor:'#033E6B', marginTop:'32px', width: '100%', borderRadius:'0px', borderColor:'transparent' }} type="primary" htmlType="submit">
                                로그인
                            </Button>
                            <div id='login-form_Submit_text' style={{ width: '100%', fontWeight: 'bold', color: 'red' }} type="primary" htmltype="submit">
                                {submitText}
                            </div>
                        </Form></div>
                </div>
                <div style={{ width: '550px', backgroundColor: '#033E6B', color: 'white', padding: '0px', display: 'flex', fontSize: '40px', flexDirection: 'column' }}>
                    <div style={{ padding: '0px 95px' }}>
                        <div style={{ paddingTop: '82px', fontSize: '52pt', fontWeight: 'bold', display: 'inline-block' }}>AIFLOW</div>
                        <div style={{ paddingTop: '8px', fontSize: '24pt', fontWeight: 'normal', display: 'inline-block' }}>Gedge Flatform</div>
                        <div
                            style={{
                                paddingTop: '50px',
                                width: '100%',
                                height: '100%',
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0)',
                            }}>
                            <img id='image_aieyeflow' src='/images/login_logo.png' alt='image_aieyeflow' style={{ height: 'auto', width: '100%', verticalAlign: 'middle' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;