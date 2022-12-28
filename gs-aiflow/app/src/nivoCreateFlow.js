import React from 'react';
import {ResponsiveNetwork} from '@nivo/network';

function NivoCreateFlow(){

    return(
        <>
            <div id='divnivocreateflow'>
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
        </>
    )
}

export {NivoCreateFlow}