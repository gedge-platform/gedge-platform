import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class chartapex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series:[{name:"High - 2018",data:[26,24,32,36,33,31,33]},{name:"Low - 2018",data:[14,11,16,12,17,13,12]}],
            options:{chart:{zoom:{enabled:!1},toolbar:{show:!1}},colors:["#556ee6","#34c38f"],dataLabels:{enabled:!0},stroke:{width:[3,3],curve:"straight"},title:{text:"Average High & Low Temperature",align:"left", style:{ fontWeight : "normal", fill : "#373d3f", opacity : 1}},grid:{row:{colors:["transparent","transparent"],opacity:.2},borderColor:"#f1f1f1"},markers:{style:"inverted",size:6},xaxis:{categories:["Jan","Feb","Mar","Apr","May","Jun","Jul"],title:{text:"Month"}},yaxis:{title:{text:"Temperature"},min:5,max:40},legend:{position:"top",horizontalAlign:"right",floating:!0,offsetY:-25,offsetX:-5},responsive:[{breakpoint:600,options:{chart:{toolbar:{show:!1}},legend:{show:!1}}}]}
        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.options} series={this.state.series} type="line" height="380" />
            </React.Fragment>

        );
    }
}

export default chartapex;