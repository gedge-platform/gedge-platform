import { React, useState } from 'react';
import 'css/create_project_modal.css';
import { Button, Form, Input, Select } from 'antd';
import axios from "axios";
import { openErrorNotificationWithIcon, openSuccessNotificationWithIcon } from 'utils/notification';
import { APIUpdateUser } from 'utils/api';

const EditUserModal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const id = props.data.id;
  const userName = props.data.userName;
  const isAdmin = props.data.isAdmin;
  const [role, setRole] = useState(0);

  var specialNickRegex = /^[A-Za-z0-9가-힣]{4,}$/;

  const onFinish = (values) => {
      APIUpdateUser(id, values.nickname, values.Role)
        .then((res) => {
          if (res.data.status == 'success') {
            openSuccessNotificationWithIcon(api, "유저 수정 성공", "유저 수정에 성공했습니다.")
            handleSuccess();
          }
          else {
            if (res.data.msg != undefined) {
              openErrorNotificationWithIcon(api, "유저 수정 실패", res.data.msg);
            }
            else {
              openErrorNotificationWithIcon(api, "유저 수정 실패", "유저 수정에 실패했습니다.");
            }
          }

        })
        .catch((error) => {
          openErrorNotificationWithIcon(api, "유저 수정 실패", "서버와 통신에 실패했습니다.");
        })
    
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 5,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 19,
      },
    },
  };
  const [form] = Form.useForm();
  const handleSuccess = props.handleSuccess;
  const [api, contextHolder] = props.contextHolder;

  const onChangeSelectAdmin = (value) => {
    setRole(value);
  }
  const adminOption = [
    {value:1, label:'Admin'},
    {value:0, label:'Normal User'}
  ]
  return (

    <div id='create_user_modal'>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 700,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="id"
          label="ID"
          initialValue={id}
        >
          <div style={{ display: 'flex' }}>
            <Input defaultValue={id} disabled={true} />
            
          </div>
        </Form.Item>

        <Form.Item
          name="nickname"
          label="Nickname"
          tooltip="What do you want others to call you?"
          initialValue={userName}
          rules={[
            {
              required: true,
              message: '닉네임을 입력해주세요!',
              whitespace: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (specialNickRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('닉네임은 4자 이상의 알파벳과 숫자, 한글만 가능합니다!'));
              },
            }),
          ]}
        >
          <Input defaultValue={userName}/>
        </Form.Item>

        <Form.Item
          name="Role"
          label="Role"
          initialValue={isAdmin}>
          <Select 
            defaultValue={isAdmin} 
            options={adminOption} 
            onChange={onChangeSelectAdmin}/>
        </Form.Item>

        <Form.Item

          wrapperCol={{
            offset: 0,
            span: 24,
          }}>
          <div style={{ display: 'flex' }}>

            <Button style={{ marginLeft: 'auto', width: '100px', fontWeight: 'bold' }} type="primary" htmlType="submit">
              수정하기
            </Button>
          </div>
        </Form.Item>

      </Form>
    </div>

  );
}

export default EditUserModal;