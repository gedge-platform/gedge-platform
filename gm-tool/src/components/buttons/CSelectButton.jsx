import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, Menu, MenuItem } from '@material-ui/core';
import theme from '@/styles/theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const useStyles = makeStyles(() =>
    createStyles({
        popover: {
            '& .MuiPopover-paper': {
                border: '1px solid #0a2348',
                backgroundColor: '#fff',
                boxShadow: 'none',
                borderRadius: '3px',
                minWidth: 148,
                marginTop: 5
            },
            '& .MuiList-root': {
                padding: 0,
                '& .MuiListItem-root': {
                    font: 'inherit',
                    borderTop: '1px solid #e9eef0',
                    padding: '10px 12px',
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: '#e9f3ff',
                        borderColor: '#dfebf9',
                    },
                    '&:hover + .MuiListItem-root ': {
                        borderTopColor: '#dfebf9',
                    },
                    '&:first-child': {
                        borderTopWidth: 0
                    }
                },
            },
        },
        '@global': {
            '.btn_select': {
                justifyContent: 'flex-start',
                // minWidth: 148,
                height: 30,
                // padding: '0 28px 0 0',
                font: 'inherit',
                color: `${theme.colors.defaultDark}`,
                border: '1px solid #bec3ca',
                borderRadius: '3px',
                background: 'linear-gradient(#fdfdfd,#f6f6f9)',
                boxShadow: 'inset 0 0 1px #fff',
                '& .MuiButton-label': {
                    padding: '0 12px',
                    height: '100%',
                    // borderRight: '1px solid #bec3ca',
                    // boxShadow: 'inset -1px 0 0 #fff',
                    // '&::after': {
                    //     content: '""',
                    //     position: 'absolute',
                    //     width: 8,
                    //     height: 6,
                    //     right: 10,
                    //     top: '50%',
                    //     transform: 'translateY(-50%)',
                    //     background: 'url(../images/bullet/selectBtn_arr.png) no-repeat right top',
                    // }
                },
                '&:hover': {
                    '& .MuiButton-label::after': {
                        backgroundPositionY: '-6px'
                    }
                }
            }
        }
    }),
);

const CSelectButton = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { items, children, style } = props;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleItemClick = (event, item) => {
        handleClose();
        item.onClick();
    };

    return (
        <>
            <Button
                className="btn_select"
                onClick={handleClick}
                endIcon={Boolean(anchorEl) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
                {children}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                className={classes.popover}
            >
                {items.map(
                    (item, index) => (
                        <MenuItem
                            key={index}
                            onClick={(event) => {
                                handleItemClick(
                                    event,
                                    item,
                                )
                            }}
                        >
                            {item.name}
                        </MenuItem>)
                )
                }
            </Menu>
        </>
    );
};

export { CSelectButton };
