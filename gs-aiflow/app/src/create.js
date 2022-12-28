import React from "react";
import {useState,useEffect} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

import {Flowchart} from './flowchart.js';

function Create(){
    const [listCluster,setListCluster] = useState(['']);
    const [listServer,setListServer] = useState(['']);
    const [listDeployment,setListDeployment] = useState(['']);
    const [listDeployment1,setListDeployment1] = useState(['']);
    const { register,getValues,handleSubmit,formState: {errors,isSubmitting}} = useForm();
    const { register: registerDEL,
            handleSubmit: handleSubmitDEL,
            formState:{
                        isSubmitting:isSubmittingDEL}}= useForm();

    const [propsServer,setPropsServer] = useState('test');

    const createServerSubmit = (e) => {
        createServer(e);
    }

    const deleteDeploymentSubmit = (e) => {
        deleteDeployment(e);
        refreshPage();
    }

    const selectServer = (e) =>{
        setPropsServer(e.target.label);
    }

    useEffect(()=>{
        getlistCluster();
        getlistServer();
        // eslint-disable-next-line
    },[]);

    useEffect(()=>{
    },[propsServer])

    function refreshPage(){
        window.location.reload(false);
    }
    function createServer(data){
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/createServer',datajson,config).then(response => {
            console.log(response);
            alert(response);
        }).catch(err => {
            alert('err')
        })
    }

    function deleteDeployment(data){
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/deleteDeployment',datajson,config).then(response => {
            console.log(response);
            alert(response);
        })
    }

    var update_list;
    function getlistCluster(){
        axios.get(process.env.REACT_APP_API+'/api/getListCluster').then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                if(data[dataKey[i]][3]==="True"){
                    update_list.push(data[dataKey[i]][0]);
                }
            }
            setListCluster(update_list);
        }).catch(error => {
            console.log('enrollexecutecluster error',error);
        })
    }

    function getlistServer(){
        axios.get(process.env.REACT_APP_API+'/api/getServerList').then(response => {
            var data=response['data']['serverList'];
            update_list=[];
            for(var i=0;i<data.length;i++){
                update_list.push(data[i]);
            }
            setListServer(update_list);
        }).catch(error => {
            console.log('getServerList error',error);
        })
    }

    function getListDeployment(server){
        axios.get(process.env.REACT_APP_API+'/api/getListCreateDeployment/'+server).then(response => {
            var data= response['data']['deployList'];
            update_list=[];
            for(var i=0;i<data.length;i++){
                update_list.push(data[i]);
            }
            setListDeployment(update_list);
        }).catch(error => {
            console.log('getListDeployment err',error);
        })
    }

    function getListDeploymentAllNamespaces(clusterName1){
        if(clusterName1===''){
            setListDeployment1(['']);
        }else{
            axios.get(process.env.REACT_APP_API+'/api/getListDeploymentAllNamespaces/'+clusterName1).then(response => {
                var data = response['data'];
                var dataKey=Object.keys(data);
                console.log(data);
                update_list=[];
                for(var i=0;i<dataKey.length;i++){
                    update_list.push(data[i][0] +','+data[i][1])
                }
                setListDeployment1(update_list);
                console.log(update_list);
            }).catch(error => {
                console.log('getListDeploymentAllNamespaces err',error);
            })
        }
    }

    const viewdir = (e) => {
        getListDeployment(e.target.value);
    }

    const viewDN = (e) =>{
        getListDeploymentAllNamespaces(e.target.value);
    }
    return(
        <>
            <h1>CreatePage</h1>
            <div>
                <h3 className='h3title'>Create deployment</h3>
                <div id="createServerMain">
                    <form onSubmit={handleSubmit(createServerSubmit)}>
                        <div id='createServerContent'>
                            <div id='cSC1'>
                                <div>
                                    <label className='label13'>cluster</label>
                                </div>
                                <select {...register('clusterName',{required:true})} multiple>
                                        {listCluster.map((item) => (
                                            <option value={item} key={item}>{item}</option>
                                        ))}
                                </select><br />
                            </div>
                            <div id='cSC2'>
                                <div>
                                    <label className='label13'>server</label>
                                </div>
                                <select {...register('serverName',{required:true})} onChange={viewdir} multiple onClick={selectServer}>
                                        {listServer.map((item) => (
                                            <option value={item} key={item}>{item}</option>
                                        ))}
                                </select><br />
                            </div>
                            <div id='cSC3'>
                                <div>
                                    <label className='label13'>구성</label>
                                </div>
                                <div id='cSC3table'>
                                    <hr />
                                    <table>
                                        <thead>
                                        </thead>
                                        <tbody>
                                            {listDeployment.map((item) =>(
                                                <tr key={item}>
                                                    <td key={item}>{item}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <hr />
                                </div>
                                <div className='formErrors'>
                                    {errors.clusterName?.type==='required' && 'clusterName required\n'}
                                    {errors.serverName?.type==='required' && 'serverName required\n'}
                                </div>
                                <div id='wrapcreateflow'>
                                    <button disabled={isSubmitting} type="submit">create</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Flowchart value={propsServer} />
        </>
    )
}

export{Create};