import React from 'react';
import {useState,useEffect} from 'react';
import axios from 'axios';

import {RunningServer} from './runningserver.js';

function MonitorTableAll(prop){
    const[MTableCluster,setMTableCluster] = useState([]);
    const[MTableNode,setMTableNode] = useState([]);
    const[MTablePod,setMTablePod] = useState([]);
    const[sharedClustername,setsharedClustername]= useState([]);
    const[MTablePV,setMTablePV] = useState([]);
    const[MTableSC,setMTableSC] = useState([]);
    const[MTableDeploy,setMTableDeploy] = useState([]);

    const [podInfoNamespace,setPodInfoNamespace]=useState('default');
    const [podInfoNamespaceList,setPodInfoNamespaceList]=useState(['']);

    const namespaceSelect = (e) => {
        setPodInfoNamespace(e.target.value);
    };

    useEffect(()=>{
        monitor_panel_loadCluster();
        // eslint-disable-next-line
    },[]);

    useEffect(() =>{
        if(sharedClustername[0]!==undefined){
            monitor_panel_clear();
            monitor_panel_clearPod();
            monitor_panel_clearPV();
            monitor_panel_clearSC();

            monitor_panel_load();
            monitor_panel_loadPod();
            monitor_panel_loadPV();
            monitor_panel_loadSC();
            monitor_panel_loadDeploy();
        }
        // eslint-disable-next-line
    },[sharedClustername]);

    useEffect(() => {
        if(sharedClustername[0]!==undefined){
            monitor_panel_clearPod();

            monitor_panel_loadPod();
        }
        // eslint-disable-next-line
    },[podInfoNamespace]);

    var update_list=[];
    function monitor_panel_loadCluster(){
        axios.get(process.env.REACT_APP_API+'/api/getListCluster').then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                var button_disabled=true;
                if(data[dataKey[i]][3]==="True"){
                    button_disabled=false;
                }
                update_list.push({
                                ClusterName:data[dataKey[i]][0],
                                MasterNodeIP:data[dataKey[i]][1],
                                Port:data[dataKey[i]][2],
                                TokenExist:data[dataKey[i]][3],
                                SearchButton:button_disabled
                });
            }
            setMTableCluster(update_list);
        }).catch(error => {
            console.log('MonitortablePod error',error);
        })
    }

    function searchNodePodInfo(clustername){
        setsharedClustername([clustername]);
        getPodNamespaceList(clustername);
    }

    var update_list2=[];
    function getPodNamespaceList(clustername){
        axios.get(process.env.REACT_APP_API+'/api/getPodNamespaceList/'+clustername).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list2=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list2.push(
                                    data[dataKey[i]][0]
                 );
            }
            setPodInfoNamespaceList(update_list2);
        }).catch(error => {
            console.log('PodnamespaceList error',error);
        });
    }

    function monitor_panel_load(){
        axios.get(process.env.REACT_APP_API+'/api/getListNodeAll/'+sharedClustername).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list.push({
                                    nodeIP:data[dataKey[i]][0],
                                    type:data[dataKey[i]][1],
                                    lastHeartbeat:data[dataKey[i]][2][0][0],
                                    lastTransition:data[dataKey[i]][2][0][1],
                                    message:data[dataKey[i]][2][0][2],
                                    status:data[dataKey[i]][2][0][3]
                 });
            }
            setMTableNode(update_list);
        }).catch(error => {
            console.log('Monitortable error',error);
        })
    }

    function monitor_panel_clear(){
        setMTableNode([]);
    }

    function monitor_panel_loadPod(){
        const data={
            "cluster":sharedClustername,
            "namespace":podInfoNamespace
        };
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/getListNamespacePod',datajson,config).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list.push({
                                    Hostname:data[dataKey[i]][0],
                                    Nodename:data[dataKey[i]][1],
                                    Podname:data[dataKey[i]][2],
                                    ServiceAccount:data[dataKey[i]][3],
                                    HostIP:data[dataKey[i]][4],
                                    PodIP:data[dataKey[i]][5],
                                    Phase:data[dataKey[i]][6],
                                    StartTime:data[dataKey[i]][7]
                 });
            }
            setMTablePod(update_list);
        }).catch(err => {
        })
    }

    function monitor_panel_clearPod(){
        setMTablePod([]);
    }

    function monitor_panel_loadPV(){
        axios.get(process.env.REACT_APP_API+'/api/getPV/'+sharedClustername).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list.push({
                                    PVName:data[dataKey[i]][0],
                                    PVNamespace:data[dataKey[i]][1],
                                    PVAccesmode:data[dataKey[i]][2],
                                    PVCapacity:data[dataKey[i]][3],
                                    PVVolumemode:data[dataKey[i]][4],
                                    PVLocalpath:data[dataKey[i]][5],
                                    PVPhase:data[dataKey[i]][6],
                                    PVCreateiontime:data[dataKey[i]][7],
                                    PVCName:data[dataKey[i]][8],
                                    PVCNamespace:data[dataKey[i]][9]
                 });
            }
            setMTablePV(update_list);
        }).catch(error => {
            console.log('MonitortablePod error',error);
        })
    }
    function monitor_panel_clearPV(){
        setMTablePV([]);
    }

    function monitor_panel_loadSC(){
        axios.get(process.env.REACT_APP_API+'/api/getStorageclass/'+sharedClustername).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list.push({
                                    SCName:data[dataKey[i]][0],
                                    SCNamespace:data[dataKey[i]][1],
                                    AllowVolumeExpansion:data[dataKey[i]][2],
                                    AllowedTopologies:data[dataKey[i]][3],
                                    Provisioner:data[dataKey[i]][4],
                                    ReclaimPolicy:data[dataKey[i]][5],
                                    VolumeBindingMode:data[dataKey[i]][6],
                                    SCCreationtime:data[dataKey[i]][7],
                 });
            }
            setMTableSC(update_list);
        }).catch(error => {
            console.log('MonitortablePod error',error);
        })
    }
    function monitor_panel_clearSC(){
        setMTableSC([]);
    }

    function monitor_panel_loadDeploy(){
        const data={
            "cluster":sharedClustername,
            "namespace":podInfoNamespace
        };
        const datajson=JSON.stringify(data);
        const config={"Content-Type": 'application/json'};
        axios.post(process.env.REACT_APP_API+'/api/getStatusDeploy',datajson,config).then(response => {
            var data=response['data'];
            var dataKey=Object.keys(data);
            update_list=[];
            for(var i=0;i<dataKey.length;i++){
                 update_list.push({
                                    Deployname:data[dataKey[i]][0],
                                    Collision:data[dataKey[i]][1],
                                    AvailableReplicas:data[dataKey[i]][2],
                                    ReadyReplicas:data[dataKey[i]][3],
                                    Replicas:data[dataKey[i]][4],
                 });
            }
            setMTableDeploy(update_list);
        }).catch(err => {
        })
    }

    return(
        <>
            <h3> Cluster Info </h3>
            <div className="MonitorTableMainWrapper">
                <div className="MonitorTableMainContent">
                    <table className="tableStyle">
                        <thead>
                            <tr>
                                <th className="thStyle">Cluster Name</th>
                                <th className="thStyle">MasterNode IP</th>
                                <th className="thStyle">Port</th>
                                <th className="thStyle">Token Exist</th>
                                <th className="thStyle">Search Node&Pod Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MTableCluster.map((user,index) => {
                                const {ClusterName,MasterNodeIP,Port,TokenExist,SearchButton}= user;
                                return(
                                    <tr key={index}>
                                        <td className="tdStyle">{ClusterName}</td>
                                        <td className="tdStyle">{MasterNodeIP}</td>
                                        <td className="tdStyle">{Port}</td>
                                        <td className="tdStyle">{TokenExist}</td>
                                        <td className="tdStyle"><button disabled={SearchButton} className="clusterInfoButton" onClick={() => {searchNodePodInfo(ClusterName)}}>Search</button></td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <RunningServer podinfo={MTablePod} clustername={sharedClustername} />

            <h3> Deployment </h3>
            <div className="MonitorTableMainWrapper">
                <div className="MonitorTableMainContent">
                    <table className="tableStyle">
                        <thead>
                            <tr>
                                <th className="thStyle">Deployment Name</th>
                                <th className="thStyle">Collision</th>
                                <th className="thStyle">Available Replicas</th>
                                <th className="thStyle">Ready Replicas</th>
                                <th className="thStyle">Replicas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MTableDeploy.map((user,index) => {
                                const {Deployname,Collision,AvailableReplicas,ReadyReplicas,Replicas}= user;
                                return(
                                    <tr key={index}>
                                        <td className="tdStyle">{Deployname}</td>
                                        <td className="tdStyle">{Collision}</td>
                                        <td className="tdStyle">{AvailableReplicas}</td>
                                        <td className="tdStyle">{ReadyReplicas}</td>
                                        <td className="tdStyle">{Replicas}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <h3> Node IP({sharedClustername})  </h3>
            <div className="MonitorTableMainWrapper">
                <div className="MonitorTableMainContent">
                    <table className="tableStyle">
                        <thead>
                            <tr>
                                <th className="thStyle">Node IP</th>
                                <th className="thStyle">Type</th>
                                <th className="thStyle">Last Heartbeat</th>
                                <th className="thStyle">Last Transition</th>
                                <th className="thStyle">message</th>
                                <th className="thStyle">status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MTableNode.map((user,index) => {
                                const {nodeIP,type,lastHeartbeat,lastTransition,message,status}= user;
                                return(
                                    <tr key={index}>
                                        <td className="tdStyle">{nodeIP}</td>
                                        <td className="tdStyle">{type}</td>
                                        <td className="tdStyle">{lastHeartbeat}</td>
                                        <td className="tdStyle">{lastTransition}</td>
                                        <td className="tdStyle">{message}</td>
                                        <td className="tdStyle">{status}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <h3> Pod Info ({sharedClustername},namespace={podInfoNamespace})</h3>
            <select onChange={namespaceSelect} value={podInfoNamespace}>
                {podInfoNamespaceList.map((item) => (
                                        <option value={item} key={item}>{item}</option>
                                    ))}
            </select><br />
            <div className="MonitorTableMainWrapper">
                <div className="MonitorTableMainContent">
                    <table className="tableStyle">
                        <thead>
                            <tr>

                                <th className="thStyle">Nodename</th>
                                <th className="thStyle">Podname</th>

                                <th className="thStyle">Host IP</th>
                                <th className="thStyle">Pod IP</th>
                                <th className="thStyle">Phase</th>
                                <th className="thStyle">StartTime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MTablePod.map((user,index) => {
                                const {Hostname,Nodename,Podname,ServiceAccount,HostIP,
                                PodIP,Phase,StartTime}= user;
                                return(
                                    <tr key={index}>

                                        <td className="tdStyle">{Nodename}</td>
                                        <td className="tdStyle">{Podname}</td>

                                        <td className="tdStyle">{HostIP}</td>
                                        <td className="tdStyle">{PodIP}</td>
                                        <td className="tdStyle">{Phase}</td>
                                        <td className="tdStyle">{StartTime}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <h3> PV Info({sharedClustername})</h3>
            <div className="MonitorTableMainWrapper">
                <div className="MonitorTableMainContent">
                    <table className="tableStyle">
                        <thead>
                            <tr>
                                <th className="thStyle">PV Name</th>
                                <th className="thStyle">PV Namespace</th>
                                <th className="thStyle">PV AccessMode</th>
                                <th className="thStyle">PV Capacity</th>
                                <th className="thStyle">PV Volumemode</th>
                                <th className="thStyle">PV Localpath</th>
                                <th className="thStyle">PV Phase</th>
                                <th className="thStyle">PV Createiontime</th>
                                <th className="thStyle">PV Claim Name</th>
                                <th className="thStyle">PV Claim Namespace</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MTablePV.map((user,index) => {
                                const {PVName,PVNamespace,PVAccesmode,PVCapacity,
                                PVVolumemode,PVLocalpath,PVPhase,PVCreateiontime,PVCName,
                                PVCNamespace}= user;
                                return(
                                    <tr key={index}>
                                        <td className="tdStyle">{PVName}</td>
                                        <td className="tdStyle">{PVNamespace}</td>
                                        <td className="tdStyle">{PVAccesmode}</td>
                                        <td className="tdStyle">{PVCapacity}</td>
                                        <td className="tdStyle">{PVVolumemode}</td>
                                        <td className="tdStyle">{PVLocalpath}</td>
                                        <td className="tdStyle">{PVPhase}</td>
                                        <td className="tdStyle">{PVCreateiontime}</td>
                                        <td className="tdStyle">{PVCName}</td>
                                        <td className="tdStyle">{PVCNamespace}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <h3> SC Info({sharedClustername})</h3>
            <div className="MonitorTableMainWrapper">
                <div className="MonitorTableMainContent">
                    <table className="tableStyle">
                        <thead>
                            <tr>
                                <th className="thStyle">SC Name</th>
                                <th className="thStyle">SC Namespace</th>
                                <th className="thStyle">AllowVolumeExpansion</th>
                                <th className="thStyle">AllowedTopologies</th>
                                <th className="thStyle">Provisioner</th>
                                <th className="thStyle">Reclaim Policy</th>
                                <th className="thStyle">Volume Binding Mode</th>
                                <th className="thStyle">Creationtime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MTableSC.map((user,index) => {
                                const {SCName,SCNamespace,AllowVolumeExpansion,AllowedTopologies,
                                Provisioner,ReclaimPolicy,VolumeBindingMode,SCCreationtime}= user;
                                return(
                                    <tr key={index}>
                                        <td className="tdStyle">{SCName}</td>
                                        <td className="tdStyle">{SCNamespace}</td>
                                        <td className="tdStyle">{AllowVolumeExpansion}</td>
                                        <td className="tdStyle">{AllowedTopologies}</td>
                                        <td className="tdStyle">{Provisioner}</td>
                                        <td className="tdStyle">{ReclaimPolicy}</td>
                                        <td className="tdStyle">{VolumeBindingMode}</td>
                                        <td className="tdStyle">{SCCreationtime}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export {MonitorTableAll}