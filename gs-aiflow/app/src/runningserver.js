import React from "react";
import {useState,useEffect} from 'react';
import axios from 'axios';

import {Flowchart} from './flowchart.js';

function RunningServer(props){
    const [listServer,setListServer] = useState(['']);
    const [selectServer,setSelectServer] = useState('null');

    const selectListServer = (e) => {
        setSelectServer(e.target.value);
    }

    useEffect(()=>{
        if(props.clustername.length===1){
            getServerList(props.clustername);
        }
    },[props.clustername])

    useEffect(()=>{

    },[selectServer])

    function getServerList(clustername){
        var update_list;
        axios.get(process.env.REACT_APP_API+'/api/getServerListDB/'+clustername).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                update_list.push(data[dataKey[i]]);
            }
            setListServer(update_list);
        }).catch(error => {
            console.log('runningserver',error);
        })
    }
    return(
        <>
        <select onChange={selectListServer} value={selectServer}>
            <option value='null' key='null'>---------</option>
            {listServer.map((item) => (
                                <option value={item} key={item}>{item}</option>
                            ))}
        </select><br />
        <Flowchart value={selectServer} podinfo={props.podinfo} />
        </>
    )
}

export {RunningServer}