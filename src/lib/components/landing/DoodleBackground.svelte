<script lang="ts">
  import { onMount } from 'svelte';

  /** The number of doodles to generate. */
  export let count = 12;

  // --- Configuration ---
  const MIN_SIZE = 50;
  const MAX_SIZE = 120;
  const SPACING = 15; // Reduced spacing for denser packing in sections
  const MAX_PLACEMENT_ATTEMPTS = 50; // Limit attempts per doodle

  // Import all doodles as raw SVG strings
  const modules = import.meta.glob('$lib/assets/doodles/*.svg', { as: 'raw', eager: true });
  const doodleSources = Object.values(modules);

  type Doodle = {
    svg: string;
    top: number;
    left: number;
    size: number;
    rotation: number;
    delay: number;
  };

  type Rect = { x: number; y: number; width: number; height: number; };

  let generatedDoodles: Doodle[] = [];
  let container: HTMLDivElement;

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
      const cleanedAttributes = attributesString.replace(/width=["']\d+(\.\d+)?["']/i, '').replace(/height=["']\d+(\.\d+)?["']/i, '');
      const newAttributes = `${cleanedAttributes} ${viewBox}`;
      return svgString.replace(svgTagMatch[0], `<svg${newAttributes}>`);
    }
    return svgString;
  }

  function doRectsOverlap(rect1: Rect, rect2: Rect, spacing: number): boolean {
    const r1 = { left: rect1.x - spacing, right: rect1.x + rect1.width + spacing, top: rect1.y - spacing, bottom: rect1.y + rect1.height + spacing };
    const r2 = { left: rect2.x, right: rect2.x + rect2.width, top: rect2.y, bottom: rect2.y + rect2.height };
    return r1.left < r2.right && r1.right > r2.left && r1.top < r2.bottom && r1.bottom > r2.top;
  }

  onMount(() => {
    if (!container || doodleSources.length === 0) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const placedDoodles: Doodle[] = [];
    const placedRects: Rect[] = [];

    for (let i = 0; i < count; i++) {
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
        placedDoodles.push({
          svg: makeSvgScalable(doodleSources[Math.floor(Math.random() * doodleSources.length)]),
          top: (potentialRect.y / containerHeight) * 100,
          left: (potentialRect.x / containerWidth) * 100,
          size: potentialRect.width,
          rotation: Math.random() * 60 - 30,
          delay: Math.random() * 0.8,
        });
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
        --final-rotation: {doodle.rotation}deg;
        animation-delay: {doodle.delay}s;
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
    will-change: transform, opacity;
    opacity: 0;
    animation: fadeIn 0.6s ease-out forwards;
  }

  :global(.doodle-item svg) {
    width: 100%;
    height: 100%;
    display: block;
  }

  :global(.doodle-item svg path) {
    fill: var(--color-border-secondary);
  }

  [data-theme="dark"] :global(.doodle-item svg path) {
    fill: var(--color-border-primary);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9) rotate(0deg);
    }
    to {
      opacity: var(--doodle-final-opacity, 1);
      transform: scale(1) rotate(var(--final-rotation));
    }
  }

  :root {
    --doodle-final-opacity: 1;
  }

  [data-theme="dark"] {
    --doodle-final-opacity: 0.2;
  }
</style>