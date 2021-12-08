import React, { Component } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';

// Carousel images 
import img1 from '../../../assets/images/small/img-1.jpg';
import img2 from '../../../assets/images/small/img-2.jpg';
import img3 from '../../../assets/images/small/img-3.jpg';

const items = [
    {
        src: img1,
        altText: 'Slide 1',
        caption: 'Slide 1',

    },
    {
        src: img2,
        altText: 'Slide 2',
        caption: 'Slide 2'
    },
    {
        src: img3,
        altText: 'Slide 3',
        caption: 'Slide 3'
    }
];

class Slide extends Component {

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

                </Carousel>
            </React.Fragment>
        );
    }
}

export default Slide;   