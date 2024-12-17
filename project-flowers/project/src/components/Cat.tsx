import React, { useEffect, useState } from 'react';

const Cat = ({ img, direction = "left-to-right", time_to_repeat, animation_duration }) => {
  const [leftPosition, setLeftPosition] = useState(direction === "left-to-right" ? -200 : window.innerWidth); // Start position
  const [topPosition, setTopPosition] = useState(0); // Random vertical position
  const [isVisible, setIsVisible] = useState(false); // Whether the cat is visible
  const [isMoving, setIsMoving] = useState(false); // Whether the cat is currently moving
  const [currentFrame, setCurrentFrame] = useState(0); // Current frame for cycling through images
  const catHeight = 80; // Height of your cat image (adjust accordingly)

  // Check if img is a GIF or an array of images
  const isGif = typeof img === "string"; // If it's a string, assume it's a GIF
  const catImages = Array.isArray(img) ? img : [img]; // If it's an array, use it; otherwise, wrap the single image

  const moveCat = () => {
    const screenWidth = window.innerWidth; // Get screen width
    const screenHeight = window.innerHeight; // Get screen height

    // Calculate fence height (either 17% of screen height or 140px, whichever is greater)
    const fenceHeight = Math.max(0.19 * screenHeight, 140);
    const fenceBottom = 265; // The fixed position from the bottom for the fence
    
    // Calculate random position between the bottom of the fence and the bottom of the screen (taking cat height into account)
    const minTopPosition = fenceBottom + fenceHeight;
    const maxTopPosition = screenHeight - catHeight;

    // Ensure the cat starts between the bottom of the fence and the bottom of the screen
    const randomTop = minTopPosition + Math.random() * (maxTopPosition - minTopPosition);

    setTopPosition(randomTop); // Set new vertical position

    // Set starting position based on direction
    const start = direction === "left-to-right" ? -200 : screenWidth;
    const end = direction === "left-to-right" ? screenWidth : -200;

    setLeftPosition(start); // Set the cat's start position
    setIsVisible(true); // Show the cat

    // Start cycling through frames if multiple images
    const animationInterval = isGif
      ? null
      : setInterval(() => {
          setCurrentFrame((prevFrame) => (prevFrame + 1) % catImages.length); // Cycle through frames
        }, 120); // Change frame every 120ms

    // Set the cat's position to move to the end
    setTimeout(() => {
      setLeftPosition(end); // Move the cat to the end position
      setIsMoving(true); // Indicate that the cat is currently moving
    }, 200); // Delay before it starts moving

    // Hide the cat and reset state after it finishes crossing
    setTimeout(() => {
      setIsVisible(false); // Hide the cat
      setIsMoving(false); // Reset moving state
      if (animationInterval) clearInterval(animationInterval); // Stop cycling frames if used
    }, time_to_repeat + 3000); // Duration of the crossing
  };

  // Move the cat every 3-5 seconds, but only if it's not already moving
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMoving) {
        moveCat(); // Start the movement if the cat is not currently moving
      }
    }, Math.random() * (5000 - 3000) + time_to_repeat); // Random interval between 3s and 5s

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [isMoving]); // Depend on `isMoving` to make sure it waits for the cat to finish

  const trans_str = 'left ' + animation_duration + ' linear'
  return (
    <div>
      {isVisible && (
        <img
          src={catImages[currentFrame]} // Use the current frame or the single GIF
          alt="Cat"
          style={{
            position: 'absolute',
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
            transition: trans_str, // Smooth movement of the cat
            zIndex: 1, // Ensure the cat stays on top of other elements
            height: 110,
          }}
        />
      )}
    </div>
  );
};

export default Cat;
