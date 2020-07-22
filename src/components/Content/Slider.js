import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel, CarouselItem, CarouselCaption, CarouselControl, CarouselIndicators } from 'reactstrap';

import LazyLoader from './LazyLoader';

import Lightbox from 'react-images';

class Slider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeSlider: 0,
            isLightboxOpen: false,
        };


        this.toggleLightbox = this.toggleLightbox.bind(this);

        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);

        this.goToIndex = this.goToIndex.bind(this);
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    getSlides() {
        return this.props.slides ? this.props.slides.filter(slide => slide) : [];
    }

    next() {
        if(this.animating) return;
        const nextIndex = this.state.activeSlider === this.getSlides().length - 1 ? 0 : this.state.activeSlider + 1;
        this.setState({ activeSlider: nextIndex });
    }

    previous() {
        if(this.animating) return;
        const nextIndex = this.state.activeSlider === 0 ? this.getSlides().length - 1 : this.state.activeSlider - 1;
        this.setState({ activeSlider: nextIndex });
    }

    toggleLightbox() {
        this.animating = !this.state.isLightboxOpen;
        this.setState({
            isLightboxOpen: !this.state.isLightboxOpen,
        });
    }

    goToIndex(newIndex) {
        if(this.animating) return;
        this.setState({ activeSlider: newIndex });
    }

    renderSlides() {
        if(this.getSlides().length) {
            return this.getSlides().map((slide, index) => {
                let content = slide.content;
                if(!content || slide.url) {
                    content = <img src={slide.url || slide} alt={`${this.props.label || ''} - ${index + 1}`} style={{ maxWidth: '100%' }} onClick={this.toggleLightbox} />;
                }
                if(content) {
                    return (
                        <CarouselItem
                            onExiting={this.onExiting}
                            onExited={this.onExited}
                            key={index}
                        >
                            {content}
                            {slide.caption ? <CarouselCaption captionText={slide.caption} captionHeader={slide.caption} /> : null}
                        </CarouselItem>
                    );
                }
                return null;
            }).filter(slide => slide);
        }
        return null;
    }

    render() {
        if(this.getSlides() && this.getSlides().length) {
            const { activeSlider } = this.state;
            const slidesContent = this.renderSlides();
            if(slidesContent) { // Check if content, if not e.type undefined error
                return (
                    <div>
                        <Carousel
                            activeIndex={activeSlider}
                            next={this.next}
                            previous={this.previous}
                            keyboard
                            interval={this.props.interval || 5000}
                        >
                            {slidesContent}
                            {this.getSlides().length > 1 && !this.props.disableControls ? <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} /> : ''}
                            {this.getSlides().length > 1 && !this.props.disableControls ? <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} /> : ''}
                        </Carousel>
                        {
                            !this.props.disableLightbox
                            ?
                                <Lightbox
                                    currentImage={this.state.activeSlider}
                                    images={this.getSlides().map(slide => { return { src: slide }; })}
                                    isOpen={this.state.isLightboxOpen}
                                    onClose={this.toggleLightbox}
                                    onClickPrev={() => this.setState({ activeSlider: this.state.activeSlider - 1 })}
                                    onClickNext={() => this.setState({ activeSlider: this.state.activeSlider + 1 })}
                                    showImageCount={false}
                                />
                            : null
                        }
                    </div>
                );
            }
        }
        return null;
    }
}

// {this.getSlides().length > 1 && !this.props.disableIndicators ? <CarouselIndicators items={this.getSlides().map((slide, index) => { return { src: index }; })} activeIndex={activeSlider} onClickHandler={this.goToIndex} /> : ''}

Slider.propTypes = {
    slides: PropTypes.array.isRequired, // slide url or object
    label: PropTypes.string,
    interval: PropTypes.number,
    disableLightbox: PropTypes.bool,
    disableControls: PropTypes.bool,
    disableIndicators: PropTypes.bool,
};

export default Slider;
