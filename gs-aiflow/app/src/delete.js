import React from "react";
import {useState,useEffect} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

function Delete(){
    const [listDeployment1,setListDeployment1] = useState(['']);
    const [listCluster,setListCluster] = useState(['']);
    const { register: registerDEL,
            handleSubmit: handleSubmitDEL,
            formState:{
                        isSubmitting:isSubmittingDEL}}= useForm();

    const deleteDeploymentSubmit = (e) => {
        deleteDeployment(e);
        refreshPage();
    }

    const viewDN = (e) =>{
        getListDeploymentAllNamespaces(e.target.value);
    }

    useEffect(()=>{
        getlistCluster();
        // eslint-disable-next-line
    },[])
    var update_list;

    function refreshPage(){
        window.location.reload(false);
    }

    function deleteDeployment(data){
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/deleteDeployment',datajson,config).then(response => {
            console.log(response);
            alert(response);
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
    return(
        <>
            <div id='deletemain'>
                <h3 className='h3title'>delete deployment</h3>
                <div id="deleteDeploymentMain">
                    <form onSubmit={handleSubmitDEL(deleteDeploymentSubmit)}>
                        <div id="deleteDeploymentContent">
                            <div id="dDC1">
                                <label className='label13'>cluster</label>
                                <select {...registerDEL('clusterName1',{required:true})} onChange={viewDN} multiple>
                                                    {listCluster.map((item) => (
                                                        <option value={item} key={item}>{item}</option>
                                                    ))}
                                </select><br />
                            </div>
                            <div id="dDC2">
                                <label className='label13'>name,namespaces</label>
                                <select {...registerDEL('nameNamespace',{required:true})} multiple>
                                    {listDeployment1.map((item) => (
                                        <option className='formErrors' value={item} key={item}>{item}</option>
                                    ))}
                                </select><br />
                            </div>
                            <button disabled={isSubmittingDEL} type='submit'>삭제</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export{Delete}