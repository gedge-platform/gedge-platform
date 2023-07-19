import React from 'react';

import {MonitorTableAll} from './monitor_table_all'

function Monitor(props) {
    return (
		<>
		    <div id='monitor_main'>
		        <h1>MonitorPage</h1>
		        <div className='monitor_object'>
		            <MonitorTableAll />
		        </div>
            </div>
		</>
    );
}

export {Monitor};