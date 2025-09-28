<script lang="ts">
  import { onMount } from 'svelte';

  // --- Configuration ---
  const DOODLE_COUNT = 20;
  const MIN_SIZE = 60;
  const MAX_SIZE = 140;

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
   * Processes an SVG string to make it scalable.
   * This is the key function to fix the rendering issue.
   */
  function makeSvgScalable(svgString: string): string {
    // Use a regular expression to find the opening <svg> tag and capture its attributes.
    const svgTagMatch = svgString.match(/<svg([^>]+)>/);
    if (!svgTagMatch) {
      return svgString; // Return original if no <svg> tag is found
    }

    const attributesString = svgTagMatch[1];

    // Don't modify SVGs that already have a viewBox
    if (attributesString.includes('viewBox')) {
      return svgString;
    }

    // Robustly find width and height, ignoring case and handling single/double quotes
    const widthMatch = attributesString.match(/width=["'](\d+(\.\d+)?)["']/i);
    const heightMatch = attributesString.match(/height=["'](\d+(\.\d+)?)["']/i);

    if (widthMatch && heightMatch) {
      const width = widthMatch[1];
      const height = heightMatch[1];
      const viewBox = `viewBox="0 0 ${width} ${height}"`;

      // Remove the original width and height attributes to allow CSS to control the size
      const cleanedAttributes = attributesString
        .replace(/width=["']\d+(\.\d+)?["']/i, '')
        .replace(/height=["']\d+(\.\d+)?["']/i, '');

      // Add the new viewBox attribute
      const newAttributes = `${cleanedAttributes} ${viewBox}`;
      
      // Reconstruct the SVG tag
      return svgString.replace(svgTagMatch[0], `<svg${newAttributes}>`);
    }

    // Return the original string if width/height weren't found
    return svgString;
  }

  onMount(() => {
    const doodles: Doodle[] = [];
    for (let i = 0; i < DOODLE_COUNT; i++) {
      const originalSvg = doodleSources[Math.floor(Math.random() * doodleSources.length)];
      doodles.push({
        svg: makeSvgScalable(originalSvg), // Process the SVG here
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
        rotation: Math.random() * 60 - 30,
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
    z-index: 1;
    pointer-events: none;
  }

  .doodle-item {
    position: absolute;
    will-change: transform;
    animation: fadeIn 0.8s ease-out;
    opacity: 0.4; /* Increased opacity for better visibility */
  }

  [data-theme="dark"] .doodle-item {
    opacity: 1; /* Increased opacity for better visibility */
  }

  :global(.doodle-item svg) {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Directly set the fill on the path, as diagnosed by your mentor */
  :global(.doodle-item svg path) {
    fill: var(--color-border-secondary); /* Use a more visible, but still subtle, color */
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
      /* Use the final opacity from the class definition */
      opacity: initial; 
      transform: scale(1);
    }
  }
</style>