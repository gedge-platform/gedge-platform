import React from 'react';
import { Row, Col, Button } from "antd";

function DagDefineSideBar ()  {
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <aside>
        <Row gutter={[0,16]}>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'Pod')} draggable>Pod</Button>
                </Col>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'Job')} draggable>Job</Button>
                </Col>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'CronJob')} draggable>CronJob</Button>
                </Col>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'Deployment')} draggable>Deployment</Button>
                </Col>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'StatefulSet')} draggable>Stateful Set</Button>
                </Col>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'DaemonSet')} draggable>Daemon Set</Button>
                </Col>
                <Col span={24}>
                    <Button style={{width:'100%'}} onDragStart={(event) => onDragStart(event, 'Service')} draggable>Service</Button>
                </Col>
            </Row>
      </aside>
    );
  };

export {DagDefineSideBar};