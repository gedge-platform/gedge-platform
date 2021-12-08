import React, { Component } from 'react';
import { Button, ButtonGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ButtonToolbar } from "reactstrap";

class EmailToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folder_menu: false,
            tag_menu: false,
            more_menu : false
        };
        this.toggleFolder = this.toggleFolder.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
        this.toggleMore = this.toggleMore.bind(this);
    }

    toggleFolder() {
        this.setState(prevState => ({
            folder_menu: !prevState.folder_menu
        }));
    }

    toggleTag() {
        this.setState(prevState => ({
            tag_menu: !prevState.tag_menu
        }));
    }
    
    toggleMore() {
        this.setState(prevState => ({
            more_menu: !prevState.more_menu
        }));
    }

    render() {
        return (
            <React.Fragment>
                                    <ButtonToolbar className="p-3" role="toolbar">
                                        <ButtonGroup className="mr-2 mb-2 mb-sm-0">
                                            <Button type="button" color="primary" className=" waves-light waves-effect"><i className="fa fa-inbox"></i></Button>
                                            <Button type="button" color="primary" className="waves-light waves-effect"><i className="fa fa-exclamation-circle"></i></Button>
                                            <Button type="button" color="primary" className="waves-light waves-effect"><i className="far fa-trash-alt"></i></Button>
                                        </ButtonGroup>
                                        <ButtonGroup className="mr-2 mb-2 mb-sm-0">
                                        <Dropdown isOpen={this.state.folder_menu} toggle={this.toggleFolder}>
                                            <DropdownToggle tag="button" type="button" caret className="btn btn-primary waves-light waves-effect dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-folder mr-1"></i>
                                                <i className="mdi mdi-chevron-down ml-1"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem tag="a" href="#">Updates</DropdownItem>
                                                <DropdownItem tag="a" href="#">Social</DropdownItem>
                                                <DropdownItem tag="a" href="#">Team Manage</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        </ButtonGroup>
                                        <ButtonGroup className="mr-2 mb-2 mb-sm-0">
                                        <Dropdown isOpen={this.state.tag_menu} toggle={this.toggleTag}>
                                            <DropdownToggle tag="button" className="btn btn-primary waves-light waves-effect dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-tag mr-1"></i>
                                                <i className="mdi mdi-chevron-down ml-1"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem tag="a" href="#">Updates</DropdownItem>
                                                <DropdownItem tag="a" href="#">Social</DropdownItem>
                                                <DropdownItem tag="a" href="#">Team Manage</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        </ButtonGroup>

                                        <ButtonGroup className="mr-2 mb-2 mb-sm-0">
                                        <Dropdown isOpen={this.state.more_menu} toggle={this.toggleMore}>
                                            <DropdownToggle tag="button" className="btn btn-primary waves-light waves-effect dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                More <i className="mdi mdi-dots-vertical ml-2"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem tag="a" href="#">Mark as Unread</DropdownItem>
                                                <DropdownItem tag="a" href="#">Mark as Important</DropdownItem>
                                                <DropdownItem tag="a" href="#">Add to Tasks</DropdownItem>
                                                <DropdownItem tag="a" href="#">Add Star</DropdownItem>
                                                <DropdownItem tag="a" href="#">Mute</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        </ButtonGroup>
                                    </ButtonToolbar>
            </React.Fragment>
        );
    }
}

export default EmailToolBar;