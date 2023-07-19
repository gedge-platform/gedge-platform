import axios from "axios";
import React, {useEffect, useRef, useState} from "react";

const NodeInfo = ({
    setValue,
    nodeData
}) => {

  const textarea = useRef();
  const handleResizeHeight = () => {
    nodeData.data.yaml = textarea.current.value;
    textarea.current.style.height = 'auto';
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
  };  
  const [view, setView] = useState(false); 

    useEffect(() => {
      if(nodeData != null){
        var str = nodeData.data.yaml
        if(str === undefined || str == null){
          str = "";
        }
        textarea.current.value = str;
        handleResizeHeight();
      }
    },[nodeData])

    const onClickAddNode = () => {
        setValue(true);
        axios
            .get(
                process.env.REACT_APP_API + '/api/makeData' , {withCredentials:true}
            )
            .then(response => {
              console.log(response)
            })
            .catch(error => {
                console.log('PodnamespaceList error', error);
            });
    };

    return (
        <div id='node_info_wrapper'>
                <button
                    onClick={onClickAddNode}>추가</button>
                <div>
                <div id="drop_the_text">
                  <textarea id="unchanged_textarea" onChange={handleResizeHeight} ref={textarea}/>
                </div>
              
                </div>
        </div>
    );
};

export default NodeInfo;