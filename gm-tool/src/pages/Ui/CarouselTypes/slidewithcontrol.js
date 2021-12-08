import React, { Component } from 'react';
import { Carousel, CarouselItem, CarouselControl } from 'reactstrap';

// Carousel images 
import img4 from '../../../assets/images/small/img-4.jpg';
import img5 from '../../../assets/images/small/img-5.jpg';
import img6 from '../../../assets/images/small/img-6.jpg';

const items = [
    {
        src: img4,
        altText: 'Slide 1',
        caption: 'Slide 1',

    },
    {
        src: img5,
        altText: 'Slide 2',
        caption: 'Slide 2'
    },
    {
        src: img6,
        altText: 'Slide 3',
        caption: 'Slide 3'
    }
];

class Slidewithcontrol extends Component {

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
                </CarouselItem>
            );
        });

        return (
            <React.Fragment>
                <Carousel
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous} >
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                </Carousel>
            </React.Fragment>
        );
    }
}

export default Slidewithcontrol;   