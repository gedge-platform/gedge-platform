import React, { Component } from "react";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Row, Col, Card, CardBody,Container } from 'reactstrap';

// Rating Plugin
import Rating from "react-rating";
import RatingTooltip from "react-rating-tooltip";

class UiRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems : [
        { title : "UI Elements", link : "#" },
        { title : "Rating", link : "#" },
    ],
      tooltipContent: ["Rate 1", "Rate 2", "Rate 3", "Rate 4", "Rate 5"],
      tooltipContentMore: ["1", "2", "3", "4", "5", "6", "7", "8"],
      tooltipContentHalf: ["6", "7", "8", "9", "10"],
      tooltipContentMiddle: [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      tooltipContentStep: ["2", "4", "6", "8", "10"],
      default: "",
      half: "",
      customize: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>

          <Breadcrumbs title="Rating" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>

                    <Row>
                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Default rating</h5>
                          <RatingTooltip
                            max={5}
                            onChange={rate => this.setState({ default: rate })}
                            ActiveComponent={
                              <i
                                key={"active_1"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_01"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />{" "}
                          <span>{this.state.default}</span>
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Disabled rating</h5>
                          <Rating
                            ActiveComponent={
                              <i
                                key={"active_2"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_02"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                            readonly={true}
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">
                            Readonly rating with a value
                        </h5>
                          <Rating
                            ActiveComponent={
                              <i
                                key={"active_3"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_03"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                            readonly={true}
                            initialRating={3}
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">
                            Customized heart rating
                        </h5>
                          <RatingTooltip
                            max={5}
                            onChange={rate => this.setState({ customize: rate })}
                            ActiveComponent={
                              <i
                                key={"active_4"}
                                className="mdi mdi-heart text-danger"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_04"}
                                className="mdi mdi-heart-outline text-danger"
                                style={this.state.starStyle}
                              />
                            }
                          />
                          <span>{this.state.customize}</span>
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Handle events</h5>
                          <Rating
                            onChange={rate => alert("Rating : " + rate)}
                            ActiveComponent={
                              <i
                                key={"active_5"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_05"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Customize tooltips</h5>
                          <RatingTooltip
                            max={5}
                            tooltipContent={this.state.tooltipContent}
                            ActiveComponent={
                              <i
                                key={"active_6"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_06"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Default rating</h5>
                          <RatingTooltip
                            max={8}
                            tooltipContent={this.state.tooltipContentMore}
                            ActiveComponent={
                              <i
                                key={"active_7"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_07"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">
                            Set start rate to 5 [6..10]
                        </h5>
                          <RatingTooltip
                            max={5}
                            tooltipContent={this.state.tooltipContentHalf}
                            ActiveComponent={
                              <i
                                key={"active_8"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_08"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">
                            Set start and stop rate [2..10]
                        </h5>
                          <RatingTooltip
                            max={11}
                            tooltipContent={this.state.tooltipContentMiddle}
                            ActiveComponent={
                              <i
                                key={"active_9"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_09"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">
                            Set start and stop rate [2..10] with step 2
                        </h5>
                          <RatingTooltip
                            max={5}
                            tooltipContent={this.state.tooltipContentStep}
                            ActiveComponent={
                              <i
                                key={"active_10"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_11"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Custom icons</h5>
                          <Rating
                            stop={5}
                            emptySymbol="mdi mdi-battery-outline fa-2x text-muted"
                            fullSymbol={[
                              "mdi mdi-battery-20 fa-2x text-primary",
                              "mdi mdi-battery-50 fa-2x text-primary",
                              "mdi mdi-battery-70 fa-2x text-primary",
                              "mdi mdi-battery-90 fa-2x text-primary"
                            ]}
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Fractional rating</h5>
                          <Rating
                            ActiveComponent={
                              <i
                                key={"active_11"}
                                className="mdi mdi-star text-primary"
                                style={this.state.starStyle}
                              />
                            }
                            InActiveComponent={
                              <i
                                key={"active_11"}
                                className="mdi mdi-star-outline text-muted"
                                style={this.state.starStyle}
                              />
                            }
                            fractions={6}
                          />
                        </div>
                      </Col>

                      <Col xl="3" md="4" sm="6">
                        <div className="p-4 text-center">
                          <h5 className="font-16 m-b-15">Custom CSS icons</h5>
                          <Rating fractions={2} />
                        </div>
                      </Col>
                    </Row>{" "}
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

export default UiRating;
