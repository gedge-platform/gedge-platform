import React, { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from 'react';
import { Table, Tag, Button, Modal, notification, Select, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateUserModal from "../modals/create_user_modal";
import useNotification from "antd/es/notification/useNotification";
import EditUserModal from "../modals/edit_user_modal";
import { openErrorNotificationWithIcon, openSuccessNotificationWithIcon } from "utils/notification";
import { APIDeleteUser, APIGetUser } from "utils/api";



function UserList(props) {
  const userID = props.userID;
  const [editingID, setEditingID] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingIsAdmin, setEditingIsAdmin] = useState(1);

  const getUserList = async () => {
    const { data } = await APIGetUser();
    var list = data.users;
    var count = 0;
    list.forEach(function (item) {
      item.key = count;
      count++;
    })

    setDataSource(list);
    return list;

  };
  const columns = [
    {
      title: '유저 아이디',
      dataIndex: 'login_id',
      key: 'login_id',
      value: 'login_id',
      label: '유저 아이디',
      sorter: (a, b) => { return ([a.login_id, b.login_id].sort()[0] === a.login_id ? 1 : -1) },
      width: 400,
    },
    {
      title: '유저 이름',
      dataIndex: 'user_name',
      key: 'user_name',
      value: 'user_name',
      label: '유저 이름',
      sorter: (a, b) => { return ([a.user_name, b.user_name].sort()[0] === a.user_name ? 1 : -1) },
      width: 400,
    },
    {
      title: '권한',
      dataIndex: 'is_admin',
      key: 'is_admin',
      value: 'is_admin',
      label: '권한',
      sorter: (a, b) => a.is_admin - b.is_admin,
      defaultSortOrder: 'descend',
      width: 400,
      render: (value) => {
        let color = 'blue';
          if (value == 1) {
            color = 'green';
          }
          return (
            <Tag color={color} key={value}>
              {getRoleText(value)}
            </Tag>
          );
      }
    },
    {
      title: '액션',
      key: 'action',
      width: 400,
      render: (_, value) => {
        return(<Button type="primary" style={{backgroundColor:'#cc8800'}} onClick={()=>{updateUser(value)}}>Edit</Button>);
      }
    },
  ];

  const updateUser = (value) => {
    setEditingIsAdmin(value.is_admin);
    setEditingID(value.login_id);
    setEditingName(value.user_name);
    setEditOpen(true);
  }

  function getRoleText(admin){
    if(admin == 1){
      return "Admin";
    }
    else{
      return "Normal User";
    }
  }

  function deleteUser() {
    if(selectedRowKeys.length == 0){
      openErrorNotificationWithIcon(api, "유저 삭제 실패", "유저를 선택해주세요.");
    }
    else if(selectedRowKeys[0] == userID){
      openErrorNotificationWithIcon(api, "유저 삭제 실패", "자신은 삭제할 수 없습니다.");
    }
    else{
      showDeleteModal();
    }
  }

  const { isLoading, isError, data, error, refetch } = useQuery(["userList"], () => { return getUserList() }, {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const createUser = () => {
    showModal();
  }

  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const showDeleteModal = () => {
    setDeleteOpen(true);
  };

  const handleDeleteOk = () => {
    sendDeleteUser();
  }

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  }

  const handleEditOk = () => {
    // sendDeleteUser();
  }

  const handleEditCancel = () => {
    setEditOpen(false);
  }

  function sendDeleteUser() {
    setConfirmDeleteLoading(true);

    APIDeleteUser(selectedRowKeys[0])
      .then(response => {

        if (response.data['status'] == 'success') {
          openSuccessNotificationWithIcon(api, '유저 삭제 성공', '유저 삭제에 성공했습니다.')
        }
        else {
          openErrorNotificationWithIcon(api, '유저 삭제 실패', '유저 삭제에 실패했습니다.')
        }

        setDeleteOpen(false);
        setConfirmDeleteLoading(false);
        refetch();
      })
      .catch(error => {
        openErrorNotificationWithIcon(api, '유저 삭제 실패', '유저 삭제에 실패했습니다.')
        setDeleteOpen(false);
        setConfirmDeleteLoading(false);
        refetch();
      })

  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    type:'radio',
    onChange: onSelectChange,
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleSuccessCreateUser = () => {
    refetch();
    setOpen(false);
  }

  const handleSuccessEditUser = () => {
    refetch();
    setEditOpen(false);
  }

  const defaultFilterSelect = "login_id"
  const defaultFilterInput = ""
  const [filterSelect, setFilterSelect] = useState(defaultFilterSelect);
  const [filterInput, setFilterInput] = useState(defaultFilterInput);

  const onChangeFilterSelect = (data) => {
    setFilterSelect(data);
  }

  const onChangeFilterInput = (data) => {
    setFilterInput(data.target.value);
  }

  //filter
  useEffect(() => {
    if (!isLoading) {
      const filteredData = data.filter((entry) => {
        if(typeof entry[filterSelect] == 'string'){
          return entry[filterSelect].includes(filterInput)
        }
        return entry[filterSelect] == filterInput
      });
      setDataSource(filteredData);
    }
  }, [filterSelect, filterInput]);

  //notification
  const [api, contextHolder] = useNotification();

  return (
    <> < div id='service_define_main' >
      {contextHolder}
      <div style={{ display: 'flex' }} >
        <h2>목록</h2>
        <Select defaultValue={defaultFilterSelect} style={{ width: '120px', margin: 'auto auto auto 40px' }} options={columns.filter(column => column.value != undefined)} onChange={onChangeFilterSelect} />
        <Input placeholder="input search" style={{ width: '200px', margin: 'auto auto auto 6px' }} onChange={onChangeFilterInput} />
        <div align='right' style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button style={{ margin: 'auto 0' }} type="primary" icon={<PlusOutlined />} onClick={createUser}>
            New User
          </Button>
          <Button type="primary" icon={<DeleteOutlined />} style={{ margin: 'auto 7px', backgroundColor: '#CC0000' }} onClick={(event) => {
            event.stopPropagation();
            deleteUser()
          }}>
            Delete
          </Button>
        </div>
      </div>

      {
        !isLoading && (
          <Table rowKey={"login_id"} rowSelection={rowSelection} columns={columns} dataSource={dataSource} pagination={{ pageSize: 10, showSizeChanger: false }} />
        )

      }


      <Modal
        title="유저 생성"
        open={open}
        width={700}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={[]}
      >
        <div style={{ height: '10px' }} />
        <CreateUserModal handleSuccess={handleSuccessCreateUser} contextHolder={[api, contextHolder]}/>
      </Modal>
      <Modal
        title="유저 삭제"
        open={deleteOpen}
        onOk={handleDeleteOk}
        confirmLoading={confirmDeleteLoading}
        onCancel={handleDeleteCancel}
        destroyOnClose={true}
      >
        <div style={{ height: '10px' }} />
        {"유저 " + selectedRowKeys[0] + "를 삭제하시겠습니까?"}
      </Modal>
      <Modal
        title="유저 수정"
        open={editOpen}
        width={700}
        onCancel={handleEditCancel}
        destroyOnClose={true}
        footer={[]}
      >
        <div style={{ height: '10px' }} />
        <EditUserModal data={{id:editingID, userName: editingName, isAdmin: editingIsAdmin}} handleSuccess={handleSuccessEditUser} contextHolder={[api, contextHolder]}/>
      </Modal>
    </div>
    </>

  );
}

export {
  UserList
};
