import { React, useState } from 'react';
import 'css/create_project_modal.css';
import { Table, Button, Form, Input, Select } from 'antd';
import { useQuery } from "react-query";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import axios from "axios";
import { openErrorNotificationWithIcon, openSuccessNotificationWithIcon } from 'utils/notification';
import { APIAdminGetCluster, APICreateUser, APIGetUserName } from 'utils/api';

const CreateUserModal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const [validation, setValidation] = useState(false);
  const [validationFailed, setValidationFailed] = useState(false);
  const [role, setRole] = useState(0);
  const [clusterList, setClusterList] = useState([]);

  const columns = [
    {
      title: '이름',
      dataIndex: 'clusterName',
    },
    {
      title: '타입',
      dataIndex: 'clusterType',
    },
    {
      title: '노드개수',
      dataIndex: 'nodeCnt',
    },
    {
      title: 'IP',
      dataIndex: 'clusterEndpoint',
    },
  ];

  const getAllClusterList = async (id) => {
    const { data } = await APIAdminGetCluster();
    var list = data.cluster_list;
    var count = 0;
    list.forEach(function (item) {
      item.key = count;
      count++;
    })
    return list;

  };


  const { isLoading, isError, data, error } = useQuery(["clusters"], () => { return getAllClusterList() }, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setClusterList(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };


  var specialNameRegex = /^[A-Za-z0-9]{6,}$/;
  var specialPassRegex = /^[A-Za-z0-9!@#$%]{8,}$/;
  var specialNickRegex = /^[A-Za-z0-9가-힣]{4,}$/;

  const validateID = (name) => {
    if (name == '') {
      return false;
    }
    else {
      return specialNameRegex.test(name);
    }
  }

  const validateIDFromServer = (name) => {
    enterLoading(0);
    APIGetUserName(name)
      .then(response => {
        if (response['data']['user'] != undefined) {
          setValidationFailed(true);
          setValidation(true);
        }
        else {
          setValidationFailed(false);
          setValidation(true);
        }

        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[0] = false;
          return newLoadings;
        });
      })
      .catch(error => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[0] = false;
          return newLoadings;
        });

        if(error){
          if(error.response){
            if(error.response.status == 404){
              setValidationFailed(false);
              setValidation(true);
              return;
            }
          }
        }
        setValidation(false);
        setValidationFailed(true);
      });
  }

  const onFinish = (values) => {
    if (validation && !validationFailed) {
      const clusterNameList = [];
      clusterList.forEach((item) => {
        clusterNameList.push(item.clusterName);
      })
      APICreateUser(values.id, values.nickname, values.password, clusterNameList, role)
        .then((res) => {
          if (res.data.status == 'success') {
            openSuccessNotificationWithIcon(api, "유저 생성 성공", "유저 생성에 성공했습니다.");
            handleSuccess();
          }
          else {
            if (res.data.msg != undefined) {
              openErrorNotificationWithIcon(api, "유저 생성 실패", res.data.msg);
            }
            else {
              openErrorNotificationWithIcon(api, "유저 생성 실패", "유저 생성에 실패했습니다.");
            }
          }

        })
        .catch((error) => {
          openErrorNotificationWithIcon(api, "유저 생성 실패", "서버와 통신에 실패했습니다.");
        })
    }
    else if (validation && validationFailed) {
      openErrorNotificationWithIcon(api, "유저 생성 실패", "중복된 아이디입니다.");
    }
    else {
      openErrorNotificationWithIcon(api, "유저 생성 실패", "아이디 중복 확인이 필요합니다.");
    }
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
  const [ID, setID] = useState("");
  const [api, contextHolder] = props.contextHolder;

  const onChangeIDInput = (value) => {
    setID(value.target.value);
    setValidation(false);
  }

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
          rules={[
            {
              required: true,
              message: '아이디를 입력해주세요!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (specialNameRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('ID는 6자 이상의 알파벳과 숫자만 가능합니다!'));
              },
            }),
          ]}
        >
          <div style={{ display: 'flex' }}>
            <Input onChange={onChangeIDInput} />
            {
              validation ?
                (
                  validationFailed ?
                    <Button style={{ backgroundColor: 'red', marginLeft: '10px' }} type="primary" shape="circle" icon={<CloseOutlined />} />
                    :
                    <Button style={{ backgroundColor: '#52c41a', marginLeft: '10px' }} type="primary" shape="circle" icon={<CheckOutlined />} />
                )
                :
                <Button type="primary" style={{ fontWeight: 'bold', marginLeft: '10px' }} loading={loadings[0]} onClick={() => {
                  if (validateID(ID)) {
                    validateIDFromServer(ID)
                  }
                }}>
                  중복 확인
                </Button>
            }
          </div>
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해주세요!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (specialPassRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Password는 8자 이상의 알파벳과 숫자, !,@,#,$,% 만 가능합니다!'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '비밀번호 확인을 입력해주세요!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호와 같지 않습니다.'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="Nickname"
          tooltip="What do you want others to call you?"
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
          <Input />
        </Form.Item>

        <Form.Item
          name="Role"
          label="Role">
          <Select 
            defaultValue={role} 
            options={adminOption} 
            onChange={onChangeSelectAdmin}/>
        </Form.Item>
        <Form.Item

          name="cluster_list"
          label="Cluster"
          rules={[
            ({ getFieldValue }) => ({
              validator(_) {
                if (clusterList.length == 0) {
                  return Promise.reject(new Error('클러스터를 선택해주세요!'));
                }
                else {
                  return Promise.resolve();
                }
              },
            })

          ]}>

          <Table style={{ width: '100%' }}
            rowSelection={{
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </Form.Item>

        <Form.Item

          wrapperCol={{
            offset: 0,
            span: 24,
          }}>
          <div style={{ display: 'flex' }}>

            <Button style={{ marginLeft: 'auto', width: '100px', fontWeight: 'bold' }} type="primary" htmlType="submit">
              계정 생성
            </Button>
          </div>
        </Form.Item>

      </Form>
    </div>

  );
}

export default CreateUserModal;