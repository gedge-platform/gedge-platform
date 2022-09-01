import React, { useEffect, useRef, useState } from "react";
import { Toastify } from "../../utils/common-utils";

const WebSocketContainer = (props) => {
  const [socketConnectd, setSocketConnected] = useState(false);

  const socketUrl = "ws://101.79.4.15:3111";
  let ws = useRef(null);

  const connect = () => {
    ws.current = new WebSocket(socketUrl);
    ws.current.onopen = () => {
      console.log("connect!!!");
      setSocketConnected(true);
    };
    ws.current.onclose = (e) => {
      console.log("disconnect!!" + e);
      setSocketConnected(false);
    };
    ws.current.onerror = (e) => {
      console.log("error!!" + e);
    };
    ws.current.onmessage = (evt) => {
      // const data = JSON.parse(evt.data);
      console.log(evt.data);
      Toastify(evt.data);
    };
  };

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(socketUrl);
      ws.current.onopen = () => {
        console.log("connect!!!");
        setSocketConnected(true);
      };
      ws.current.onclose = (e) => {
        console.log("disconnect!!" + e);
        setSocketConnected(false);
      };
      ws.current.onerror = (e) => {
        console.log("error!!" + e);
      };
      ws.current.onmessage = (evt) => {
        // const data = JSON.parse(evt.data);
        console.log(evt.data);
        Toastify(evt.data);
      };
    }
  }, []);

  useEffect(() => {
    if (!ws.current) connect();
  }, [socketConnectd]);

  return <>{props.children}</>;
};

export default WebSocketContainer;
