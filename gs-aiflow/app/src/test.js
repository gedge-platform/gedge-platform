import React from 'react';
import {useState,useEffect,useCallback} from 'react';
import {ResponsiveNetwork} from '@nivo/network';
import {ResponsiveBar} from '@nivo/bar';

import {NivoData} from './nivodata.js';

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';


const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];


function Test(props) {
    const ENV_test=process.env.REACT_APP_TEST;
    const [data,setData] = useState();

    const handle = {
        barClick: (data: any) => {
            console.log(data);
        },

        legendClick: (data: any) => {
            console.log(data);
        },
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
    <>
        <button disabled={true || false}>disabled test</button>

        <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>

        {ENV_test}

        <div>
            <div id='rnetworktest'>
                <ResponsiveNetwork
                    data={{
                        nodes:[
                            {
                              "id": "Node 0",
                              "height": 1,
                              "size": 24,
                              "color": "rgb(97, 205, 187)"
                            },
                            {
                              "id": "Node 1",
                              "height": 1,
                              "size": 24,
                              "color": "rgb(97, 205, 187)"
                            }
                        ],
                        links: [
                            {
                                "source": "Node 0",
                                "target": "Node 1",
                                "distance": 80
                            }
                        ]
                    }}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    linkDistance={function(e){return e.distance}}
                    centeringStrength={0.3}
                    repulsivity={6}
                    nodeColor={function(e){return e.color}}
                    nodeBorderWidth={1}
                    nodeBorderColor={{ theme: 'background' }}
                    linkThickness={function(n){return 2+2*n.target.data.height}}
                    linkBlendMode="multiply"
                    motionConfig="wobbly"
                />
            </div>
            <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
            <ResponsiveBar
                data={[
                    { bottle: '365ml', cola: 1200, cidar: 1000, fanta: 1100 },
                    { bottle: '500ml', cola: 2200, cidar: 2000, fanta: 2100 },
                    { bottle: '1000ml', cola: 3200, cidar: 3000, fanta: 3100 },
                ]}

                keys={['cola', 'cidar', 'fanta']}
                indexBy="bottle"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}

                padding={0.3}
                colors={['olive', 'brown', 'orange']} // 커스터하여 사용할 때
                colorBy="id" // 색상을 keys 요소들에 각각 적용
                // colorBy="indexValue" // indexBy로 묵인 인덱스별로 각각 적용
                theme={{
                    labels: {
                        text: {
                            fontSize: 14,
                            fill: '#000000',
                        },
                    },
                    legends: {
                        text: {
                            fontSize: 12,
                            fill: '#000000',
                        },
                    },
                    axis: {
                        legend: {
                            text: {
                                fontSize: 20,
                                fill: '#000000',
                            },
                        },
                        ticks: {
                            text: {
                                fontSize: 16,
                                fill: '#000000',
                            },
                        },
                    },
                }}
                axisBottom={{
                    tickSize: 5, // 값 설명하기 위해 튀어나오는 점 크기
                    tickPadding: 5, // tick padding
                    tickRotation: 0, // tick 기울기
                    legend: 'bottle', // bottom 글씨
                    legendPosition: 'middle', // 글씨 위치
                    legendOffset: 40, // 글씨와 chart간 간격
                }}
                axisLeft={{
                    tickSize: 5, // 값 설명하기 위해 튀어나오는 점 크기
                    tickPadding: 5, // tick padding
                    tickRotation: 0, // tick 기울기
                    legend: 'price', // left 글씨
                    legendPosition: 'middle', // 글씨 위치
                    legendOffset: -60, // 글씨와 chart간 간격
                }}
                labelSkipWidth={36}
                labelSkipHeight={12}
                onClick={handle.barClick}
                legends={[
                    {
                        dataFrom: 'keys', // 보일 데이터 형태
                        anchor: 'bottom-right', // 위치
                        direction: 'column', // item 그려지는 방향
                        justify: false, // 글씨, 색상간 간격 justify 적용 여부
                        translateX: 120, // chart와 X 간격
                        translateY: 0, // chart와 Y 간격
                        itemsSpacing: 2, // item간 간격
                        itemWidth: 100, // item width
                        itemHeight: 20, // item height
                        itemDirection: 'left-to-right', // item 내부에 그려지는 방향
                        itemOpacity: 0.85, // item opacity
                        symbolSize: 20,
                        effects: [
                            {
                                // 추가 효과 설정 (hover하면 item opacity 1로 변경)
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                        onClick: handle.legendClick, // legend 클릭 이벤트
                    },
                ]}
            />
        </div>
        </div>
    </>
    );
}

export {Test};