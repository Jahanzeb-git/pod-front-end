<script lang="ts">
  import { onMount } from 'svelte';

  // --- Configuration ---
  const DOODLE_COUNT = 80; // Increased doodle count
  const MIN_SIZE = 60;
  const MAX_SIZE = 140;
  const SPACING = 30; // Extra pixel margin around each doodle
  const MAX_PLACEMENT_ATTEMPTS = 100; // Prevents infinite loops

  // Import all doodles as raw SVG strings
  const modules = import.meta.glob('$lib/assets/doodles/*.svg', { as: 'raw', eager: true });
  const doodleSources = Object.values(modules);

  type Doodle = {
    svg: string;
    top: number;
    left: number;
    size: number;
    rotation: number;
  };

  type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  let generatedDoodles: Doodle[] = [];
  let container: HTMLDivElement;

  /**
   * Processes an SVG string to make it scalable.
   */
  function makeSvgScalable(svgString: string): string {
    const svgTagMatch = svgString.match(/<svg([^>]+)>/);
    if (!svgTagMatch) return svgString;
    const attributesString = svgTagMatch[1];
    if (attributesString.includes('viewBox')) return svgString;

    const widthMatch = attributesString.match(/width=["'](\d+(\.\d+)?)["']/i);
    const heightMatch = attributesString.match(/height=["'](\d+(\.\d+)?)["']/i);

    if (widthMatch && heightMatch) {
      const width = widthMatch[1];
      const height = heightMatch[1];
      const viewBox = `viewBox="0 0 ${width} ${height}"`;
      const cleanedAttributes = attributesString
        .replace(/width=["']\d+(\.\d+)?["']/i, '')
        .replace(/height=["']\d+(\.\d+)?["']/i, '');
      const newAttributes = `${cleanedAttributes} ${viewBox}`;
      return svgString.replace(svgTagMatch[0], `<svg${newAttributes}>`);
    }
    return svgString;
  }

  /**
   * Checks if two rectangles overlap, including a spacing margin.
   */
  function doRectsOverlap(rect1: Rect, rect2: Rect, spacing: number): boolean {
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

  onMount(() => {
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const placedDoodles: Doodle[] = [];
    const placedRects: Rect[] = [];

    for (let i = 0; i < DOODLE_COUNT; i++) {
      let attempts = 0;
      let hasOverlap: boolean;
      let potentialRect: Rect;

      do {
        const size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
        const x = Math.random() * (containerWidth - size);
        const y = Math.random() * (containerHeight - size);
        
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
        const newDoodle: Doodle = {
          svg: makeSvgScalable(doodleSources[Math.floor(Math.random() * doodleSources.length)]),
          top: (potentialRect.y / containerHeight) * 100,
          left: (potentialRect.x / containerWidth) * 100,
          size: potentialRect.width,
          rotation: Math.random() * 60 - 30,
        };
        placedDoodles.push(newDoodle);
        placedRects.push(potentialRect);
      }
    }
    generatedDoodles = placedDoodles;
  });
</script>

<div class="doodle-container" aria-hidden="true" bind:this={container}>
  {#each generatedDoodles as doodle}
    <div
      class="doodle-item"
      style="
        top: {doodle.top}%;
        left: {doodle.left}%;
        width: {doodle.size}px;
        height: {doodle.size}px;
        transform: rotate({doodle.rotation}deg);
      "
    >
      {@html doodle.svg}
    </div>
  {/each}
</div>

<style>
  .doodle-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
  }

  .doodle-item {
    position: absolute;
    will-change: transform;
    animation: fadeIn 0.3s ease-out;
    opacity: 1; /* Full opacity for light theme */
    transition: opacity 0.3s ease;
  }

  [data-theme="dark"] .doodle-item {
    opacity: 0.2; /* Reduced opacity for dark theme */
  }

  :global(.doodle-item svg) {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Directly set the fill on the path */
  :global(.doodle-item svg path) {
    fill: var(--color-border-secondary);
  }

  [data-theme="dark"] :global(.doodle-item svg path) {
    fill: var(--color-border-primary);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: initial; 
      transform: scale(1);
    }
  }
</style>