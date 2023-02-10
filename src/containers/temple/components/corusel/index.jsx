import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from 'react';
import styles from './carousel.scss';

const cx = require('classnames');

const Carousel = ({
  slides = [],
  speed = 3000,
  activeStep,
  setStep,
  transitionSpeed = 500,
  slideWidth = 200,
  heightSlide,
  disableNext,
  disableMode,
}) => {
  if (slides.length < 2) {
    console.error('Please provide more slides');
    return null;
  }

  const [visibleSlide, setVisibleSlide] = useState(1);
  const [hasTransitionClass, setHasTransitionClass] = useState(true);
  const [stateSlides, setStateSlides] = useState(slides);
  const intervalId = useRef(null);

  const newItemList = slides.concat(slides, slides, slides);

  useEffect(() => {
    setVisibleSlide(slides.length * 2 + activeStep);
  }, [activeStep, slides]);

  // useEffect(() => {
  //   const slidesWithClones = [...slides];
  //   // slidesWithClones.unshift({});
  //   // slidesWithClones.push({});
  //   setStateSlides(slidesWithClones);
  // }, [slides]);

  const calculateLeftMargin = () => {
    return `-${visibleSlide * slideWidth - slideWidth}px`;
  };

  const slideDimensionStyles = () => {
    return { width: `${slideWidth}px` };
  };

  // const scrollRight = useCallback(
  //   (index) => {
  //     if (index < stateSlides.length - 1) {
  //       setVisibleSlide((prev) => prev + 1);
  //     } else {
  //       const nextStateSlides = [...stateSlides];
  //       nextStateSlides.push(nextStateSlides.shift());
  //       console.log(stateSlides, nextStateSlides);
  //       setStateSlides(nextStateSlides);

  //       // setHasTransitionClass(false);
  //       setVisibleSlide((prev) => prev - 1);

  //       // setTimeout(() => {
  //       //   setHasTransitionClass(true);
  //       //   setVisibleSlide((prev) => prev + 1);
  //       // });
  //     }
  //   },
  //   [stateSlides]
  // );

  // const scrollLeft = (index) => {
  //   if (index > 0) {
  //     setVisibleSlide((prev) => prev - 1);
  //   } else {
  //     const nextStateSlides = [...stateSlides];
  //     nextStateSlides.unshift(nextStateSlides.pop());
  //     // console.log(stateSlides, nextStateSlides);
  //     setStateSlides(nextStateSlides);

  //     setHasTransitionClass(false);
  //     setVisibleSlide((prev) => prev + 1);

  //     setTimeout(() => {
  //       setHasTransitionClass(true);
  //       setVisibleSlide((prev) => prev - 1);
  //     });
  //   }
  // };

  // const setActiveItem = useCallback(
  //   (index) => {
  //     if (index !== visibleSlide && !disableMode) {
  //       if (index <= visibleSlide) {
  //         scrollLeft(index);
  //       } else if (!disableNext && index > visibleSlide) {
  //         scrollRight(index);
  //       }
  //     }
  //   },
  //   [disableNext, visibleSlide, stateSlides]
  // );

  useEffect(() => {
    // make carousel infinite
    if (visibleSlide > slides.length * 2) {
      // keep index near the middle of the list when moving left
      // setNavDisabled(true); // disable nav buttons while silently moving to different card
      setTimeout(() => {
        // disable transition animation after card slides, then snap to same card prior in the list
        setHasTransitionClass(false);
        setVisibleSlide(visibleSlide - slides.length);
      }, 500);
    }
    if (visibleSlide == slides.length) {
      // keep index near the middle of the list when moving right
      // setNavDisabled(true);
      setTimeout(() => {
        setHasTransitionClass(false);
        setVisibleSlide(visibleSlide + slides.length);
      }, 500);
    }
    if (hasTransitionClass === false) {
      // turn transition animation back on after 25ms
      setTimeout(() => {
        setHasTransitionClass(true);
        // setNavDisabled(false);
      }, 500 / 10);
    }
  }, [visibleSlide]);

  const setActiveItem = useCallback(
    (index) => {
      if (!disableMode) {
        setVisibleSlide(index);
      }
    },
    [disableMode]
  );

  return (
    <>
      <div
        className={styles.carousel}
        style={{
          maxWidth: `${slideWidth * 3}px`,
          height: heightSlide || '40px',
        }}
      >
        <div className={styles.slidesContainer} style={slideDimensionStyles()}>
          <div
            id="slides"
            className={cx(styles.slides, {
              [styles.transition]: hasTransitionClass,
            })}
            style={{ left: calculateLeftMargin() }}
          >
            {newItemList.map((slide, index) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={index}
                  onClick={() => setActiveItem(index)}
                  className={cx(styles.slide, {
                    [styles.active]: index === visibleSlide,
                    [styles.left]: index + 1 === visibleSlide,
                    [styles.right]: index - 1 === visibleSlide,
                  })}
                  style={slideDimensionStyles()}
                >
                  <div
                    className={cx(styles.lamp, {
                      [styles.active]: index === visibleSlide,
                      [styles.left]: index + 1 === visibleSlide,
                      [styles.right]: index - 1 === visibleSlide,
                    })}
                  >
                    <div className={styles.containerContent}>
                      {!!slide.step && (
                        <div className={styles.step}>step {slide.step}</div>
                      )}
                      {!!slide.title && (
                        <div className={styles.title}>{slide.title}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
