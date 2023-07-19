import React from 'react';
import {useState,useEffect,useRef} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

function LogViewer(props){
    const { register,getValues} = useForm();
    const [listCluster, setListCluster] = useState(['']);
    const [listNamespace, setListNamespace] = useState(['']);
    const [listPod, setListPod]= useState(['']);
    const [podLog, setPodLog] = useState('');
    const [timeout_id,setTimeout_id] = useState('');
    const [buttonText,setButtonText] = useState('stop');
    const textAreaRef=useRef();

    const updateNamespace = (e) => {
        getListNamespace(e.target.value);
    }

    const updatePod = (e) => {
        getListPod(e.target.value);
    }

    const updateTextarea = (e) => {
        clearTime();
        getPodLog(e.target.value);
    }

    useEffect((e)=>{
        beforeUnload();
        getListCluster();
        // eslint-disable-next-line
    },[]);

    useEffect((e)=>{
        const area = textAreaRef.current;
        area.scrollTop = area.scrollHeight;
    },[podLog]);

    useEffect((e)=>{

    },[]);

    function clearTime(){
        if(timeout_id===''){
        }else{
            clearTimeout(timeout_id);
        }
    }

    var update_list;
    function getListCluster(){
        axios.get(process.env.REACT_APP_API+'/api/getListCluster', {withCredentials:true}).then(response => {
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
            console.log('logviewer error',error);
        })
    }

    function getListNamespace(data){
        axios.get(process.env.REACT_APP_API+'/api/getPodNamespaceList/'+data, {withCredentials:true}).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                update_list.push(data[dataKey[i]][0]);
            }
            setListNamespace(update_list);
        })
    }

    function getListPod(targetvalue){
        const data={
            "cluster":[getValues('clusterName')],
            "namespace":targetvalue
        };
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/getListNamespacePod',datajson,config).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list.push(data[dataKey[i]][2]);
            }
            setListPod(update_list);
        }).catch(err => {
        })
    }

    function getPodLog(targetvalue){
        const data={
            "cluster":getValues('clusterName'),
            "namespace":getValues('namespaceName'),
            "pod":targetvalue
        }
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/getPodLog',datajson,config).then(response => {
            setPodLog(response['data']);
        })

        const sTid=setTimeout(()=> {getPodLog(targetvalue)},10000);
        setTimeout_id(sTid);
    }

    function buttonAction(){
        if(buttonText==='stop'){
            setButtonText('go');
            clearTime();
        }else{
            setButtonText('stop');
            getPodLog(getValues('podName'));
        }
    }

    function beforeUnload(){
        window.addEventListener('beforeunload',function(e){
            e.preventDefault();
            clearTime();
        })
    }

    return (
		<>
		    <div id='logmain'>
                <h3>logviewer</h3>
                <div id='logviewerMain'>
                    <form id='logviewerForm'>
                        cluster<br />
                            <select {...register('clusterName',{required:true})} onChange={updateNamespace}>
                                        <option value="">---select---</option>
                                        {listCluster.map((item) => (
                                            <option value={item} key={item}>{item}</option>
                                        ))}
                            </select><br />

                        namespace<br />
                            <select {...register('namespaceName',{required:true})} onChange={updatePod}>
                                        <option value="">---select---</option>
                                        {listNamespace.map((item) => (
                                            <option value={item} key={item}>{item}</option>
                                        ))}
                            </select><br />

                        pod<br />
                            <select {...register('podName',{required:true})} onChange={updateTextarea}>
                                        <option value="">---select---</option>
                                        {listPod.map((item) => (
                                            <option value={item} key={item}>{item}</option>
                                        ))}
                            </select><br />
                    </form>
                    <div id="divlogviewerButton">
                        <button onClick={buttonAction}>{buttonText}</button>
                    </div>
                    <textarea id="podLog" ref={textAreaRef}  disabled={true} value={podLog} />
                </div>
            </div>
		</>
    );
}

export {LogViewer};