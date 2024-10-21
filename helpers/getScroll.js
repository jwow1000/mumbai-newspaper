// scrollCapture.js
export function captureScroll(callback, delay) {
  let startX = 0, startY = 0;
  let isThrottled = false;

  // Handle desktop/laptop scroll (wheel event)
  function handleWheelEvent(event) {
    if (isThrottled) return; // Ignore if within throttle window

    let direction = {
      vertical: event.deltaY > 0 ? 'down' : (event.deltaY < 0 ? 'up' : null),
      horizontal: event.deltaX > 0 ? 'right' : (event.deltaX < 0 ? 'left' : null)
    };

    // Only call the callback if a valid scroll occurred
    if (direction.vertical || direction.horizontal) {
      callback(direction);
      throttleScroll();
    }
  }

  // Handle touch start on mobile devices
  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }

  // Handle touch move on mobile devices
  function handleTouchMove(event) {
    if (isThrottled) return; // Ignore if within throttle window

    const moveX = event.touches[0].clientX;
    const moveY = event.touches[0].clientY;

    const diffX = startX - moveX;
    const diffY = startY - moveY;

    let direction;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal scroll
      direction = diffX > 0 ? 'left' : 'right';
    } else {
      // Vertical scroll
      direction = diffY > 0 ? 'up' : 'down';
    }

    callback({
      vertical: direction === 'up' || direction === 'down' ? direction : null,
      horizontal: direction === 'left' || direction === 'right' ? direction : null
    });

    throttleScroll();
  }

  // Throttle function to prevent capturing too frequently
  function throttleScroll() {
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, delay);
  }

  // Attach event listeners
  window.addEventListener('wheel', handleWheelEvent, { passive: true });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });

  // Provide a cleanup function to remove event listeners if necessary
  return function cleanup() {
    window.removeEventListener('wheel', handleWheelEvent);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
  };
}
