import React, { Component } from 'react';
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class StarterPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Utility", link : "#" },
                { title : "Starter Page", link : "#" },
            ],
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Starter Page" breadcrumbItems={this.state.breadcrumbItems} />
                    
                    </Container> 
                </div>
            </React.Fragment>
        );
    }
}

export default StarterPage;