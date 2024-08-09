import React, { useState, useEffect } from 'react';

function innerHeightChanged() {
  const timeout = 120;
  return new window.Promise(function(resolve) {
    const go = (i: any, height0: any) => {
      window.innerHeight != height0 || i >= timeout ?
      Promise.resolve() :
      window.requestAnimationFrame(() => go(i + 1, height0));
    };
    go(0, window.innerHeight);
  });
}

export default function useScreenSize() {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const handleRotate = () => {
      innerHeightChanged().then(() => {
        setInnerHeight(window.innerHeight)
      })
    }

    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleRotate)
    }

    return () => {
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleRotate)
      }
    }
  }, [])

  return { innerHeight }
}
