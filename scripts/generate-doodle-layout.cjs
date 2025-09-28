
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const DOODLE_COUNT = 80;
const MIN_SIZE = 60;
const MAX_SIZE = 140;
const SPACING = 30; // Extra pixel margin
const MAX_PLACEMENT_ATTEMPTS = 100;

// Virtual container size for generation
const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 1080;

/**
 * Checks if two rectangles overlap.
 */
function doRectsOverlap(rect1, rect2, spacing) {
  const r1 = {
    left: rect1.x - spacing,
    right: rect1.x + rect1.width + spacing,
    top: rect1.y - spacing,
    bottom: rect1.y + rect1.height + spacing,
  };
  const r2 = {
    left: rect2.x,
    right: rect2.x + rect2.width,
    top: rect2.y,
    bottom: rect2.y + rect2.height,
  };
  return r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top;
}

function generateLayout() {
  console.log('Generating doodle layout...');
  const placedRects = [];
  const finalDoodles = [];

  for (let i = 0; i < DOODLE_COUNT; i++) {
    let attempts = 0;
    let hasOverlap;
    let potentialRect;

    do {
      const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
      const x = Math.random() * (VIRTUAL_WIDTH - size);
      const y = Math.random() * (VIRTUAL_HEIGHT - size);
      
      potentialRect = { x, y, width: size, height: size };
      hasOverlap = false;

      for (const existingRect of placedRects) {
        if (doRectsOverlap(potentialRect, existingRect, SPACING)) {
          hasOverlap = true;
          break;
        }
      }
      attempts++;
    } while (hasOverlap && attempts < MAX_PLACEMENT_ATTEMPTS);

    if (!hasOverlap) {
      const newDoodle = {
        top: (potentialRect.y / VIRTUAL_HEIGHT) * 100,
        left: (potentialRect.x / VIRTUAL_WIDTH) * 100,
        size: potentialRect.width,
        rotation: Math.random() * 60 - 30,
      };
      finalDoodles.push(newDoodle);
      placedRects.push(potentialRect);
    }
  }

  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'assets', 'doodle-layout.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalDoodles, null, 2));

  console.log(`Successfully generated and saved ${finalDoodles.length} doodles to ${outputPath}`);
}

generateLayout();
