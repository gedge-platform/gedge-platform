import React, { useRef, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
// import 'xterm/css/xterm.css';

const MSG_INPUT = 1;
const MSG_RESIZE = 2;

export const TerminalUI = () => {
  // const [isExpanded, setIsExpanded] = useState(false);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const terminalContainerRef = useRef(null);

  const { getWebSocket, sendMessage, readyState } = useWebSocket(
    'ws://101.79.1.173:8077',
    {
      onOpen: () => {
        getWebSocket().binaryType = 'arraybuffer';

        sendMessage(
          new TextEncoder().encode(
            MSG_RESIZE +
            JSON.stringify({
              cols: termRef.current?.cols,
              rows: termRef.current?.rows,
            })
          )
        );
        termRef.current.focus();
      },
      onMessage: (v) => {
        termRef.current.write(new Uint8Array(v.data));
      },
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    termRef.current = new Terminal({
      cursorBlink: true,
    });

    fitAddonRef.current = new FitAddon();
    termRef.current.loadAddon(fitAddonRef.current);
    termRef.current.open(terminalContainerRef.current);
    fitAddonRef.current.fit();

    const textEncoder = new TextEncoder();
    termRef.current.onData((v) => {
      sendMessage(textEncoder.encode(MSG_INPUT + v));
    });
    termRef.current.onResize((dim) =>
      sendMessage(textEncoder.encode(MSG_RESIZE + JSON.stringify(dim)))
    );

    return () => {
      termRef.current.dispose();
    };
  }, []);

  // useEffect(() => {
  //   fitAddonRef.current?.fit();
  // }, [isExpanded]);

  // const styles = isExpanded
  //   ? { width: '100%', height: '100%' }
  //   : { width: '800px', height: '400px' };

  return (
    <div
    // style={{
    //   display: 'grid',
    //   gridTemplateRows: 'min-content auto 1fr',
    //   height: '100%',
    // }}
    >
      {/* <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button> */}
      <span>The WebSocket is currently {ReadyState[readyState]}</span>
      <div
        id="terminal-container"
        className="terminal"
        // style={styles}
        ref={terminalContainerRef}
      />
    </div>
  );
};
