import React, { Component } from "react";
import { Form, Card, CardBody, Col, Row, CardTitle, CardSubtitle,Container } from "reactstrap";

// Form Editor
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class FormEditors extends Component {
  constructor(props) {
    super(props);
    this.state={
        breadcrumbItems : [
            { title : "Forms", link : "#" },
            { title : "Form Editors", link : "#" },
        ],
    }
}

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>

          <Breadcrumbs title="Form Editors" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <CardTitle>react-draft-wysiwyg</CardTitle>
                    <CardSubtitle className="mb-3">
                      Bootstrap-wysihtml5 is a javascript plugin that makes it
                      easy to create simple, beautiful wysiwyg editors with the
                      help of wysihtml5 and Twitter Bootstrap.
                    </CardSubtitle>

                    <Form method="post">
                      <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                      />
                    </Form>

                  </CardBody>
                </Card>
              </Col>
            </Row>

          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default FormEditors;
