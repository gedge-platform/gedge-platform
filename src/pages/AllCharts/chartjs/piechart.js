import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

class PieChart extends Component {

    render() {
        const data = {
            labels: [
                "Desktops",
                "Tablets"
            ],
            datasets: [
                {
                    data: [300, 180],
                    backgroundColor: [
                        "#34c38f",
                        "#ebeff2"
                    ],
                    hoverBackgroundColor: [
                        "#34c38f",
                        "#ebeff2"
                    ],
                    hoverBorderColor: "#fff"
                }]
        };

        return (
            <React.Fragment>
                <Pie width={474} height={260} data={data} />
            </React.Fragment>
        );
    }
}

export default PieChart;   