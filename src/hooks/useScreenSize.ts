import React, { useState, useEffect } from 'react';

export default function useScreenSize() {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight)
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
