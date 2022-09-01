import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';


const ClusterNode = () => {

    const expData = {
        // labels: ["긍정적", "부정적", "보통"],
        datasets: [
            {
                // labels: ["긍정적", "부정적", "보통"],
                data: [60, 40],
                borderWidth: 2,
                hoverBorderWidth: 3,
                backgroundColor: [
                    "rgba(50, 64, 179, 0.27)",
                    "rgba(50, 64, 145, 0.1)",
                ],
                fill: true
            }
        ]
    }


    return (
        <div>
            <div className="panelCont">
                <table className="tb_data">
                    <tbody>
                        <tr>
                            <th>클러스터 이름</th>
                            <td>hyper-leager</td>
                            <th>쿠버네티스 버전</th>
                            <td>1.22.2</td>

                        </tr>
                        <tr>
                            <th>역할</th>
                            <td>Master</td>
                            <th>등록일</th>
                            <td>2021.03.01</td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
                    <div style={{ display: "flex", width: "40%", backgroundColor: "#fcfcfe" }}>
                        <div>
                            <Doughnut
                                data={expData}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "50px" }}>
                            <div style={{ margin: "5px", fontSize: "16px" }}>CPU 사용량</div>
                            <div style={{ margin: "5px", fontSize: "14px" }}>0.63/8</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", width: "40%", backgroundColor: "#fcfcfe" }}>
                        <div>
                            <Doughnut
                                data={expData}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "50px" }}>
                            <div style={{ margin: "5px", fontSize: "16px" }}>Memory 사용량</div>
                            <div style={{ margin: "5px", fontSize: "14px" }}>0.63/8</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "30px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", width: "40%", backgroundColor: "#fcfcfe" }}>
                        <div>
                            <Doughnut
                                data={expData}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "50px" }}>
                            <div style={{ margin: "5px", fontSize: "16px" }}>Storage 사용량</div>
                            <div style={{ margin: "5px", fontSize: "14px" }}>0.63/8</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", width: "40%", backgroundColor: "#fcfcfe" }}>
                        <div>
                            <Doughnut
                                data={expData}
                                width={100}
                                height={100}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "50px" }}>
                            <div style={{ margin: "5px", fontSize: "16px" }}>Pod 사용량</div>
                            <div style={{ margin: "5px", fontSize: "14px" }}>0.63/8</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClusterNode