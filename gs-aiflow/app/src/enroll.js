import React from 'react';
import {useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function EnrollClusterMonitoring(props) {
    console.log('render');

    const [ renderFlag,setRenderFlag ] = useState(0);

    const { register,handleSubmit,reset,formState:{errors,isSubmitting}} = useForm();
    const { register: registerABS,
            handleSubmit: handleSubmitABS,
            formState:{errors: errorsABS,isSubmitting:isSubmittingABS}
    } = useForm();

    const [listCluster,setListCluster] = useState([]);

    const setMonitorSubmit = (e) => {
        setMonitorCheck(JSON.stringify(e));
        reset({'ClusterName':'','Host':'','Port':'','Token':''});
        setRenderFlag(renderFlag+1);
    }

    const absMonitorSubmit = (e) => {
        absMonitor(e);
        reset({'clusterName':''});
        setRenderFlag(renderFlag+1);
    }

    useEffect(()=>{
        getlistCluster();
        // eslint-disable-next-line
    },[renderFlag]);

    function setMonitorCheck(data){
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/setMonitor',data,config).then(response => {
            if(response['data']==="fail"){
                alert('fail')
            }else{
                alert('success')
            }
        })
    }

    function absMonitor(data){
        console.log(data);
        axios.get(process.env.REACT_APP_API+'/api/abstractMonitor/'+data['clusterName']).then(response => {
            if(response['data']==="fail"){
                alert('fail')
            }else{
                alert('success')
            }
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

    return (
		<>
		    <div id="enroll_main">
                <h2>모니터 등록</h2>
                    <div>
                        <h3 className='h3title'>cluster monitoring regist</h3>
                        <div id='enrollClusterMain'>
                            <form onSubmit={handleSubmit(setMonitorSubmit)}>
                                <label>cluster name</label><br />
                                <input {...register("ClusterName",{required:true})} />
                                {errors.ClusterName?.type==='required' && 'empty'}<br /><br />

                                <label>hostip</label><br />
                                <input {...register("Host",{required:true,pattern: /^[0-9\.]+$/})} />
                                {errors.Host?.type==='required' && 'empty'}
                                {errors.Host?.type==='pattern' && 'pattern'}<br /><br />

                                <label>port</label><br />
                                <input {...register("Port",{required:true,pattern: /^[0-9]+$/})} />
                                {errors.Port?.type==='required' && 'empty'}
                                {errors.Port?.type==='pattern' && 'pattern'}<br /><br />

                                <label>token</label><br />
                                <input {...register("Token",{required:true})} /><br /><br />

                                <button disabled={isSubmitting} type="submit">등록</button>
                            </form>
                        </div>
                        <div className='divpad' />
                        <h3 className='h3title'>cluster monitoring abstract</h3>
                        <div id="abstractClusterMain">
                            <form onSubmit={handleSubmitABS(absMonitorSubmit)}>
                                <label>cluster name</label><br />
                                <select {...registerABS('clusterName',{required:true})}>
                                    <option></option>
                                    {listCluster.map((item) => (
                                        <option value={item} key={item}>{item}</option>
                                    ))}
                                </select><br /><br />

                                <button disabled={isSubmittingABS} type="submit">삭제</button>
                                {errorsABS.clusterName?.type === 'required' &&  ' Error!'}
                            </form>
                        </div>
                    </div>
		    </div>
		</>
    );
}

export {EnrollClusterMonitoring};