import React, { useState, useEffect, useRef, Fragment } from 'react';
import styles from './carousel.scss';

const cx = require('classnames');

const Carousel = ({
  slides = [],
  speed = 3000,
  transitionSpeed = 500,
  slideWidth = 200,
  slideHeight = 300,
}) => {
  if (slides.length < 2) {
    console.error('Please provide more slides');
    return null;
  }

  const [visibleSlide, setVisibleSlide] = useState(0);
  const [hasTransitionClass, setHasTransitionClass] = useState(true);
  const [stateSlides, setStateSlides] = useState(slides);
  const [leftAndRightDisabled, setLeftAndRightDisabled] = useState(false);
  const intervalId = useRef(null);

  // useEffect with an empty array as the second parameter
  // will run only once, when the component mounts
  // this makes it an ideal place to trigger this functionality
  useEffect(() => {
    const slidesWithClones = [...slides];
    slidesWithClones.unshift(slidesWithClones[slidesWithClones.length - 1]);
    slidesWithClones.push(slidesWithClones[1]);
    setStateSlides(slidesWithClones);

    // if (!!autoScroll) {
    //   start();
    // }
  }, []);

  console.log('visibleSlide', visibleSlide)
  console.log('stateSlides.length', stateSlides.length)

  // Monitor changes for the visibleSlide value and react accordingly
  // We need to loop back to the first slide when scrolling right
  // from the last slide (and vice-versa for the other direction)
  // And we also need to disable the animations (by removing the
  // transition class from the relevant element) in order to give
  // the impression that the carousel is scrolling infinitely
  // during our slide-cloning/swapping mechanism
  useEffect(() => {
    if (visibleSlide == stateSlides.length - 2) {
      setLeftAndRightDisabled(true);
      setTimeout(() => {
        setHasTransitionClass(true);
        setVisibleSlide(0);
      }, transitionSpeed);
    }

    if (visibleSlide === 0) {
      setTimeout(() => {
        setHasTransitionClass(true);
      }, transitionSpeed);
    }

    if (visibleSlide === -1) {
      setLeftAndRightDisabled(true);
      setTimeout(() => {
        setHasTransitionClass(true);
        setVisibleSlide(stateSlides.length - 3);
      }, transitionSpeed);
    }

    // if (visibleSlide == stateSlides.length - 2) {
    //   setTimeout(() => {
    //     setHasTransitionClass(true);
    //   }, transitionSpeed);
    // }
  }, [visibleSlide]);

  // Whenever the left and right arrows are disabled
  // We want to enable them again after a specific
  // period of time, this is to prevent problematic
  // spamming of these controls during our clone
  // slide-cloning/swapping mechanism
  // Probably a better way to handle this though
  useEffect(() => {
    if (leftAndRightDisabled) {
      setTimeout(() => {
        setLeftAndRightDisabled(false);
      }, transitionSpeed * 2);
    }
  }, [leftAndRightDisabled]);

  const calculateLeftMargin = () => {
    return `-${visibleSlide * slideWidth}px`;
  };

  const slideDimensionStyles = () => {
    return { width: `${slideWidth}px`, height: `${slideHeight}px` };
  };

  const scrollLeft = () => {
    setVisibleSlide(visibleSlide - 1);
  };

  const scrollRight = () => {
    setVisibleSlide(visibleSlide + 1);
  };

  const dotIsActive = (index) => {
    return (
      index === visibleSlide ||
      (index === 1 && visibleSlide === stateSlides.length - 1) ||
      (index === stateSlides.length - 2 && visibleSlide === 0)
    );
  };

  return (
    <div className={styles.carousel}>
      {/* {!autoScroll && !manualMode && (
        <div className={styles.controls}>
          <a onClick={start} href="javascript:;">
            Start
          </a>{' '}
          <a onClick={stop} href="javascript:;">
            Stop
          </a>
        </div>
      )} */}

      <div
        className={styles.slidesContainer}
        style={{width: '100%', height: '100px'}}
        // style={slideDimensionStyles()}
      >
        <>
          <a
            onClick={!leftAndRightDisabled ? scrollLeft : null}
            href="javascript:;"
            className={cx(styles.scrollLeft, {
              [styles.disabled]: leftAndRightDisabled,
            })}
          >
            Left
          </a>
          <a
            onClick={!leftAndRightDisabled ? scrollRight : null}
            href="javascript:;"
            className={cx(styles.scrollRight, {
              [styles.disabled]: leftAndRightDisabled,
            })}
          >
            Right
          </a>
        </>

        <div className={styles.slideIndicator}>
          {stateSlides.map((slide, index) => {
            if (index === 0 || index === stateSlides.length - 1) {
              return null;
            }
            return (
              <div
                key={index}
                onClick={() => setVisibleSlide(index)}
                className={cx(styles.dot, {
                  [styles.active]: dotIsActive(index),
                })}
              />
            );
          })}
        </div>

        <div
          id="slides"
          className={cx(styles.slides, {
            [styles.transition]: hasTransitionClass,
          })}
          style={{ left: calculateLeftMargin() }}
        >
          {stateSlides.map((slide, index) => {
            return (
              <div key={index} className="slide" style={slideDimensionStyles()}>
                {!!slide.title && (
                  <div className={styles.title}>{slide.title}</div>
                )}
                {/* <div className="slideInner">{slide.content()}</div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
