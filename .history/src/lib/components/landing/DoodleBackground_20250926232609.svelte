<script lang="ts">
  import { onMount } from 'svelte';

  // --- Configuration ---
  const DOODLE_COUNT = 20;
  const MIN_SIZE = 60; // Minimum size of a doodle in pixels
  const MAX_SIZE = 140; // Maximum size of a doodle in pixels

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

  let generatedDoodles: Doodle[] = [];

  /**
   * Processes an SVG string to make it scalable and safe for HTML injection.
   */
  function processSvg(svgString: string): string {
    // 1. Remove XML declaration
    let processedSvg = svgString.replace(/<\?xml[^>]+>/, '');

    // 2. Add viewBox and remove width/height
    const svgTagMatch = processedSvg.match(/<svg([^>]+)>/);
    if (!svgTagMatch) return processedSvg;

    const attributes = svgTagMatch[1];
    const widthMatch = attributes.match(/width="([^"]+)"/);
    const heightMatch = attributes.match(/height="([^"]+)"/);
    const width = widthMatch ? widthMatch[1] : '0';
    const height = heightMatch ? heightMatch[1] : '0';
    const hasViewBox = /viewBox="/.test(attributes);

    let cleanedAttributes = attributes.replace(/width="[^"]+"/, '').replace(/height="[^"]+"/, '');

    if (!hasViewBox && width !== '0' && height !== '0') {
      cleanedAttributes += ` viewBox="0 0 ${width} ${height}"`;
    }

    return processedSvg.replace(/<svg[^>]+>/, `<svg${cleanedAttributes}>`);
  }


  onMount(() => {
    const doodles: Doodle[] = [];
    for (let i = 0; i < DOODLE_COUNT; i++) {
      const originalSvg = doodleSources[Math.floor(Math.random() * doodleSources.length)];
      doodles.push({
        svg: processSvg(originalSvg), // Process the SVG here
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
        rotation: Math.random() * 60 - 30, // -30 to +30 degrees
      });
    }
    generatedDoodles = doodles;
  });
</script>

<div class="doodle-container" aria-hidden="true">
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
    z-index: 1; /* Lift doodles above parent background */
    pointer-events: none; /* Ensure it doesn't interfere with mouse events */
  }

  .doodle-item {
    position: absolute;
    will-change: transform;
    animation: fadeIn 1s ease-out;
    opacity: 0.4; /* Apply opacity to the wrapper */
    transition: opacity 0.3s ease;
  }

  [data-theme="dark"] .doodle-item {
    opacity: 0.2;
  }

  /* Style the SVGs themselves */
  :global(.doodle-item svg) {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Directly set the fill on the path, bypassing currentColor issues */
  :global(.doodle-item svg path) {
    fill: var(--color-primary-100);
  }

  [data-theme="dark"] :global(.doodle-item svg path) {
    fill: var(--color-primary-900);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>