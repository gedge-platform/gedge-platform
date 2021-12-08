import React, { Component } from 'react';
import { Container, Card, CardBody, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class DripiIcons extends Component {
    constructor(props) {
        super(props);
        this.state={
            breadcrumbItems : [
                { title : "Icons", link : "#" },
                { title : "Dripicons", link : "#" },
            ],
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Dripicons" breadcrumbItems={this.state.breadcrumbItems} />
                        
                        <Row>
                            <Col xs={12}>
                                <Card>
                                    <CardBody>
        
                                        <h4 className="card-title">Examples</h4>
                                        <p className="card-title-desc mb-2">Use <code>&lt;i
                                            class="dripicons-alarm"&gt;&lt;/i&gt;</code>.
                                        </p>
        
                                        <Row className="icon-demo-content">
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-alarm"></i> dripicons-alarm
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-align-center"></i> dripicons-align-center
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-align-justify"></i> dripicons-align-justify
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-align-left"></i> dripicons-align-left
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-align-right"></i> dripicons-align-right
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-anchor"></i> dripicons-anchor
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-archive"></i> dripicons-archive
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-down"></i> dripicons-arrow-down
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-left"></i> dripicons-arrow-left
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-right"></i> dripicons-arrow-right
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-thin-down"></i> dripicons-arrow-thin-down
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-thin-left"></i> dripicons-arrow-thin-left
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-thin-right"></i> dripicons-arrow-thin-right
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-thin-up"></i> dripicons-arrow-thin-up
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-arrow-up"></i> dripicons-arrow-up
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className=" dripicons-article"></i> dripicons-article
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-backspace"></i> dripicons-backspace
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-basket"></i> dripicons-basket
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-basketball"></i> dripicons-basketball
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-battery-empty"></i> dripicons-battery-empty
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-battery-full"></i> dripicons-battery-full
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-battery-low"></i> dripicons-battery-low
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-battery-medium"></i> dripicons-battery-medium
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-bell"></i> dripicons-bell
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-blog"></i> dripicons-blog
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-bluetooth"></i> dripicons-bluetooth
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-bold"></i> dripicons-bold
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-bookmark"></i> dripicons-bookmark
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-bookmarks"></i> dripicons-bookmarks
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-box"></i> dripicons-box
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-briefcase"></i> dripicons-briefcase
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-brightness-low"></i> dripicons-brightness-low
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-brightness-max"></i> dripicons-brightness-max
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-brightness-medium"></i> dripicons-brightness-medium
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-broadcast"></i> dripicons-broadcast
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-browser"></i> dripicons-browser
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-browser-upload"></i> dripicons-browser-upload
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-brush"></i> dripicons-brush
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-calendar"></i> dripicons-calendar
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-camcorder"></i> dripicons-camcorder
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-camera"></i> dripicons-camera
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-card"></i> dripicons-card
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-cart"></i> dripicons-cart
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-checklist"></i> dripicons-checklist
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-checkmark"></i> dripicons-checkmark
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-chevron-down"></i> dripicons-chevron-down
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-chevron-left"></i> dripicons-chevron-left
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-chevron-right"></i> dripicons-chevron-right
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-chevron-up"></i> dripicons-chevron-up
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-clipboard"></i> dripicons-clipboard
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-clock"></i> dripicons-clock
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-clockwise"></i> dripicons-clockwise
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-cloud"></i> dripicons-cloud
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-cloud-download"></i> dripicons-cloud-download
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-cloud-upload"></i> dripicons-cloud-upload
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-code"></i> dripicons-code
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-contract"></i> dripicons-contract
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-contract-2"></i> dripicons-contract-2
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-conversation"></i> dripicons-conversation
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-copy"></i> dripicons-copy
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-crop"></i> dripicons-crop
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-cross"></i> dripicons-cross
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-crosshair"></i> dripicons-crosshair
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-cutlery"></i> dripicons-cutlery
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-device-desktop"></i> dripicons-device-desktop
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-device-mobile"></i> dripicons-device-mobile
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-device-tablet"></i> dripicons-device-tablet
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-direction"></i> dripicons-direction
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-disc"></i> dripicons-disc
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-document"></i> dripicons-document
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-document-delete"></i> dripicons-document-delete
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-document-edit"></i> dripicons-document-edit
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-document-new"></i> dripicons-document-new
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-document-remove"></i> dripicons-document-remove
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-dot"></i> dripicons-dot
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-dots-2"></i> dripicons-dots-2
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-dots-3"></i> dripicons-dots-3
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-download"></i> dripicons-download
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-duplicate"></i> dripicons-duplicate
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-enter"></i> dripicons-enter
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-exit"></i> dripicons-exit
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-expand"></i> dripicons-expand
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-expand-2"></i> dripicons-expand-2
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-experiment"></i> dripicons-experiment
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-export"></i> dripicons-export
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-feed"></i> dripicons-feed
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-flag"></i> dripicons-flag
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-flashlight"></i> dripicons-flashlight
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-folder"></i> dripicons-folder
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-folder-open"></i> dripicons-folder-open
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-forward"></i> dripicons-forward
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-gaming"></i> dripicons-gaming
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-gear"></i> dripicons-gear
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-graduation"></i> dripicons-graduation
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-graph-bar"></i> dripicons-graph-bar
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-graph-line"></i> dripicons-graph-line
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-graph-pie"></i> dripicons-graph-pie
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-headset"></i> dripicons-headset
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-heart"></i> dripicons-heart
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-help"></i> dripicons-help
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-home"></i> dripicons-home
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-hourglass"></i> dripicons-hourglass
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-inbox"></i> dripicons-inbox
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-information"></i> dripicons-information
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-italic"></i> dripicons-italic
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-jewel"></i> dripicons-jewel
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-lifting"></i> dripicons-lifting
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-lightbulb"></i> dripicons-lightbulb
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-link"></i> dripicons-link
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-link-broken"></i> dripicons-link-broken
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-list"></i> dripicons-list
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-loading"></i> dripicons-loading
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-location"></i> dripicons-location
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-lock"></i> dripicons-lock
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-lock-open"></i> dripicons-lock-open
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-mail"></i> dripicons-mail
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-map"></i> dripicons-map
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-loop"></i> dripicons-media-loop
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-next"></i> dripicons-media-next
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-pause"></i> dripicons-media-pause
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-play"></i> dripicons-media-play
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-previous"></i> dripicons-media-previous
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-record"></i> dripicons-media-record
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-shuffle"></i> dripicons-media-shuffle
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-media-stop"></i> dripicons-media-stop
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-medical"></i> dripicons-medical
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-menu"></i> dripicons-menu
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-message"></i> dripicons-message
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-meter"></i> dripicons-meter
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-microphone"></i> dripicons-microphone
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-minus"></i> dripicons-minus
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-monitor"></i> dripicons-monitor
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-move"></i> dripicons-move
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-music"></i> dripicons-music
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-network-1"></i> dripicons-network-1
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-network-2"></i> dripicons-network-2
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-network-3"></i> dripicons-network-3
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-network-4"></i> dripicons-network-4
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-network-5"></i> dripicons-network-5
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-pamphlet"></i> dripicons-pamphlet
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-paperclip"></i> dripicons-paperclip
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-pencil"></i> dripicons-pencil
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-phone"></i> dripicons-phone
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-photo"></i> dripicons-photo
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-photo-group"></i> dripicons-photo-group
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-pill"></i> dripicons-pill
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-pin"></i> dripicons-pin
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-plus"></i> dripicons-plus
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-power"></i> dripicons-power
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-preview"></i> dripicons-preview
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-print"></i> dripicons-print
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-pulse"></i> dripicons-pulse
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-question"></i> dripicons-question
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-reply"></i> dripicons-reply
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-reply-all"></i> dripicons-reply-all
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-return"></i> dripicons-return
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-retweet"></i> dripicons-retweet
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-rocket"></i> dripicons-rocket
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-scale"></i> dripicons-scale
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-search"></i> dripicons-search
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-shopping-bag"></i> dripicons-shopping-bag
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-skip"></i> dripicons-skip
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-stack"></i> dripicons-stack
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-star"></i> dripicons-star
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-stopwatch"></i> dripicons-stopwatch
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-store"></i> dripicons-store
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-suitcase"></i> dripicons-suitcase
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-swap"></i> dripicons-swap
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-tag"></i> dripicons-tag
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-tag-delete"></i> dripicons-tag-delete
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-tags"></i> dripicons-tags
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-thumbs-down"></i> dripicons-thumbs-down
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-thumbs-up"></i> dripicons-thumbs-up
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-ticket"></i> dripicons-ticket
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-time-reverse"></i> dripicons-time-reverse
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-to-do"></i> dripicons-to-do
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-toggles"></i> dripicons-toggles
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-trash"></i> dripicons-trash
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-trophy"></i> dripicons-trophy
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-upload"></i> dripicons-upload
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-user"></i> dripicons-user
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-user-group"></i> dripicons-user-group
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-user-id"></i> dripicons-user-id
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-vibrate"></i> dripicons-vibrate
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-view-apps"></i> dripicons-view-apps
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-view-list"></i> dripicons-view-list
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-view-list-large"></i> dripicons-view-list-large
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-view-thumb"></i> dripicons-view-thumb
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-volume-full"></i> dripicons-volume-full
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-volume-low"></i> dripicons-volume-low
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-volume-medium"></i> dripicons-volume-medium
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-volume-off"></i> dripicons-volume-off
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-wallet"></i> dripicons-wallet
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-warning"></i> dripicons-warning
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-web"></i> dripicons-web
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-weight"></i> dripicons-weight
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-wifi"></i> dripicons-wifi
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-wrong"></i> dripicons-wrong
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-zoom-in"></i> dripicons-zoom-in
                                            </Col>
                                            <Col xl={3} lg={4} sm={6}>
                                                <i className="dripicons-zoom-out"></i> dripicons-zoom-out
                                            </Col>
                                        </Row>
        
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

export default DripiIcons;