import { renderHook } from '@testing-library/react';
import { useAnimationFrame } from '../useAnimationFrame';

describe('useAnimationFrame', () => {
  let originalRAF;
  let originalCAF;
  let scheduled;

  beforeEach(() => {
    originalRAF = global.requestAnimationFrame;
    originalCAF = global.cancelAnimationFrame;
    scheduled = null;
    global.requestAnimationFrame = (cb) => {
      scheduled = cb;
      return 1;
    };
    global.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCAF;
  });

  test('calls callback when run=true', () => {
    const spy = jest.fn();
    renderHook(() => useAnimationFrame(true, spy));

    // simulate two frames to produce delta
    scheduled && scheduled(100);
    scheduled && scheduled(116);

    expect(spy).toHaveBeenCalledWith(16);
  });

  test('does not schedule when run=false', () => {
    renderHook(() => useAnimationFrame(false, () => {}));
    expect(scheduled).toBeNull();
  });
}); 