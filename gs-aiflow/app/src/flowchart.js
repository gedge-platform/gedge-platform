import React from "react";
import {useState,useEffect} from 'react';

import 'beautiful-react-diagrams/styles.css';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';


function Flowchart(props){
    const [schema, setSchema] = useState();
    const [timeout_id,setTimeout_id] = useState('');

    const getData= async (name)=>{
        const file=await require('./yamldirexplain/'+name+'.json')
        const fileschema=createSchema(file);
        setSchema(fileschema);
    }

    useEffect(()=>{
        beforeUnload();
    },[])

    useEffect(()=>{
        if(props.value==='null'){
        }else{
            getData(props.value);
        }
    },[props.value])

    const colorchange= (e) => {
        const element2= document.getElementsByClassName("bi-diagram-canvas")[0];
        var change_element;
        for(var i=0;i<element2.children.length - 1;i++){
            console.log(element2.children[i].classList[3])
            for(var j=0;j<props.podinfo.length;j++){
                console.log(props.podinfo[j].Podname);
                console.log(props.podinfo[j].Phase);
                if(props.podinfo[j].Phase==='Running' && element2.children[i].classList[3] === props.podinfo[j].Podname){
                    change_element= document.getElementsByClassName(element2.children[i].classList[3])[0];
                    change_element.style.backgroundColor='rgb(127, 255, 127)';
                }else if(props.podinfo[j].Phase==='Terminating' && element2.children[i].classList[3] === props.podinfo[j].Podname){
                    change_element= document.getElementsByClassName(element2.children[i].classList[3])[0];
                    change_element.style.backgroundColor='rgb(255, 127, 127)';
                }
            }
        }
    }

    const refresh10 = (e) =>{
        const sTid=setTimeout(()=> {refresh10();colorchange()},10000);
        setTimeout_id(sTid);
    }
    const refreshstop = (e) => {
        clearTimeout(timeout_id);
    }

    function beforeUnload(){
        window.addEventListener('beforeunload',function(e){
            e.preventDefault();
            refreshstop();
        })
    }

    return(
        <>
        <div>
            <button onClick={colorchange}>update once</button>
            <button onClick={refresh10}>update 10sec</button>
            <button onClick={refreshstop}>update stop</button>
        </div>
        <div id='flowchart'>
            <Diagram schema={schema} />
        </div>
        </>
    )
}

export {Flowchart}