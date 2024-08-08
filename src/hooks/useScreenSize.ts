import React, { useState, useEffect } from 'react';

export default function useScreenSize() {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        setInnerHeight(window.innerHeight)
      }, 0)
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleResize)
    }

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize)

      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleResize)
      }
    }
  }, [])

  return { innerHeight }
}
