import React from 'react';
import {useState,useEffect} from 'react';
import axios from 'axios';

function Enrollexecute(props){
    console.log('render');
    const [cluster,setCluster] = useState('');
    const [listCluster,setListCluster] = useState([]);

    const [apiVersion,setApiVersion] = useState('');
    const [kind,setKind] = useState('');
    const [Mname,setMname] = useState('');

    const [delPodName,setdelPodName] = useState('');

    const apiVersionChange = (e) => {
        setApiVersion(e.target.value);
    };
    const kindChange = (e) => {
        setKind(e.target.value);
    }
    const MnameChange =(e) => {
        setMname(e.target.value);
    }

    const delPodNameChange= (e) => {
        setdelPodName(e.target.value);
    }
    const clusterSelect = (e) => {
        setCluster(e.target.value);
    }

    useEffect(()=>{
        getlistCluster();
        // eslint-disable-next-line
    },[]);

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
    function createDict(){
        const data={
            "apiVersion":apiVersion,
            "kind":kind,
            "Metadata_name":Mname
        };
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/createDict',datajson,config).then(response => {
        }).catch(err =>{
            console.log('createDict error',err)
        })
    }

    function deletePod(){
        axios.get(process.env.REACT_APP_API+'/api/deletePod/'+delPodName).then(response => {
        }).catch(err =>{
            console.log('createDict error',err)
        })
    }


    return (
		<>
		    <h3>파드 생성 테스트페이지 edit.. form </h3>
            <div>
                <h3>createDict test</h3>
                cluster:<select onChange={clusterSelect} value={cluster}>
                    {listCluster.map((item) => (
                        <option value={item} key={item}>{item}</option>
                    ))}
                </select>
                <form onSubmit={createDict}>
                    <label>apiVersion:</label>
                    <input type="text" onChange={apiVersionChange} value={apiVersion} /><br />

                    <label>kind:</label>
                    <input type="text" onChange={kindChange} value={kind} /><br />

                    <label>metadata name:</label>
                    <input type="text" onChange={MnameChange} value={Mname} /><br />
                    <button type="submit">등록</button>
                </form>
            </div>
            <div>
                <h3>deletePod test(clustername='cluster_test1',namespace='default') </h3>
                <form onSubmit={deletePod}>
                    name: <input type="text" onChange={delPodNameChange} value={delPodName} /><br />
                    <button type="submit">등록</button>
                </form>
            </div>
		</>
    );
}

export {Enrollexecute};