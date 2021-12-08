import React, { useState, useEffect, useRef } from "react";
import LineCharts from "../../AllCharts/recharts/LineCharts";
import { observer } from "mobx-react";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from '@material-ui/core/Fade';
import store from "../../../store/Monitor/store/Store"

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';

const template = observer((props) => {
    const { clusterStore } = store;

    useEffect(() => {

        return () => {
        };
        //상태값이 변할때마다 다시 렌더링 한다.
    }, []);

    return (<div>


    </div >)

})

export default template;