import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import theme from './theme';
import { Menu, MenuItem } from "@material-ui/core";


// users
import avatar2 from '../../assets/images/users/avatar-1.jpg';

const useStyles = makeStyles(() =>
    createStyles({
        popover: {
            '& .MuiPopover-paper': {
                border: '1px solid #0a2348',
                backgroundColor: '#fff',
                boxShadow: 'none',
                borderRadius: '0',
                minWidth: 182,
                margin: '5px 0 0 -1px',
            },
            '& .MuiList-root': {
                padding: 0,
                '& .MuiListItem-root': {
                    font: 'inherit',
                    color: `${theme.colors.defaultDark}`,
                    borderTop: '1px solid #e9eef0',
                    padding: '10px 12px',
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: '#f5f6f9',
                        borderColor: '#ebecef',
                    },
                    '&:hover + .MuiListItem-root ': {
                        borderTopColor: '#ebecef',
                    },
                    '&:first-child': {
                        borderTopWidth: 0
                    },
                    '& a': {
                        color: `${theme.colors.defaultDark}`,
                        textDecoration: 'none',
                    }
                },
            },
        },
    }),
);

const UserArea = styled.div`
  display: flex;
  align-items: center;
  height: 132px;
  padding: 25px;
  background-color:#1a1e29;
  &.hasNotify {
    button .avatar::after {
      content: '';
      position: absolute;
      top: 1px;
      right: -1px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid #3c45d5;
      background: #ff5d4d
    }
  }
`;
const BtnArea = styled.div`
  width: 100%;

  button {
    position: relative;
    width: 100%;
    height: 32px;
    padding-left: 40px;
    border: 0;
    color: #fff;
    background: transparent;
    .avatar {
      position: absolute;
      top: 0;
      left: 0;
      width: 32px;
      height: 32px;
      border: 1px solid #016ee6;
      border-radius: 50%;
      padding: 2px;
      background: #fff url(../images/layout/sideUser_avatar.png) no-repeat center center;
      box-shadow: 0 1px 0 rgba(255,255,255,0.1);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      display: block;
      text-align: left;
      background: url(../images/layout/sideUser_arr.png) no-repeat right center
    }
  }
`;


const SideUser = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleUserOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleUserClose = () => {
        setAnchorEl(null);
    };
    const handleItemClick = () => {
        handleUserClose();
    };
    
    const [username, SetUsername] = React.useState("")


    useEffect(() => {
        if (localStorage.getItem("logonUser")) {
            // const obj = JSON.parse(localStorage.getItem("authUser"));
            // const uNm = obj.email.split("@")[0];
            // username = uNm.charAt(0).toUpperCase() + uNm.slice(1);
            SetUsername(localStorage.getItem("logonUser"))
        }
    }, []);


    return (
        <UserArea className="hasNotify">
            <BtnArea>
                <button
                    type="button"
                    onClick={handleUserOpen}
                >
                    <img className="avatar" src={avatar2}></img>
                    <span className="name">{username}</span>
                </button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleUserClose}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    className={classes.popover}
                >
                    {/* <MenuItem
                        onClick={handleItemClick}
                    >
                        <Link to="/Notify">알림 보기</Link>
                    </MenuItem> */}
                    <MenuItem
                        onClick={handleItemClick}
                    >
                        사용자 정보
                    </MenuItem>
                    <MenuItem
                        onClick={handleItemClick}
                    >
                        <Link to="/logout">로그아웃</Link>
                    </MenuItem>
                </Menu>
            </BtnArea>
        </UserArea>
    )
};

export default SideUser;
