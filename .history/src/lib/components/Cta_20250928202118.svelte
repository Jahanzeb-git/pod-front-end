<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import AppCard from '$lib/components/shared/AppCard.svelte';

  const dispatch = createEventDispatcher();

  let imagesLoaded = [false, false, false];
  let activeUsers = 247; // Dynamic number for psychological impact
  let slotsRemaining = 15; // Limited slots for urgency
  
  // Simulate real-time updates for social proof
  onMount(() => {
    // Stagger image animations with subtle timing
    setTimeout(() => imagesLoaded[0] = true, 200);
    setTimeout(() => imagesLoaded[1] = true, 400);
    setTimeout(() => imagesLoaded[2] = true, 600);
    
    // Occasionally update active users to show activity
    const interval = setInterval(() => {
      activeUsers = Math.floor(240 + Math.random() * 20);
    }, 5000);
    
    return () => clearInterval(interval);
  });

  function showCatalog() {
    dispatch('showCatalog');
  }
</script>

<AppCard>
  <section class="cta-container">
    <!-- Left: Professional image showcase -->
    <div class="image-showcase">
      <div class="image-wrapper image-1" class:loaded={imagesLoaded[0]}>
        <img 
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop" 
          alt="Custom printed t-shirt design" 
        />
      </div>
      <div class="image-wrapper image-2" class:loaded={imagesLoaded[1]}>
        <img 
          src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop" 
          alt="Custom printed mug design" 
        />
      </div>
      <div class="image-wrapper image-3" class:loaded={imagesLoaded[2]}>
        <img 
          src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=600&fit=crop" 
          alt="Custom printed tote bag" 
        />
      </div>
    </div>

    <!-- Right: Compelling content -->
    <div class="content-section">
      <div class="headline-wrapper">
        <h2 class="headline">
          <span class="headline-primary">Don't Just Buy Prints.</span>
          <span class="headline-accent">Create Yours.</span>
        </h2>
        <p class="subheadline">
          Skip generic fashion. With our AI, you make designs no one else owns — 100% unique to you.
        </p>
      </div>

      <!-- Social Proof Section -->
      <div class="social-proof-section">
        <div class="trust-indicators">
          <div class="trust-item">
            <svg class="trust-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.39 9.26H22L15.81 13.47L18.18 20.73L12 16.52L5.82 20.73L8.19 13.47L2 9.26H9.61L12 2Z" fill="currentColor"/>
            </svg>
            <div class="trust-content">
              <span class="trust-label">Trustpilot</span>
              <span class="trust-rating">4.9/5 (2,847 reviews)</span>
            </div>
          </div>
          
          <div class="trust-divider"></div>
          
          <div class="trust-item">
            <svg class="trust-icon google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
            </svg>
            <div class="trust-content">
              <span class="trust-label">Google Reviews</span>
              <span class="trust-rating">4.8/5 (1,923 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FOMO & Urgency Section -->
      <div class="urgency-section">
        <div class="live-indicator">
          <span class="pulse-dot"></span>
          <span class="live-text">{activeUsers} people designing right now</span>
        </div>
        
        <div class="scarcity-alert">
          <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
          </svg>
          <span class="scarcity-text">Only <strong>{slotsRemaining}</strong> AI design slots left today</span>
        </div>
        
        <div class="guarantee-badge">
          <svg class="guarantee-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>30-day money-back guarantee</span>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <button class="cta-button" on:click={showCatalog}>
          Continue With Our Catalog
        </button>
        <button class="cta-secondary" on:click={() => dispatch('startWithAI')}>
          Or start with AI prompts instead
        </button>
      </div>
    </div>
  </section>
</AppCard>

<style>
  .cta-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-10);
    height: 100%;
    padding: var(--spacing-6) var(--spacing-4);
  }

  /* Image Showcase Section - Exact Layout from Reference */
  .image-showcase {
    position: relative;
    width: 45%;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-wrapper {
    position: absolute;
    border-radius: var(--radius-2xl);
    overflow: hidden;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .image-wrapper.loaded {
    opacity: 1;
  }

  .image-wrapper img {
    object-fit: cover;
    display: block;
    width: 100%;
    height: 100%;
  }

  /* First image - Woman with t-shirt (top left) */
  .image-1 {
    width: 260px;
    height: 320px;
    top: 0;
    left: 0;
    z-index: 2;
    transform: translateY(20px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .image-1.loaded {
    transform: translateY(0);
  }

  /* Second image - Mug (top right, overlapping) */
  .image-2 {
    width: 240px;
    height: 240px;
    top: 20px;
    right: 20px;
    z-index: 3;
    transform: translateY(20px);
    transition-delay: 0.15s;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }

  .image-2.loaded {
    transform: translateY(0);
  }

  /* Third image - Person with tote bag (bottom, overlapping both) */
  .image-3 {
    width: 220px;
    height: 280px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    z-index: 4;
    transition-delay: 0.3s;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  }

  .image-3.loaded {
    transform: translateX(-50%) translateY(0);
  }

  /* Content Section */
  .content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    max-width: 600px;
  }

  .headline-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .headline {
    font-size: 2.75rem;
    font-weight: 800;
    line-height: 1.1;
    font-family: var(--font-family-heading);
    margin: 0;
  }

  .headline-primary {
    color: var(--color-text-primary);
    display: block;
  }

  .headline-accent {
    color: var(--color-primary-600);
    display: block;
  }

  .subheadline {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin: 0;
  }

  /* Social Proof Section */
  .social-proof-section {
    padding: var(--spacing-4);
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-border-primary);
  }

  .trust-indicators {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    flex: 1;
  }

  .trust-icon {
    width: 24px;
    height: 24px;
    color: #00b67a; /* Trustpilot green */
    flex-shrink: 0;
  }

  .google-icon {
    color: var(--color-text-secondary);
  }

  .trust-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .trust-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .trust-rating {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
  }

  .trust-divider {
    width: 1px;
    height: 32px;
    background: var(--color-border-primary);
    margin: 0 var(--spacing-2);
  }

  /* Urgency Section */
  .urgency-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    background: var(--color-success-500);
    border-radius: 50%;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .live-text {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .scarcity-alert {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-4);
    background: var(--color-warning-50);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-warning-500);
  }

  [data-theme="dark"] .scarcity-alert {
    background: rgb(245 158 11 / 0.1);
    border-color: rgb(245 158 11 / 0.3);
  }

  .alert-icon {
    width: 20px;
    height: 20px;
    color: var(--color-warning-600);
    flex-shrink: 0;
  }

  .scarcity-text {
    font-size: 0.875rem;
    color: var(--color-warning-600);
  }

  .scarcity-text strong {
    font-weight: 700;
  }

  .guarantee-badge {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .guarantee-icon {
    width: 16px;
    height: 16px;
    color: var(--color-success-600);
  }

  /* CTA Section */
  .cta-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-top: var(--spacing-2);
  }

  .cta-button {
    padding: var(--spacing-4) var(--spacing-8);
    background: var(--color-text-primary);
    color: var(--color-bg-primary);
    border: 2px solid transparent;
    border-radius: var(--radius-xl);
    font-size: 1rem;
    font-weight: 600;
    font-family: var(--font-family-sans);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  [data-theme="dark"] .cta-button {
    background: var(--color-secondary-100);
    color: var(--color-secondary-900);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .cta-button:active {
    transform: translateY(0);
  }

  .cta-secondary {
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    cursor: pointer;
    padding: var(--spacing-2);
    transition: color 0.2s ease;
    font-family: var(--font-family-sans);
  }

  .cta-secondary:hover {
    color: var(--color-text-secondary);
    text-decoration: underline;
  }

  /* Responsive Design */
  @media (max-width: 1280px) {
    .cta-container {
      gap: var(--spacing-8);
    }

    .headline {
      font-size: 2.25rem;
    }
  }

  @media (max-width: 1024px) {
    .cta-container {
      flex-direction: column;
      text-align: center;
      gap: var(--spacing-6);
      padding: var(--spacing-4);
    }

    .image-showcase {
      width: 100%;
      max-width: 500px;
      height: 350px;
      margin: 0 auto;
    }

    .image-1 {
      width: 200px;
      height: 250px;
      top: 0;
      left: 10px;
    }

    .image-2 {
      width: 180px;
      height: 180px;
      top: 20px;
      right: 30px;
    }

    .image-3 {
      width: 170px;
      height: 220px;
      bottom: 0;
    }

    .content-section {
      align-items: center;
      max-width: 100%;
    }

    .headline-wrapper {
      align-items: center;
    }

    .cta-section {
      align-items: center;
      width: 100%;
    }

    .cta-button {
      width: 100%;
      max-width: 320px;
    }

    .trust-indicators {
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .trust-divider {
      width: 80%;
      height: 1px;
      margin: 0;
    }

    .trust-item {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .headline {
      font-size: 1.875rem;
    }

    .subheadline {
      font-size: 1rem;
    }

    .image-showcase {
      height: 280px;
      max-width: 400px;
    }

    .image-1 {
      width: 160px;
      height: 200px;
      left: 0;
    }

    .image-2 {
      width: 140px;
      height: 140px;
      right: 20px;
    }

    .image-3 {
      width: 130px;
      height: 170px;
    }
  }

  @media (max-width: 480px) {
    .cta-container {
      padding: var(--spacing-2);
    }

    .headline {
      font-size: 1.5rem;
    }

    .subheadline {
      font-size: 0.875rem;
    }

    .image-showcase {
      height: 220px;
      max-width: 320px;
    }

    .image-1 {
      width: 120px;
      height: 150px;
    }

    .image-2 {
      width: 100px;
      height: 100px;
      right: 10px;
    }

    .image-3 {
      width: 95px;
      height: 125px;
    }

    .cta-button {
      font-size: 0.875rem;
      padding: var(--spacing-3) var(--spacing-6);
    }
  }
</style>