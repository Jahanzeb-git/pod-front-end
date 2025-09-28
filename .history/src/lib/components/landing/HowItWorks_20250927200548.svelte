<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let activeStep = 0;
  const steps = [
    {
      title: '1. Describe Your Product',
      description: 'Tell our AI assistant exactly what you want. From a vintage-style band t-shirt to a branded mug for your startup, just say the word.',
    },
    {
      title: '2. Create with AI',
      description: 'Describe the design in your mind. Our AI will generate unique, stunning artwork tailored to your vision. Refine and customize until itâ€™s perfect.',
    },
    {
      title: '3. Confirm and Ship',
      description: 'Once you approve the final design, simply tell the AI to proceed. We handle the printing and shipping directly to your door.',
    },
  ];

  const imageUrls = [
    'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&q=80', // Step 1: Wireframes/sketches
    'https://images.unsplash.com/photo-1611601372094-07e9c837e247?w=800&q=80', // Step 2: Colorful design
    'https://images.unsplash.com/photo-1551803985-f3f76a1a72d7?w=800&q=80', // Step 3: Packaging
  ];

  // --- Scrollytelling Logic ---
  let stepElements: HTMLElement[] = [];

  function handleScroll() {
    if (!stepElements.length) return;

    let closestStep = 0;
    let minDistance = Infinity;

    const viewportCenter = window.innerHeight / 2;

    stepElements.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const distance = Math.abs(viewportCenter - elCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestStep = index;
      }
    });

    activeStep = closestStep;
  }

  onMount(() => {
    if (browser) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Run once on mount to set initial state

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  });

</script>

<section id="how-it-works" class="how-section">
  <div class="how-container">
    <div class="how-text-content">
      <h2 class="section-title">From Prompt to Product</h2>
      <div class="steps-wrapper">
        {#each steps as step, i}
          <div class="step-item" class:active={activeStep === i} class:passed={i < activeStep} bind:this={stepElements[i]}>
            <div class="step-header">
              <div class="step-number-wrapper">
                <div class="step-number">{i + 1}</div>
                {#if i < steps.length - 1}
                  <div class="connector-line"></div>
                {/if}
              </div>
              <h3>{step.title}</h3>
            </div>
            <p>{step.description}</p>
          </div>
        {/each}
      </div>
    </div>
    <div class="how-image-container">
      <div class="image-card">
        {#each imageUrls as src, i}
          <img {src} alt="Visual for step {i + 1}" class:visible={activeStep === i} />
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .how-section {
    padding: 8rem 2rem;
    background: transparent;
  }

  .how-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    position: relative;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 4rem;
    color: var(--color-text-primary);
  }

  .steps-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12rem; /* Large gap to create scrolling space */
  }

  .step-item {
    padding: 1rem;
    opacity: 0.4;
    transition: opacity 0.4s ease;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .step-number-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .step-number {
    width: 48px;
    height: 48px;
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    transition: all 0.4s ease;
    position: relative;
    z-index: 2;
  }

  .step-item.active .step-number {
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
    color: white;
    border-color: var(--color-primary-600);
  }

  .connector-line {
    position: absolute;
    top: 24px; /* Center of the number circle */
    left: 23px; /* Center of the number circle */
    width: 2px;
    height: calc(12rem + 2rem); /* Gap + padding */
    background-color: var(--color-border-primary);
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 0.4s ease;
    z-index: 1;
  }

  .step-item.passed .connector-line {
    transform: scaleY(1);
    background-color: var(--color-primary-500);
  }

  .step-item h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .step-item p {
    color: var(--color-text-secondary);
    line-height: 1.7;
    padding-left: calc(48px + 1.5rem); /* Align with text above */
  }

  .step-item.active {
    opacity: 1;
  }

  .how-image-container {
    position: sticky;
    top: 15vh;
    height: 70vh;
  }

  .image-card {
    width: 100%;
    height: 100%;
    border-radius: var(--radius-2xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-border-primary);
    position: relative; /* Stacking context for images */
  }

  .image-card img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .image-card img.visible {
    opacity: 1;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .how-container {
      grid-template-columns: 1fr;
    }

    .how-image-container {
      position: relative;
      top: 0;
      height: auto;
      aspect-ratio: 16 / 10;
      margin-top: 4rem;
    }

    .steps-wrapper {
      gap: 4rem;
    }
  }
</style>