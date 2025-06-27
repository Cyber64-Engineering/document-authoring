import { RenderElement } from '../../../scripts/preactHelpers.js';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';

const HeroCarousel = ({ content }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const slideRefs = useRef([]);

  const goTo = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const targetSlide = slideRefs.current[activeIndex];

    if (wrapper && targetSlide) {
      wrapper.scrollTo({
        left: targetSlide.offsetLeft,
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  return (
    <div className="carousel">
      <div className="carousel-slides-container">
        <div className="carousel-navigation-buttons">
          <button
            type="button"
            className="slide-prev"
            aria-label="Previous Slide"
            onClick={() => goTo((activeIndex - 1 + content.length) % content.length)}
          ></button>
          <button type="button" className="slide-next" aria-label="Next Slide" onClick={() => goTo((activeIndex + 1) % content.length)}></button>
        </div>

        <div className="carousel-slides" ref={wrapperRef}>
          {content.map((slide, index) => (
            <div
              className="carousel-slide"
              key={index}
              ref={(element) => {
                slideRefs.current[index] = element;
              }}
              aria-hidden={activeIndex === index ? true : false}
              aria-labelledby={slide.elements[1].children[0].text}
            >
              <div className="carousel-slide-image">
                <RenderElement element={slide.elements[0]} />
              </div>
              <div className="carousel-slide-content">
                {slide.elements.map((element) => {
                  if (element.tag === 'picture') return null;
                  return <RenderElement element={element} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
