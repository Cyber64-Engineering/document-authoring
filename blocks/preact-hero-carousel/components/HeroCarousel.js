import { h } from 'https://esm.sh/preact';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';
import { RenderElement } from '../../../scripts/preactHelpers.js';

const HeroCarousel = ({
  content,
}) => {
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
  return h('div', {
    class: 'carousel',
  }, h('div', {
    class: 'carousel-slides-container',
  }, h('div', {
    class: 'carousel-navigation-buttons',
  }, h('button', {
    type: 'button',
    class: 'slide-prev',
    'aria-label': 'Previous Slide',
    onClick: () => goTo((activeIndex - 1 + content.length) % content.length),
  }), h('button', {
    type: 'button',
    class: 'slide-next',
    'aria-label': 'Next Slide',
    onClick: () => goTo((activeIndex + 1) % content.length),
  })), h('div', {
    class: 'carousel-slides',
    ref: wrapperRef,
  }, content.map((slide, index) => h('div', {
    class: 'carousel-slide',
    key: index,
    ref: (element) => {
      slideRefs.current[index] = element;
    },
    'aria-hidden': activeIndex === index,
    'aria-labelledby': slide.elements[1].children[0].text,
  }, h('div', {
    class: 'carousel-slide-image',
  }, h(RenderElement, {
    element: slide.elements[0],
  })), h('div', {
    class: 'carousel-slide-content',
  }, slide.elements.map((element) => {
    if (element.tag === 'picture') return null;
    return h(RenderElement, {
      element,
    });
  })))))));
};
export default HeroCarousel;
