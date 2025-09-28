<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { spring } from 'svelte/motion';

  let activeStep = 0;
  let scrollProgress = 0;
  let sectionRef: HTMLElement;
  let containerRef: HTMLElement;
  let isMobile = false;
  
  // Spring animations for smooth transitions
  const imageScale = spring(1, { stiffness: 0.1, damping: 0.25 });
  const imageRotation = spring(0, { stiffness: 0.1, damping: 0.25 });
  
  const steps = [
    {
      number: '01',
      title: 'Describe Your Vision',
      subtitle: 'Tell our AI what you want',
      description: 'Share your ideas with our AI assistant. Whether it\'s a vintage band tee or branded merch for your startup, just describe your vision in natural language.',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
      </svg>`,
      products: [
        { type: 't-shirt', x: 45, y: 20, scale: 1.2, rotation: -15, delay: 0 },
        { type: 'hoodie', x: 65, y: 35, scale: 1, rotation: 10, delay: 0.1 },
        { type: 'mug', x: 25, y: 45, scale: 0.9, rotation: -5, delay: 0.2 },
        { type: 'poster', x: 75, y: 60, scale: 1.1, rotation: 12, delay: 0.15 },
        { type: 'cap', x: 35, y: 70, scale: 0.95, rotation: -8, delay: 0.25 }
      ]
    },
    {
      number: '02',
      title: 'AI Creates Your Design',
      subtitle: 'Watch magic happen',
      description: 'Our advanced AI generates unique, stunning artwork tailored to your specifications. Iterate and refine in real-time until it matches your perfect vision.',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>`,
      products: [
        { type: 'phone', x: 30, y: 25, scale: 1.1, rotation: 8, delay: 0 },
        { type: 'tote', x: 60, y: 30, scale: 1.2, rotation: -12, delay: 0.1 },
        { type: 'notebook', x: 40, y: 55, scale: 0.95, rotation: 15, delay: 0.2 },
        { type: 'sticker', x: 70, y: 50, scale: 0.85, rotation: -20, delay: 0.15 },
        { type: 'pillow', x: 50, y: 75, scale: 1.05, rotation: 5, delay: 0.25 }
      ]
    },
    {
      number: '03',
      title: 'We Handle Everything',
      subtitle: 'From print to delivery',
      description: 'Once you approve, we take care of the rest. Professional printing, quality control, packaging, and worldwide shipping - all handled seamlessly.',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8l5 3-5 3V8z"/>
        <path d="M1 18h15"/>
      </svg>`,
      products: [
        { type: 'package', x: 50, y: 35, scale: 1.3, rotation: 0, delay: 0 },
        { type: 'truck', x: 25, y: 60, scale: 0.9, rotation: -5, delay: 0.2 },
        { type: 'world', x: 75, y: 65, scale: 1, rotation: 10, delay: 0.3 },
        { type: 'quality', x: 35, y: 30, scale: 0.85, rotation: -15, delay: 0.1 },
        { type: 'check', x: 65, y: 45, scale: 0.95, rotation: 8, delay: 0.25 }
      ]
    }
  ];

  // Product SVG components (simplified representations)
  const productSVGs: Record<string, string> = {
    't-shirt': `<svg viewBox="0 0 100 100"><path d="M25 30 L35 20 Q50 15 65 20 L75 30 L75 40 L65 35 L65 80 L35 80 L35 35 L25 40 Z" fill="currentColor"/></svg>`,
    'hoodie': `<svg viewBox="0 0 100 100"><path d="M30 35 L35 25 Q50 20 65 25 L70 35 L70 45 L65 40 L65 85 L35 85 L35 40 L30 45 Z M42 30 Q50 28 58 30 L58 45 Q50 47 42 45 Z" fill="currentColor"/></svg>`,
    'mug': `<svg viewBox="0 0 100 100"><rect x="30" y="35" width="35" height="40" rx="3" fill="currentColor"/><path d="M65 45 Q75 45 75 55 Q75 65 65 65" stroke="currentColor" stroke-width="3" fill="none"/></svg>`,
    'poster': `<svg viewBox="0 0 100 100"><rect x="25" y="20" width="50" height="65" rx="2" fill="currentColor"/><rect x="30" y="25" width="40" height="30" fill="var(--color-bg-primary)" opacity="0.5"/></svg>`,
    'cap': `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="30" ry="15" fill="currentColor"/><path d="M20 55 Q20 45 50 45 Q80 45 80 55 L75 50 Q50 48 25 50 Z" fill="currentColor"/><path d="M35 55 Q35 65 25 70" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
    'phone': `<svg viewBox="0 0 100 100"><rect x="35" y="20" width="30" height="60" rx="5" fill="currentColor"/><circle cx="50" cy="75" r="3" fill="var(--color-bg-primary)"/><rect x="40" y="30" width="20" height="35" fill="var(--color-bg-primary)" opacity="0.3"/></svg>`,
    'tote': `<svg viewBox="0 0 100 100"><path d="M30 40 L30 80 L70 80 L70 40 M40 40 Q40 25 50 25 Q60 25 60 40" stroke="currentColor" stroke-width="3" fill="none"/><rect x="30" y="40" width="40" height="40" fill="currentColor"/></svg>`,
    'notebook': `<svg viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="60" rx="2" fill="currentColor"/><rect x="25" y="30" width="5" height="5" fill="currentColor"/><rect x="25" y="45" width="5" height="5" fill="currentColor"/><rect x="25" y="60" width="5" height="5" fill="currentColor"/></svg>`,
    'sticker': `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="currentColor"/><path d="M65 65 L75 75 L65 75 Z" fill="var(--color-bg-primary)" opacity="0.5"/></svg>`,
    'pillow': `<svg viewBox="0 0 100 100"><rect x="25" y="35" width="50" height="30" rx="15" fill="currentColor"/></svg>`,
    'package': `<svg viewBox="0 0 100 100"><path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z M25 35 L50 50 L75 35 M50 50 L50 80" stroke="currentColor" stroke-width="2" fill="none"/><rect x="25" y="35" width="50" height="30" fill="currentColor" opacity="0.3"/></svg>`,
    'truck': `<svg viewBox="0 0 100 100"><rect x="20" y="40" width="40" height="25" fill="currentColor"/><rect x="60" y="45" width="15" height="20" fill="currentColor"/><circle cx="35" cy="70" r="5" fill="var(--color-text-primary)"/><circle cx="65" cy="70" r="5" fill="var(--color-text-primary)"/></svg>`,
    'world': `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="2" fill="none"/><ellipse cx="50" cy="50" rx="25" ry="12" stroke="currentColor" stroke-width="1" fill="none"/><path d="M25 50 Q50 35 75 50" stroke="currentColor" stroke-width="1" fill="none"/></svg>`,
    'quality': `<svg viewBox="0 0 100 100"><path d="M50 25 L60 45 L80 45 L65 60 L70 80 L50 65 L30 80 L35 60 L20 45 L40 45 Z" fill="currentColor"/></svg>`,
    'check': `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="3" fill="none"/><path d="M35 50 L45 60 L65 40" stroke="currentColor" stroke-width="3" fill="none"/></svg>`
  };

  let observer: IntersectionObserver;

  function calculateProgress() {
    if (!sectionRef || !browser) return;
    
    const rect = sectionRef.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress through the section
    const scrolled = -rect.top;
    const totalScroll = sectionHeight - viewportHeight;
    
    scrollProgress = Math.max(0, Math.min(1, scrolled / totalScroll));
    
    // Determine active step based on scroll progress
    const stepProgress = scrollProgress * (steps.length - 0.5);
    activeStep = Math.min(steps.length - 1, Math.floor(stepProgress + 0.5));
    
    // Update spring animations
    $imageScale = 0.9 + (0.1 * Math.sin(scrollProgress * Math.PI * 2));
    $imageRotation = Math.sin(scrollProgress * Math.PI * 4) * 2;
  }

  function handleResize() {
    if (browser) {
      isMobile = window.innerWidth < 768;
      calculateProgress();
    }
  }

  onMount(() => {
    if (browser) {
      handleResize();
      window.addEventListener('scroll', calculateProgress, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });
      
      // Intersection observer for step animations
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.3, rootMargin: '-10% 0px' }
      );
      
      // Observe all step items
      const stepItems = document.querySelectorAll('.step-content');
      stepItems.forEach(item => observer.observe(item));
      
      calculateProgress();
      
      return () => {
        window.removeEventListener('scroll', calculateProgress);
        window.removeEventListener('resize', handleResize);
        if (observer) observer.disconnect();
      };
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    }
  });
