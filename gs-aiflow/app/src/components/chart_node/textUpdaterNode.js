import { useCallback, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

function TextUpdaterNode({ id, data, isConnectable }) {
  const statPrefix = "success-btn--"
  const statPostfix = "_layout"
  const [stat, setStat] = useState("waiting")

  useEffect(() => {
    setStatus(data.status)
  }, [data]);
  
  const setStatus = (status) => {
    if (status == 'Pending') {
      setStat("Pending")
    }
    else if (status == 'Succeeded') {
      setStat("Succeeded")
    }
    else if (status == 'Failed') {
      setStat("Failed")
    }
    else if (status == 'Running') {
      setStat("Running")
    }
    else {
      setStat("Waiting")
    }
  }
  return (
    <div className="text-updater-node">
      <div>
        <label htmlFor="text">{data.type}</label>
        <label htmlFor='text'>{id}</label>
      </div>
      <div>
        <span className='loading-btn-wrapper'>
          <button className={statPrefix + stat + statPostfix}>
            <span className="success-btn__text">
              {stat}
            </span>
          </button>
        </span>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="d"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="c"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
