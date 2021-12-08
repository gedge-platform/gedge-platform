import React, { Component } from "react";

import "tui-chart/dist/tui-chart.css";
import { HeatMapChart } from "@toast-ui/react-chart";
import TuiChart from 'tui-chart';
import "./toastui.scss";

var theme = {
  chart: {
    background: {
      color: 'rgba(243, 243, 249, 0.05)',
      opacity: 0
    }
  }
};
TuiChart.registerTheme('skoteTheme', theme);

class HeatmapChartToast extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const data = {
            categories: {
                x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                y: ['Seoul', 'Seattle', 'Sydney', 'Moskva', 'Jungfrau']
            },
            series: [
                [-3.5, -1.1, 4.0, 11.3, 17.5, 21.5, 24.9, 25.2, 20.4, 13.9, 6.6, -0.6],
                [3.8, 5.6, 7.0, 9.1, 12.4, 15.3, 17.5, 17.8, 15.0, 10.6, 6.4, 3.7],
                [22.1, 22.0, 20.9, 18.3, 15.2, 12.8, 11.8, 13.0, 15.2, 17.6, 19.4, 21.2],
                [-10.3, -9.1, -4.1, 4.4, 12.2, 16.3, 18.5, 16.7, 10.9, 4.2, -2.0, -7.5],
                [-13.2, -13.7, -13.1, -10.3, -6.1, -3.2, 0.0, -0.1, -1.8, -4.5, -9.0, -10.9]
            ]
        };

        var options = {
            chart: {
                width: this.props.chartWidth,
                height: 450,
            },
            theme: 'skoteTheme',
            yAxis: {
                title: 'City'
            },
            xAxis: {
                title: 'Month'
            },
            series: {
                showLabel: true
            },
            tooltip: {
                suffix: '°C'
            }
        };
        var theme = {
            series: {
                startColor: '#ffefef',
                endColor: '#ac4142',
                overColor: '#75b5aa',
                borderColor: '#F4511E'
            }
        };

        return (
            <React.Fragment>
                <HeatMapChart data={data} options={options} theme={theme} />
            </React.Fragment>
        );
    }
}

export default HeatmapChartToast;
