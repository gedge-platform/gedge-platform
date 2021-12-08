import React, { Component } from 'react';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';

// Carousel images 
import img3 from '../../../assets/images/small/img-3.jpg';
import img4 from '../../../assets/images/small/img-4.jpg';
import img5 from '../../../assets/images/small/img-5.jpg';

const items = [
    {
        src: img3,
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        caption: 'First slide label',
    },
    {
        src: img4,
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        caption: 'Second slide label'
    },
    {
        src: img5,
        altText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        caption: 'Third slide label'
    }
];

class Slidewithcaption extends Component {

    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    render() {
        const { activeIndex } = this.state;

        const slides = items.map((item) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={item.src} >
                    <img src={item.src} className="d-block img-fluid" alt={item.altText} />
                    <CarouselCaption captionText={item.altText} captionHeader={item.caption} />
                </CarouselItem>
            );
        });

        return (
            <React.Fragment>
                <Carousel
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous} >
                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                </Carousel>
            </React.Fragment>
        );
    }
}

export default Slidewithcaption;   