/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import styles from './Carousel.module.scss';

const cx = require('classnames');

interface Slide {
  step?: number;
  title?: string | JSX.Element;
}

type Color = 'green' | 'blue';

type CarouselProps = {
  slides: Slide[];
  // speed?: number;
  activeStep?: number;
  // setStep: (step: number) => void;
  // transitionSpeed?: number;
  // slideWidth?: number;
  heightSlide?: string;
  // disableNext?: boolean;
  disableMode?: boolean;
  displaySlide?: number;
  color?: Color;
};

function Carousel({
  slides = [],
  speed = 3000,
  activeStep = 1,
  setStep,
  transitionSpeed = 500,
  slideWidth = 200,
  heightSlide,
  disableNext,
  onChange,
  color = 'green',
  disableMode,
  displaySlide = 3,
}: CarouselProps) {
  const query = useMediaQuery('(min-width: 768px)');
  const [itemWidth, setItemWidth] = useState(0);
  const [displaySlideState, setDisplaySlideState] = useState(displaySlide);
  const [visibleSlide, setVisibleSlide] = useState(1);
  const [hasTransitionClass, setHasTransitionClass] = useState(true);
  const changeDisplay = useRef(false);

  useEffect(() => {
    if (displaySlide > 3) {
      if (!query) {
        setDisplaySlideState(3);
        changeDisplay.current = true;
      }
      if (query && changeDisplay.current) {
        setDisplaySlideState(displaySlide);
        changeDisplay.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (slides.length < 2) {
    console.error('Please provide more slides');
    return null;
  }

  useEffect(() => {
    setVisibleSlide(slides.length * 2 + activeStep);

    const resizeCarousel = () => {
      const { clientWidth } = document.getElementById('containerCarousel');

      setItemWidth(clientWidth / displaySlideState);
    };

    resizeCarousel();
    window.addEventListener('resize', resizeCarousel);

    return () => {
      window.removeEventListener('resize', resizeCarousel);
    };
  }, [activeStep, slides, displaySlideState]);

  const calculateLeftMargin = useMemo(() => {
    if (itemWidth !== 0) {
      return `-${
        visibleSlide * itemWidth - itemWidth * Math.floor(displaySlideState / 2)
      }px`;
    }
    return '0px';
  }, [visibleSlide, itemWidth, displaySlideState]);

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
    // eslint-disable-next-line eqeqeq
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSlide]);

  const setActiveItem = useCallback(
    (index) => {
      if (!disableMode) {
        setVisibleSlide(index);
      }
    },
    [disableMode]
  );

  const newItemList = slides.concat(slides, slides, slides);

  return (
    <div
      className={cx(
        styles.carousel,
        disableMode && styles.disableMode,
        styles[`color_${color}`]
      )}
      id="containerCarousel"
      style={{
        height: heightSlide || '40px',
      }}
    >
      <div
        className={styles.slidesContainer}
        style={{ width: `${itemWidth}px` }}
      >
        <div
          id="slides"
          className={cx(styles.slides, {
            [styles.transition]: hasTransitionClass,
          })}
          style={{ left: calculateLeftMargin }}
        >
          {newItemList.map((slide, index) => {
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={index}
                onClick={() => {
                  setActiveItem(index);
                  onChange?.(slides.indexOf(slide));
                }}
                className={cx(styles.slide, {
                  [styles.active]: index === visibleSlide,
                  [styles.left]:
                    index + Math.floor(displaySlideState / 2) === visibleSlide,
                  [styles.right]:
                    index - Math.floor(displaySlideState / 2) === visibleSlide,
                })}
                style={{
                  width: `${itemWidth}px`,
                  color: disableMode ? '#777777' : '#36d6ae',
                }}
              >
                <div
                  className={cx(styles.lamp, {
                    [styles.active]: index === visibleSlide,
                    [styles.left]:
                      index + Math.floor(displaySlideState / 2) ===
                      visibleSlide,
                    [styles.right]:
                      index - Math.floor(displaySlideState / 2) ===
                      visibleSlide,
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
  );
}

export default Carousel;
