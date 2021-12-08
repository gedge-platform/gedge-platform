import React, { Component } from "react";

import {
    Button, Popover, PopoverHeader, PopoverBody, Tooltip, Badge,
    Col, Row, Card, CardBody, UncontrolledPopover ,Container, Pagination, PaginationItem, PaginationLink, Spinner 
} from 'reactstrap';


//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {  // Popover
            breadcrumbItems : [
                { title : "UI Elements", link : "#" },
                { title : "General", link : "#" },
            ],
            popovertop: false,
            popoverleft: false,
            popoverright: false,
            popoverbottom: false,
        };
        this.toggletop = this.toggletop.bind(this);
        this.toggleright = this.toggleright.bind(this);
        this.toggleleft = this.toggleleft.bind(this);
        this.togglebottom = this.togglebottom.bind(this);
        this.toggledismiss = this.toggledismiss.bind(this);
        this.toggledismissclose = this.toggledismissclose.bind(this);
    }
    toggletop() { this.setState({ popovertop: !this.state.popovertop }); }
    toggleleft() { this.setState({ popoverleft: !this.state.popoverleft }); }
    toggleright() { this.setState({ popoverright: !this.state.popoverright }); }
    togglebottom() { this.setState({ popoverbottom: !this.state.popoverbottom }); }
    toggledismiss() { this.setState({ popoverdismiss: !this.state.popoverdismiss }); }
    toggledismissclose() { this.setState({ popoverdismiss: false }); }


    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="General" breadcrumbItems={this.state.breadcrumbItems} />
                    <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col lg={6}>
                                                <div>
                                                    <h4 className="card-title">Badges</h4>
                                                    <p className="card-title-desc">Add any of the below mentioned modifier classes to change the appearance of a badge.</p>
                                                    <div>
                                                        <Badge color="primary" className="mr-1">Primary</Badge>
                                                        <Badge color="success" className="mr-1">Success</Badge>
                                                        <Badge color="info" className="mr-1">Info</Badge>
                                                        <Badge color="warning" className="mr-1">Warning</Badge>
                                                        <Badge color="danger" className="mr-1">Danger</Badge>
                                                        <Badge color="dark" className="mr-1">Dark</Badge>
                                                    </div>

                                                    <div className="mt-1">
                                                        <Badge className="badge-soft-primary mr-1">Primary</Badge>
                                                        <Badge className="badge-soft-success mr-1">Success</Badge>
                                                        <Badge className="badge-soft-info mr-1">Info</Badge>
                                                        <Badge className="badge-soft-warning mr-1">Warning</Badge>
                                                        <Badge className="badge-soft-danger mr-1">Danger</Badge>
                                                        <Badge className="badge-soft-dark mr-1">Dark</Badge>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={6}>
                                                <div className="mt-4 mt-lg-0">
                                                    <h4 className="card-title">Pill badges</h4>
                                                    <p className="card-title-desc">Use the <code>.badge-pill</code> modifier class to make
                                                    badges more rounded (with a larger <code>border-radius</code>
                                                    and additional horizontal <code>padding</code>).
                                                    Useful if you miss the badges from v3.</p>
        
                                                    <div>
                                                        <Badge color="primary" pill className="mr-1">Primary</Badge>
                                                        <Badge color="success" pill className="mr-1">Success</Badge>
                                                        <Badge color="info" pill className="mr-1">Info</Badge>
                                                        <Badge color="warning" pill className="mr-1">Warning</Badge>
                                                        <Badge color="danger" pill className="mr-1">Danger</Badge>
                                                        <Badge color="dark" pill className="mr-1">Dark</Badge>
                                                    </div>

                                                    <div className="mt-1">
                                                        <Badge pill className="badge-soft-primary mr-1">Primary</Badge>
                                                        <Badge pill className="badge-soft-success mr-1">Success</Badge>
                                                        <Badge pill className="badge-soft-info mr-1">Info</Badge>
                                                        <Badge pill className="badge-soft-warning mr-1">Warning</Badge>
                                                        <Badge pill className="badge-soft-danger mr-1">Danger</Badge>
                                                        <Badge pill className="badge-soft-dark mr-1">Dark</Badge>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                       
                                    </CardBody>
                                </Card>
                                
                            </Col>
                        </Row>
                       
        
                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Popovers</h4>
                                        <p className="card-title-desc">Add small overlay content, like those found in iOS, to any element for housing secondary information.</p>
        
                                        <div className="button-items">
                                            <Button type="button" color="light" id="Popovertop"  className="waves-effect mr-1" >
                                                Popover on top
                                            </Button>
                                            <Popover placement="top" isOpen={this.state.popovertop} target="Popovertop" toggle={this.toggletop}>
                                                <PopoverHeader>Popover Title</PopoverHeader>
                                                <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                                            </Popover>
            
                                            <Button type="button"  id="Popoverright"  color="light" className="waves-effect mr-1">
                                                Popover on right
                                            </Button>
                                            <Popover placement="right" isOpen={this.state.popoverright} target="Popoverright" toggle={this.toggleright}>
                                                <PopoverHeader>Popover Title</PopoverHeader>
                                                <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                                            </Popover>
            
                                            <Button type="button" id="Popoverbottom" color="light" className="waves-effect mr-1">
                                                Popover on bottom
                                            </Button>
                                            <Popover placement="bottom" isOpen={this.state.popoverbottom} target="Popoverbottom" toggle={this.togglebottom}>
                                                <PopoverHeader>Popover Title</PopoverHeader>
                                                <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                                            </Popover> 
            
                                            <Button type="button"  id="Popoverleft" color="light" className="waves-effect mr-1">
                                                Popover on left
                                            </Button>
                                            <Popover placement="left" isOpen={this.state.popoverleft} target="Popoverleft" toggle={this.toggleleft}>
                                                <PopoverHeader>Popover Title</PopoverHeader>
                                                <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                                            </Popover>
            
                                            <Button type="button" color="success" id="popover5" className="waves-effect waves-light">Dismissible popover</Button>
                                            <UncontrolledPopover trigger="focus" target="popover5" placement="right">
                                                <PopoverHeader>
                                                    Dismissible popover
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    Vivamus sagittis lacus vel augue laoreet rutrum faucibus
                                                </PopoverBody>
                                            </UncontrolledPopover>
                                        </div>
        
                                    </CardBody>
                                </Card>
        
                            </Col>
        
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Tooltips</h4>
                                        <p className="card-title-desc">Hover over the links below to see tooltips:</p>
        
                                        <div className="button-items">
                                            <Tooltip placement="top" isOpen={this.state.tttop} target="TooltipTop" toggle={() => this.setState({ tttop: !this.state.tttop })}>Hello world!</Tooltip>
                                            <Tooltip placement="right" isOpen={this.state.ttright} target="TooltipRight" toggle={() => this.setState({ ttright: !this.state.ttright })}>Hello world!</Tooltip>
                                            <Tooltip placement="bottom" isOpen={this.state.ttbottom} target="TooltipBottom" toggle={() => this.setState({ ttbottom: !this.state.ttbottom })}>Hello world!</Tooltip>
                                            <Tooltip placement="left" isOpen={this.state.ttleft} target="TooltipLeft" toggle={() => this.setState({ ttleft: !this.state.ttleft })}>Hello world!</Tooltip>

                                            <Button type="button" color="primary" className="mr-1" id="TooltipTop"> Tooltip on top</Button>
                                            <Button type="button" color="primary" className="mr-1" id="TooltipRight"> Tooltip on Right</Button>
                                            <Button type="button" color="primary" className="mr-1" id="TooltipBottom"> Tooltip on Bottom</Button>
                                            <Button type="button" color="primary" className="mr-1" id="TooltipLeft"> Tooltip on Left</Button>
                                            
                                        </div>
                                        
                                    </CardBody>
                                </Card>
        
                            </Col>
                        </Row>
                       
        
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title mb-4">Pagination</h4>
        
                                        <Row>
                                            <Col lg={6}>
                                                <h5 className="font-size-14">Default Example</h5>
                                                <p className="card-title-desc">Pagination links indicate a series of related content exists across multiple pages.</p>
        
                                                
                                                    <Pagination aria-label="Page navigation example">
                                                        <PaginationItem><PaginationLink href="#">Previous</PaginationLink></PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">Next</PaginationLink></PaginationItem>
                                                    </Pagination>
                                                
                
                                                
                                                    <Pagination aria-label="Page navigation example">
                                                        <PaginationItem>
                                                            <PaginationLink href="#" previous>
                                                                <i className="mdi mdi-chevron-left"></i>
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink next>
                                                                <i className="mdi mdi-chevron-right"></i>
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    </Pagination>
                                                
            
                                            </Col>
        
                                            <Col lg={6}>
                                                <div className="mt-4 mt-lg-0">
                                                    <h5 className="font-size-14">Disabled and active states</h5>
                                                    <p className="card-title-desc">Pagination links are customizable for
                                                            different circumstances. Use <code>.disabled</code> for links that appear
                                                            un-clickable and <code>.active</code> to
                                                            indicate the current page.</p>
                
            
                                                    
                                                        <Pagination aria-label="Page navigation example">
                                                            <PaginationItem disabled>
                                                                <PaginationLink href="#" tabIndex="-1">Previous</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                            <PaginationItem active>
                                                                <PaginationLink href="#">2 <span className="sr-only">(current)</span></PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#">Next</PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                    
                                                    
                                                        <Pagination aria-label="Page navigation example">
                                                            <PaginationItem disabled>
                                                                <PaginationLink><i className="mdi mdi-chevron-left"></i></PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                            <PaginationItem active>
                                                                <PaginationLink>
                                                                    2
                                                                    <span className="sr-only">(current)</span>
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#"><i className="mdi mdi-chevron-right"></i></PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                                                </div>
                                            </Col>
                                        </Row>
                                       
        
                                        <Row>
                                            <Col lg={6}>
                                                <div className="mt-4">
                                                    <h5 className="font-size-14">Sizing</h5>
                                                    <p className="card-title-desc">Fancy larger or smaller pagination? Add <code>.pagination-lg</code> or <code>.pagination-sm</code> for additional
                                                            sizes.</p>
                
                                                    
                                                        <Pagination size="lg" aria-label="Page navigation example">
                                                            <PaginationItem disabled>
                                                                <PaginationLink href="#" tabIndex="-1">Previous</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#">Next</PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                    
                                                    
                                                        <Pagination size="sm" aria-label="Page navigation example">
                                                            <PaginationItem disabled>
                                                                <PaginationLink href="#" tabIndex="-1">Previous</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#">Next</PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                                                </div>
                    
                                            </Col>
        
                                            <Col lg={6}>
                                                <div className="mt-4">
                                                    <h5 className="card-title">Alignment</h5>
                                                    <p className="card-title-desc">Change the alignment of pagination
                                                            components with flexbox utilities.</p>
                
                                                    
                                                        <Pagination aria-label="Page navigation example" listClassName="justify-content-center">
                                                            <PaginationItem disabled>
                                                                <PaginationLink href="#" tabIndex="-1">Previous</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#">Next</PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                    
                                                    
                                                        <Pagination aria-label="Page navigation example" listClassName="justify-content-end">
                                                            <PaginationItem disabled>
                                                                <PaginationLink href="#" tabIndex="-1">Previous</PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                                                            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink href="#">Next</PaginationLink>
                                                            </PaginationItem>
                                                        </Pagination>
                                                    
                                                </div>
                                            </Col>
                                        </Row>
                                       

                                        <Row className=" mt-4">
                                            <Col lg={6}>
                                                <h5 className="font-size-14">Rounded Example</h5>
                                                <p className="card-title-desc">Add <code>.pagination-rounded</code> for rounded pagination.</p>
        
                                                
                                                    <Pagination aria-label="Page navigation example" className="pagination-rounded">
                                                        <PaginationItem disabled>
                                                            <PaginationLink href="#" tabIndex="-1">Previous</PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                        <PaginationItem active>
                                                            <PaginationLink href="#">2 <span className="sr-only">(current)</span></PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#">Next</PaginationLink>
                                                        </PaginationItem>
                                                    </Pagination>
                
                                                
                                                    <Pagination aria-label="Page navigation example" className="pagination-rounded">
                                                        <PaginationItem disabled>
                                                            <span className="page-link"><i className="mdi mdi-chevron-left"></i></span>
                                                        </PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                                        <PaginationItem active>
                                                            <span className="page-link">
                                                                2
                                                                <span className="sr-only">(current)</span>
                                                            </span>
                                                        </PaginationItem>
                                                        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#"><i className="mdi mdi-chevron-right"></i></PaginationLink>
                                                        </PaginationItem>
                                                    </Pagination>
                                            </Col> 
                                        </Row>
                                       
                                    </CardBody>
                                </Card>
                                
                            </Col>
                        </Row>
                       
        
                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Border spinner</h4>
                                        <p className="card-title-desc">Use the border spinners for a lightweight loading indicator.</p>
                                        <div>
                                        <Spinner className="mr-2" color="primary" />
                                        <Spinner className="mr-2" color="secondary" />
                                        <Spinner className="mr-2" color="success" />
                                        <Spinner className="mr-2" color="danger" />
                                        <Spinner className="mr-2" color="warning" />
                                        <Spinner className="mr-2" color="info" />
                                        <Spinner className="mr-2" color="light" />
                                        <Spinner className="mr-2" color="dark" />
                                        </div>
        
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title">Growing spinner</h4>
                                        <p className="card-title-desc">If you don’t fancy a border spinner, switch to the grow spinner. While it doesn’t technically spin, it does repeatedly grow!</p>
                                        <div>
                                        <Spinner type="grow" className="mr-2" color="primary" />
                                        <Spinner type="grow" className="mr-2" color="secondary" />
                                        <Spinner type="grow" className="mr-2" color="success" />
                                        <Spinner type="grow" className="mr-2" color="danger" />
                                        <Spinner type="grow" className="mr-2" color="warning" />
                                        <Spinner type="grow" className="mr-2" color="info" />
                                        <Spinner type="grow" className="mr-2" color="light" />
                                        <Spinner type="grow" className="mr-2" color="dark" />
                                        </div>
        
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
}

export default UiGeneral;
