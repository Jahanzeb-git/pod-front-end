<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import DoodleBackground from './DoodleBackground.svelte';

  let activeStep = 0;
  let scrollProgress = 0;
  let sectionElement: HTMLElement;
  let observerTargets: HTMLElement[] = [];
  let intersectionObserver: IntersectionObserver | null = null;
  
  const steps = [
    {
      title: 'Describe Your Product',
      subtitle: 'Step 1',
      description: 'Tell our AI assistant exactly what you want. From a vintage-style band t-shirt to a branded mug for your startup, just describe your vision in natural language.',
      icon: '💭'
    },
    {
      title: 'Create with AI',
      subtitle: 'Step 2', 
      description: `Watch as our AI generates unique, stunning artwork tailored to your vision. Refine colors, adjust styles, and customize every detail until it's absolutely perfect.`,
      icon: '🎨'
    },
    {
      title: 'Confirm and Ship',
      subtitle: 'Step 3',
      description: 'Review your design on the actual product mockup. Once satisfied, place your order and we handle professional printing and worldwide shipping directly to your door.',
      icon: '📦'
    }
  ];

  const imageUrls = [
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=85',
    'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=1200&q=85',
    'https://images.unsplash.com/photo-1567113530751-4ffd0a09ad9c?w=1200&q=85'
  ];

  function setupIntersectionObserver() {
    if (!browser) return;

    const options = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: [0, 0.5, 1]
    };

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = observerTargets.indexOf(entry.target as HTMLElement);
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          activeStep = index;
        }
      });
    }, options);

    observerTargets.forEach(target => {
      if (target) intersectionObserver?.observe(target);
    });
  }

  function handleScroll() {
    if (!sectionElement || !browser) return;
    
    const rect = sectionElement.getBoundingClientRect();
    const sectionHeight = sectionElement.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    scrollProgress = Math.min(1, Math.max(0, scrolled / sectionHeight));
  }

  onMount(() => {
    if (browser) {
      setupIntersectionObserver();
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
  });

  onDestroy(() => {
    if (browser) {
      intersectionObserver?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<section id="how-it-works" class="how-section" bind:this={sectionElement}>
  <DoodleBackground count={20} />
  <div class="how-container">
    <div class="section-header">
      <span class="section-label">How It Works</span>
      <h2 class="section-title">From Idea to Reality in Three Simple Steps</h2>
      <p class="section-subtitle">
        Our AI-powered platform makes custom product creation effortless and accessible to everyone
      </p>
    </div>
  </div>
  <div class="content-wrapper">
    <!-- Mobile image card - visible only on mobile -->
    <div class="mobile-image-card">
      <div class="image-stack">
        {#each imageUrls as src, i}
          <img 
            {src} 
            alt="Step {i + 1} visualization"
            class:active={activeStep === i}
            loading="lazy"
          />
        {/each}
      </div>
    </div>

    <!-- Steps column -->
    <div class="steps-column">
      <div class="progress-indicator">
        <div class="progress-track">
          <div class="progress-fill" style="height: {scrollProgress * 100}%"></div>
        </div>
      </div>
      
      <div class="steps-wrapper">
        {#each steps as step, i}
          <article 
            class="step-card"
            class:active={activeStep === i}
            class:completed={i < activeStep}
            bind:this={observerTargets[i]}
          >
            <div class="step-indicator">
              <div class="step-icon">{step.icon}</div>
              <div class="step-connector" class:filled={i < activeStep}></div>
            </div>
            
            <div class="step-content">
              <span class="step-label">{step.subtitle}</span>
              <h3 class="step-title">{step.title}</h3>
              <p class="step-description">{step.description}</p>
            </div>
          </article>
        {/each}
      </div>
    </div>

    <!-- Sticky image column - hidden on mobile -->
    <div class="image-column">
      <div class="sticky-wrapper">
        <div class="image-frame">
          <div class="image-stack">
            {#each imageUrls as src, i}
              <img 
                {src} 
                alt="Step {i + 1} visualization"
                class:active={activeStep === i}
                loading="lazy"
              />
            {/each}
          </div>
          
          <!-- Step indicator overlay -->
          <div class="image-overlay">
            <span class="overlay-step">Step {activeStep + 1} of {steps.length}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .how-section {
    position: relative;
    padding: 6rem 0;
    min-height: 100vh;
    background: var(--color-bg-primary);
  }

  .how-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 5rem;
  }

  .section-label {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-primary-500);
    margin-bottom: 0.75rem;
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
  }

  .section-subtitle {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: start;
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Mobile image card - only visible on mobile */
  .mobile-image-card {
    display: none;
  }

  /* Steps Column */
  .steps-column {
    position: relative;
  }

  .progress-indicator {
    position: absolute;
    left: 1.5rem;
    top: 3rem;
    bottom: 3rem;
    width: 2px;
    display: none; /* Hidden by default, shown on desktop */
  }

  .progress-track {
    width: 100%;
    height: 100%;
    background: var(--color-border-primary);
    border-radius: 1px;
    position: relative;
    overflow: hidden;
  }

  .progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(180deg, var(--color-primary-500), var(--color-primary-600));
    border-radius: 1px;
    transition: height 0.3s ease-out;
  }

  .steps-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8rem;
  }

  .step-card {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    border-radius: var(--radius-2xl);
    background: var(--color-bg-primary);
    border: 2px solid transparent;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .step-card:hover {
    background: var(--color-bg-secondary);
    transform: translateX(4px);
  }

  .step-card.active {
    background: var(--color-bg-elevated);
    border-color: var(--color-border-primary);
    box-shadow: var(--shadow-lg);
  }

  .step-indicator {
    flex-shrink: 0;
    position: relative;
  }

  .step-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-xl);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .step-card.active .step-icon {
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
    transform: scale(1.1);
  }

  .step-connector {
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(8rem + 2px);
    background: var(--color-border-primary);
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .step-card:not(:last-child) .step-connector {
    opacity: 1;
  }

  .step-connector.filled {
    background: linear-gradient(180deg, var(--color-primary-500), var(--color-primary-600));
  }

  .step-content {
    flex: 1;
  }

  .step-label {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-tertiary);
    margin-bottom: 0.5rem;
  }

  .step-card.active .step-label {
    color: var(--color-primary-500);
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
    line-height: 1.2;
  }

  .step-description {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
  }

  /* Image Column */
  .image-column {
    position: relative;
    height: 100%;
  }

  .sticky-wrapper {
    position: sticky;
    top: 20vh;
    z-index: 1;
  }

  .image-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: var(--radius-3xl);
    overflow: hidden;
    background: var(--color-bg-tertiary);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-border-primary);
  }

  .image-stack {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-stack img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .image-stack img.active {
    opacity: 1;
  }

  .image-overlay {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--color-bg-glass);
    backdrop-filter: blur(12px);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border-primary);
  }

  .overlay-step {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    .content-wrapper {
      gap: 4rem;
    }

    .steps-wrapper {
      gap: 6rem;
    }

    .step-connector {
      height: calc(6rem + 2px);
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .how-section {
      padding: 4rem 0;
    }

    .how-container {
      padding: 0 1rem;
    }

    .section-header {
      margin-bottom: 3rem;
    }

    .content-wrapper {
      grid-template-columns: 1fr;
      gap: 0;
    }

    /* Show mobile image card */
    .mobile-image-card {
      display: block;
      margin-bottom: 3rem;
      position: sticky;
      top: 1rem;
      z-index: 1;
    }

    .mobile-image-card .image-frame {
      aspect-ratio: 16/10;
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    /* Hide desktop image column */
    .image-column {
      display: none;
    }

    .progress-indicator {
      display: none;
    }

    .steps-wrapper {
      gap: 3rem;
    }

    .step-card {
      padding: 1.5rem;
      gap: 1rem;
      flex-direction: column;
    }

    .step-connector {
      display: none;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
    }

    .step-title {
      font-size: 1.25rem;
    }

    .step-description {
      font-size: 0.9375rem;
    }
  }

  @media (max-width: 480px) {
    .how-section {
      padding: 3rem 0;
    }

    .section-title {
      font-size: 1.75rem;
    }

    .section-subtitle {
      font-size: 1rem;
    }
  }

  /* High-resolution displays */
  @media (min-width: 1440px) {
    .how-container {
      max-width: 1400px;
    }

    .content-wrapper {
      gap: 8rem;
    }
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>