</script>

<section id="how-it-works" class="how-section" bind:this={sectionRef}>
  <div class="how-container" bind:this={containerRef}>
    <!-- Section Header -->
    <div class="section-header">
      <span class="section-label">How It Works</span>
      <h2 class="section-title">
        <span class="gradient-text">Three Simple Steps</span>
        <br />
        <span>to Your Perfect Product</span>
      </h2>
      <p class="section-subtitle">
        From idea to doorstep in days, not weeks. Our AI-powered platform makes custom printing effortless.
      </p>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Steps Column -->
      <div class="steps-column">
        {#each steps as step, i}
          <div 
            class="step-wrapper"
            class:active={activeStep === i}
            class:completed={i < activeStep}
          >
            <!-- Progress Connector -->
            {#if i < steps.length - 1}
              <div 
                class="progress-connector"
                style="transform: scaleY({i < activeStep ? 1 : 0})"
              />
            {/if}
            
            <!-- Step Content -->
            <div class="step-content">
              <div class="step-indicator">
                <div class="step-icon">
                  {@html step.icon}
                </div>
                <span class="step-number">{step.number}</span>
              </div>
              
              <div class="step-text">
                <h3 class="step-title">{step.title}</h3>
                <span class="step-subtitle">{step.subtitle}</span>
                <p class="step-description">{step.description}</p>
                
                {#if i === activeStep}
                  <div class="step-cta">
                    <span class="cta-arrow">→</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Visual Column -->
      <div class="visual-column">
        <div class="visual-sticky-container">
          <div 
            class="visual-canvas"
            style="transform: scale({$imageScale}) rotate({$imageRotation}deg)"
          >
            <!-- Background Glow -->
            <div class="canvas-glow" />
            
            <!-- Product Catalog Display -->
            {#each steps as step, stepIndex}
              {#if stepIndex === activeStep}
                <div class="product-showcase">
                  {#each step.products as product}
                    <div 
                      class="product-item"
                      style="
                        left: {product.x}%;
                        top: {product.y}%;
                        transform: scale({product.scale}) rotate({product.rotation}deg);
                        animation-delay: {product.delay}s;
                      "
                    >
                      <div class="product-shadow" />
                      <div class="product-icon">
                        {@html productSVGs[product.type]}
                      </div>
                      {#if !isMobile}
                        <div class="product-pulse" />
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
            {/each}
            
            <!-- Center Badge -->
            <div class="center-badge">
              <span>Step</span>
              <strong>{activeStep + 1}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Carousel (for small screens) -->
    {#if isMobile}
      <div class="mobile-carousel">
        <div class="carousel-track" style="transform: translateX(-{activeStep * 100}%)">
          {#each steps as step, i}
            <div class="carousel-slide">
              <div class="mobile-visual">
                <div class="mobile-product-grid">
                  {#each step.products.slice(0, 3) as product}
                    <div class="mobile-product">
                      {@html productSVGs[product.type]}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
        <div class="carousel-dots">
          {#each steps as _, i}
            <button 
              class="dot"
              class:active={i === activeStep}
              on:click={() => activeStep = i}
            />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .how-section {
    position: relative;
    padding: 6rem 0;
    min-height: 200vh; /* Ensure enough scroll space */
    background: var(--color-bg-primary);
  }

  .how-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: 5rem;
    animation: fadeInUp 0.8s ease-out;
  }

  .section-label {
    display: inline-block;
    padding: 0.5rem 1.25rem;
    background: var(--color-primary-50);
    color: var(--color-primary-600);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
  }

  [data-theme="dark"] .section-label {
    background: rgba(225, 29, 72, 0.15);
    color: var(--color-primary-400);
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
  }

  .section-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: start;
    min-height: 100vh;
  }

  /* Steps Column */
  .steps-column {
    padding-top: 4rem;
  }

  .step-wrapper {
    position: relative;
    margin-bottom: 8rem;
    opacity: 0;
    transform: translateX(-30px);
    animation: slideInLeft 0.6s ease-out forwards;
    animation-delay: calc(var(--index, 0) * 0.1s);
  }

  .step-wrapper.in-view {
    opacity: 1;
    transform: translateX(0);
  }

  .progress-connector {
    position: absolute;
    left: 2rem;
    top: 4rem;
    width: 3px;
    height: calc(8rem + 2rem);
    background: linear-gradient(180deg, var(--color-primary-500), var(--color-primary-400));
    transform-origin: top;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  .step-content {
    position: relative;
    display: flex;
    gap: 2rem;
    padding: 2rem;
    border-radius: var(--radius-2xl);
    background: var(--color-bg-elevated);
    border: 2px solid transparent;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .step-wrapper.active .step-content {
    border-color: var(--color-primary-200);
    background: linear-gradient(135deg, var(--color-bg-elevated), var(--color-primary-50));
    box-shadow: 0 20px 40px rgba(225, 29, 72, 0.1);
    transform: scale(1.02);
  }

  [data-theme="dark"] .step-wrapper.active .step-content {
    background: linear-gradient(135deg, var(--color-bg-elevated), rgba(225, 29, 72, 0.05));
    border-color: rgba(225, 29, 72, 0.3);
  }

  .step-indicator {
    flex-shrink: 0;
    position: relative;
    width: 64px;
    height: 64px;
  }

  .step-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-primary);
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-xl);
    color: var(--color-text-tertiary);
    transition: all 0.4s ease;
  }

  .step-icon svg {
    width: 28px;
    height: 28px;
  }

  .step-wrapper.active .step-icon {
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
    border-color: var(--color-primary-600);
    color: white;
    box-shadow: 0 8px 24px rgba(225, 29, 72, 0.3);
  }

  .step-number {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--color-bg-primary);
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-full);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  .step-wrapper.active .step-number {
    background: var(--color-accent-500);
    border-color: var(--color-accent-600);
    color: white;
  }

  .step-text {
    flex: 1;
  }

  .step-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
    transition: color 0.3s ease;
  }

  .step-wrapper.active .step-title {
    color: var(--color-primary-600);
  }

  .step-subtitle {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .step-description {
    color: var(--color-text-secondary);
    line-height: 1.7;
    font-size: 1rem;
  }

  .step-cta {
    margin-top: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-primary-600);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .cta-arrow {
    display: inline-block;
    animation: arrowBounce 1.5s ease-in-out infinite;
  }

  @keyframes arrowBounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(6px); }
  }

  /* Visual Column */
  .visual-column {
    position: sticky;
    top: 50%;
    transform: translateY(-50%);
    height: 70vh;
    min-height: 500px;
    padding-top: 4rem;
  }

  .visual-sticky-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .visual-canvas {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 500px;
    max-height: 500px;
    border-radius: var(--radius-3xl);
    background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
    box-shadow: 
      0 50px 100px -20px rgba(0, 0, 0, 0.1),
      0 30px 60px -30px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: visible;
  }

  [data-theme="dark"] .visual-canvas {
    background: linear-gradient(135deg, var(--color-bg-elevated), var(--color-bg-tertiary));
  }

  .canvas-glow {
    position: absolute;
    inset: -50px;
    background: radial-gradient(
      circle at center,
      rgba(225, 29, 72, 0.1),
      transparent 70%
    );
    filter: blur(40px);
    pointer-events: none;
  }

  /* Product Showcase */
  .product-showcase {
    position: absolute;
    inset: 0;
    animation: fadeIn 0.6s ease-out;
  }

  .product-item {
    position: absolute;
    transform-origin: center;
    animation: productFloat 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    pointer-events: none;
  }

  @keyframes productFloat {
    from {
      opacity: 0;
      transform: scale(0) rotate(0deg);
    }
    to {
      opacity: 1;
      transform: scale(var(--scale, 1)) rotate(var(--rotation, 0deg));
    }
  }

  .product-shadow {
    position: absolute;
    inset: 10px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.1),
      transparent 60%
    );
    filter: blur(20px);
    transform: translateY(10px);
  }

  .product-icon {
    position: relative;
    width: 80px;
    height: 80px;
    background: var(--color-bg-elevated);
    border-radius: var(--radius-2xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary-500);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .product-icon svg {
    width: 50px;
    height: 50px;
  }

  .product-pulse {
    position: absolute;
    inset: -20px;
    border: 2px solid var(--color-primary-400);
    border-radius: var(--radius-2xl);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }

  /* Center Badge */
  .center-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-bg-elevated);
    border: 3px solid var(--color-primary-500);
    border-radius: var(--radius-full);
    padding: 0.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .center-badge span {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-tertiary);
  }

  .center-badge strong {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary-600);
  }

  /* Mobile Styles */
  .mobile-carousel {
    display: none;
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .visual-column {
      position: relative;
      top: 0;
      transform: none;
      height: 50vh;
      min-height: 400px;
      padding-top: 0;
      margin-bottom: 3rem;
    }

    .step-wrapper {
      margin-bottom: 4rem;
    }

    .progress-connector {
      height: calc(4rem + 2rem);
    }
  }

  @media (max-width: 768px) {
    .how-section {
      min-height: auto;
      padding: 4rem 0;
    }

    .section-header {
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .visual-column {
      display: none;
    }

    .mobile-carousel {
      display: block;
      position: relative;
      width: 100%;
      height: 300px;
      margin-bottom: 2rem;
      overflow: hidden;
      border-radius: var(--radius-2xl);
      background: linear-gradient(135deg, var(--color-bg-tertiary), var(--color-bg-secondary));
    }

    .carousel-track {
      display: flex;
      height: 100%;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .carousel-slide {
      width: 100%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .mobile-visual {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-product-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      width: 100%;
      max-width: 280px;
    }

    .mobile-product {
      width: 70px;
      height: 70px;
      background: var(--color-bg-elevated);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary-500);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: scaleIn 0.5s ease-out forwards;
      animation-delay: calc(var(--index, 0) * 0.1s);
    }

    .mobile-product svg {
      width: 40px;
      height: 40px;
    }

    .carousel-dots {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-border-primary);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot.active {
      width: 24px;
      border-radius: 4px;
      background: var(--color-primary-500);
    }

    .step-wrapper {
      animation: none;
      opacity: 1;
      transform: none;
    }

    .step-content {
      flex-direction: column;
      padding: 1.5rem;
    }

    .step-title {
      font-size: 1.25rem;
    }

    .progress-connector {
      display: none;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>