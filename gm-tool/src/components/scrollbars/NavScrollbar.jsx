import React, {useEffect, useState} from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Scrollbars  } from 'react-custom-scrollbars-2';

const useStyles = makeStyles(() =>
    createStyles({
        vTrack: {
            position: 'absolute',
            width: '6px',
            right: 0,
            bottom: 0,
            top: 0,
            padding: 1,
        },
        vThumb: {
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.45)',
            borderRadius: '3px',
            cursor: 'pointer',
        },
        hTrack: {
            position: 'absolute',
            height: 7,
            right: 0,
            bottom: 0,
            top: 0,
            background: '#020f2c'
        },
        hThumb: {
            position: 'relative',
            display: 'block',
            height: 3,
            width: '100%',
            background: '#6c798e',
            borderRadius: '2px',
            cursor: 'pointer',
        },
        view: {
            position: 'absolute',
            inset: '0px',
            overflowY: 'auto',
            marginRight: '-17px',
            marginBottom: '-17px'
        },
    }),
);

const NavScrollbar = (props) => {
    const { children } = props;
    const classes = useStyles();
    return (
        <Scrollbars
            renderTrackHorizontal={props => <div {...props} className={classes.hTrack}/>}
            renderTrackVertical={props => <div {...props} className={classes.vTrack}/>}
            renderThumbHorizontal={props => <div {...props} className={classes.hThumb}/>}
            renderThumbVertical={props => <div {...props} className={classes.vThumb}/>}
            renderView={props => <div {...props} className={classes.view}/>}
        >
            {children}
        </Scrollbars>
    );
};

export { NavScrollbar };
