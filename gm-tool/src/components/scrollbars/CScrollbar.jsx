import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Scrollbars  } from 'react-custom-scrollbars-2';

const useStyles = makeStyles(() =>
    createStyles({
        vTrack: {
            position: 'absolute',
            width: '8px !important',
            right: 0,
            bottom: 0,
            top: 0,
            padding: '2px',
            background: '#fff',
            borderLeft: '1px solid #dee0e2',
        },
        vThumb: {
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '100%',
            background: '#d3d6d9',
            borderRadius: '2px',
            cursor: 'pointer',
        },
        hTrack: {
            position: 'absolute',
            height: '8px !important',
            right: 0,
            bottom: 0,
            top: 0,
            padding: '2px',
            background: '#fff',
            borderTop: '1px solid #dee0e2',
        },
        hThumb: {
            position: 'relative',
            display: 'block',
            height: '100%',
            width: '100%',
            background: '#d3d6d9',
            borderRadius: '2px',
            cursor: 'pointer',
        },
        view: {
            position: 'absolute',
            inset: '0px',
            overflowY: 'auto',
            marginRight: '-17px',
            marginBottom: '-17px',
            padding: '9px'
        },
    }),
);

const CScrollbar = (props) => {
    const { children } = props;
    const classes = useStyles();
    return (
        <Scrollbars
            renderTrackHorizontal={props => <div {...props} className={classes.hTrack}/>}
            renderTrackVertical={props => <div {...props} className={classes.vTrack}/>}
            renderThumbHorizontal={props => <div {...props} className={classes.hThumb}/>}
            renderThumbVertical={props => <div {...props} className={classes.vThumb}/>}
            renderView={props => <div {...props} className={classes.view}/>}
            hideTracksWhenNotNeeded={true}
        >
            {children}
        </Scrollbars>
    );
};

export { CScrollbar };
