import { React, useState, useRef, memo} from 'react';
import { APIGetPodLog, APIAdminGetPodLog } from 'utils/api';
import Terminal from 'react-console-emulator'
import { useQuery } from 'react-query';

const commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: (...args) => args.join(' ')
    }
  }


function LogModal (props)  {
    const projectID = props.projectID;
    const podName = props.podName;
    const [isFirst, setFirst] = useState(true);
    const terminal = useRef();
    const { isLoading, error, data, isFetching, refetch } = useQuery(
        ['editingDAG' + projectID + podName], () => {
            if (projectID == undefined) {
                return;
            }

            if (podName == undefined) {
                return;
            }

            if (props.isAdmin) {
                return APIAdminGetPodLog(props.userID, projectID, podName)
                    .then((res) => {

                        // terminal.current.clearStdout();
                        parseLog(res['data']);
                        return res['data'];
                    })
            }
            else {
                return APIGetPodLog(projectID, podName)
                    .then((res) => {

                        // terminal.current.clearStdout();
                        parseLog(res['data']);
                        return res['data'];
                    })
            }
        }, {
        refetchOnWindowFocus: false,
        refetchInterval: 2000,
        retry: 1,
    });

    function parseLog(data) {
        if (terminal.current) {
            //not support api
            const rootNode = terminal.current.terminalRoot.current;
            const isBottom = (rootNode.scrollTop + rootNode.clientHeight == rootNode.scrollHeight);
            terminal.current.state.stdout = [];
            for (let idx in data['data']) {
                terminal.current.pushToStdout(data['data'][idx].log);
            }

            if(isBottom || isFirst){
                setFirst(false);
                terminal.current.scrollToBottom();
            }

            // terminal.current.clearStdout();
        }
    }

    return (
        <Terminal
        ref={terminal}
          commands={commands}
          disabled= {true}
          welcomeMessage={''}
          promptLabel={''}
        />
      )
}


export default LogModal = memo(LogModal);