const SCROLL_ANIMATION_TRIGGER_CLASSNAME = 'scroll-trigger';
const SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = 'scroll-trigger--offscreen';
const SCROLL_ZOOM_IN_TRIGGER_CLASSNAME = 'animate--zoom-in';
const SCROLL_ANIMATION_CANCEL_CLASSNAME = 'scroll-trigger--cancel';

// Scroll in animation logic
function onIntersection(elements, observer) {
  elements.forEach((element, index) => {
    if (element.isIntersecting) {
      const elementTarget = element.target;
      if (elementTarget.classList.contains(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME)) {
        elementTarget.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
        if (elementTarget.hasAttribute('data-cascade'))
          elementTarget.setAttribute('style', `--animation-order: ${index};`);
      }
      observer.unobserve(elementTarget);
    } else {
      element.target.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
      element.target.classList.remove(SCROLL_ANIMATION_CANCEL_CLASSNAME);
    }
  });
}

function initializeScrollAnimationTrigger(rootEl = document, isDesignModeEvent = false) {
  const animationTriggerElements = Array.from(rootEl.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME));
  if (animationTriggerElements.length === 0) return;

  if (isDesignModeEvent) {
    animationTriggerElements.forEach((element) => {
      element.classList.add('scroll-trigger--design-mode');
    });
    return;
  }

  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: '0px 0px -50px 0px',
  });
  animationTriggerElements.forEach((element) => observer.observe(element));
}

// Zoom in animation logic
function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animationTriggerElements = Array.from(document.getElementsByClassName(SCROLL_ZOOM_IN_TRIGGER_CLASSNAME));

  if (animationTriggerElements.length === 0) return;

  const scaleAmount = 0.2 / 100;

  animationTriggerElements.forEach((element) => {
    let elementIsVisible = false;
    const observer = new IntersectionObserver((elements) => {
      elements.forEach((entry) => {
        elementIsVisible = entry.isIntersecting;
      });
    });
    observer.observe(element);

    element.style.setProperty('--zoom-in-ratio', 1 + scaleAmount * percentageSeen(element));

    window.addEventListener(
      'scroll',
      throttle(() => {
        if (!elementIsVisible) return;

        element.style.setProperty('--zoom-in-ratio', 1 + scaleAmount * percentageSeen(element));
      }),
      { passive: true }
    );
  });
}

function percentageSeen(element) {
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const elementPositionY = element.getBoundingClientRect().top + scrollY;
  const elementHeight = element.offsetHeight;

  if (elementPositionY > scrollY + viewportHeight) {
    // If we haven't reached the image yet
    return 0;
  } else if (elementPositionY + elementHeight < scrollY) {
    // If we've completely scrolled past the image
    return 100;
  }

  // When the image is in the viewport
  const distance = scrollY + viewportHeight - elementPositionY;
  let percentage = distance / ((viewportHeight + elementHeight) / 100);
  return Math.round(percentage);
}

window.addEventListener('DOMContentLoaded', () => {
  initializeScrollAnimationTrigger();
  initializeScrollZoomAnimationTrigger();
});

if (Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => initializeScrollAnimationTrigger(event.target, true));
  document.addEventListener('shopify:section:reorder', () => initializeScrollAnimationTrigger(document, true));
}

gsap.registerPlugin(ScrollTrigger);

// HOMEPAGE REVEAL ANIMATION
let revealContainers = document.querySelectorAll(".reveal");

revealContainers.forEach((container) => {
  let image = container.querySelector("img");
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
    }
  });

  tl.set(container, { autoAlpha: 1 });
  tl.from(container, 1.5, {
    xPercent: -100,
    ease: Power2.out
  });
  tl.from(image, 1.5, {
    xPercent: 100,
    delay: -1.5,
    ease: Power2.out
  });
});

// HOMEPAGE HFFK ANIMATION
let namemm = gsap.matchMedia();

namemm.add("(min-width:900px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".curved-container",
      start: "top 40%",
      end: "top 10%",
      pin: true,
      // scrub: true,
      // markers: true,
    }
  });
  tl.from(".curved-container h1 .kffk", {
    y: -250,
    autoAlpha: 0,
    stagger: .15,
  })
  tl.to('.curved-container h1 .kffk', {
    y: 0,
    autoAlpha: 1,
    stagger: .25,
  })
})

namemm.add("(max-width:899px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".curved-container",
      start: "top 40%",
      end: "top 10%",
      pin: true,
      // scrub: true,
      // markers: true,
    }
  });
  tl.from(".curved-container h1 .kffk", {
    y: -250,
    autoAlpha: 0,
    stagger: .15,
  })
  tl.to('.curved-container h1 .kffk', {
    y: 0,
    autoAlpha: 1,
    stagger: .25,
  })
})

// FOOTER SECTION LINKS

let footermm = gsap.matchMedia();

footermm.add("(min-width:900px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#footer-item-2",
      start: "top 80%",
      end: "top 70%",
      // pin: true,
      // scrub: true,
      // markers: true,
    }
  });
  tl.from("#footer-item-2 a", {
    y: 50,
    autoAlpha: 0,
    stagger: .25,
  })
  tl.to('#footer-item-2 a', {
    y: 0,
    autoAlpha: 1,
    stagger: .25,
  })
})

footermm.add("(max-width:899px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-tile-wrapper",
      start: "top 50%",
      end: "top 20%",
      // pin: true,
      // markers:true,
      // scrub: true,
    }
  });
  tl.to("#pinnedh1", {
    duration: 1,
    // y:"80%",
    scale: 3,
  })
})

// CONTACT INFO SECTION ANIMATIONS

let officersmm = gsap.matchMedia();

officersmm.add("(min-width:900px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".contact-info-container",
      start: "top 80%",
      end: "top 50%",
      // pin: true,
      // scrub: true,
      // markers: true,
    }
  });
  tl.from(".contact-info-item p", {
    y: 50,
    autoAlpha: 0,
    stagger: .15,
    scale: 1.1,
  })
  tl.to('.contact-info-item p', {
    y: 0,
    autoAlpha: 1,
    stagger: .15,
  })
})

footermm.add("(max-width:899px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-tile-wrapper",
      start: "top 50%",
      end: "top 20%",
      // pin: true,
      // markers:true,
      // scrub: true,
    }
  });
  tl.to("#pinnedh1", {
    duration: 1,
    // y:"80%",
    scale: 3,
  })
})

// HOMEPAGE TILE ITEMS
let tilemm = gsap.matchMedia();

tilemm.add("(min-width:900px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-tile-wrapper",
      start: "top 80%",
      end: "top 50%",
      // pin: true,
      // scrub: true,
      // markers: true,
    }
  });
  tl.from(".home-tile-item", {
    y: 100,
    autoAlpha: 0,
    stagger: .15,
    scale: .98,
    skewY: 5,
  })
  tl.to('.home-tile-item', {
    y: 0,
    autoAlpha: 1,
    stagger: .15,
  })
})

footermm.add("(max-width:899px)", () => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-tile-wrapper",
      start: "top 50%",
      end: "top 20%",
      // pin: true,
      // markers:true,
      // scrub: true,
    }
  });
  tl.to("#pinnedh1", {
    duration: 1,
    // y:"80%",
    scale: 3,
  })
})
// END HOMEPAGE TILE ITEMS

