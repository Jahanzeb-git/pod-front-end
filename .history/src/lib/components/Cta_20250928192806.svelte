<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import AppCard from '$lib/components/shared/AppCard.svelte';

  const dispatch = createEventDispatcher();

  // In case you want dynamic reviews later
  const trustpilotRating = 4.5;
  const googleRating = 4.5;

  function showCatalog() {
    dispatch('showCatalog');
  }
</script>

<AppCard>
  <section class="cta-container">
    <!-- Left collage images -->
    <div class="cta-images">
      <img src="https://picsum.photos/seed/cta1/280/400" alt="Custom design example 1" class="img-1" />
      <img src="https://picsum.photos/seed/cta2/280/400" alt="Custom design example 2" class="img-2" />
      <img src="https://picsum.photos/seed/cta3/280/400" alt="Custom design example 3" class="img-3" />
    </div>

    <!-- Right content -->
    <div class="cta-content">
      <h2 class="gradient-text">Turn Your Ideas Into Wearable Art ✨</h2>
      <p class="text-secondary">
        AI-powered custom printing — design unique fashion and home goods in seconds, shipped to your door.
      </p>

      <!-- Reviews section -->
      <div class="reviews">
        <div class="review-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="review-logo trustpilot-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.39 7.26H22l-5.8 4.21L18.58 22 12 17.77 5.42 22l2.38-8.53L2 9.26h7.61z"/>
          </svg>
          <div>
            <p class="review-title">Trustpilot</p>
            <p class="review-score">({trustpilotRating})</p>
          </div>
        </div>
        <div class="review-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" class="review-logo google-logo">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c67.5 0 124.6 24.8 168.3 65.5l-68.2 65.5C322.5 111.5 288.3 96 248 96c-89.4 0-162 73.2-162 160s72.6 160 162 160c77.4 0 128.7-44.6 138.7-107.4H248v-85.2h240c2.3 13.4 3.3 27.1 3.3 42.4z"/>
          </svg>
          <div>
            <p class="review-title">Google Reviews</p>
            <p class="review-score">({googleRating})</p>
          </div>
        </div>
      </div>

      <!-- Social proof + FOMO -->
      <p class="text-tertiary social-proof">🔥 1,000+ designs created this week</p>
      <p class="text-warning fomo-text">⚡ Only 500 AI slots left this month</p>

      <!-- Call to action -->
      <button class="cta-button" on:click={showCatalog}>🎨 Continue With Our Catalog</button>
    </div>
  </section>
</AppCard>

<style>
  .cta-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-8);
    height: 100%;
    animation: fadeInUp 0.6s ease;
  }

  /* Left collage */
  .cta-images {
    position: relative;
    width: 45%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cta-images img {
    width: 180px;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    object-fit: cover;
    border: 4px solid var(--color-bg-primary);
  }
  .img-1 {
    position: relative;
    z-index: 3;
    transform: rotate(-8deg) translate(20px, -20px);
  }
  .img-2 {
    position: absolute;
    z-index: 2;
    transform: rotate(4deg) translate(-40px, 30px);
  }
  .img-3 {
    position: absolute;
    z-index: 1;
    transform: rotate(12deg) translate(50px, 60px);
  }

  /* Right column */
  .cta-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .gradient-text {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    padding-bottom: 0.2rem;
  }

  .text-secondary {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    max-width: 90%;
  }

  .text-tertiary {
    color: var(--color-text-tertiary);
  }
  
  .social-proof {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .text-warning {
    color: var(--color-warning-500);
    font-weight: 600;
    font-size: 0.875rem;
  }

  /* Reviews */
  .reviews {
    display: flex;
    gap: var(--spacing-6);
    margin-top: var(--spacing-2);
  }
  .review-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
  }
  .review-logo {
    width: 20px;
    height: 20px;
  }
  .trustpilot-logo {
    color: #00B67A;
  }
  .google-logo {
    color: var(--color-text-secondary);
  }
  .review-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  .review-score {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .cta-button {
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    color: white;
    border: none;
    padding: var(--spacing-3) var(--spacing-6);
    border-radius: var(--radius-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: var(--spacing-2);
    align-self: flex-start;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .cta-images {
      display: none;
    }
    .cta-content {
      align-items: center;
      text-align: center;
    }
    .text-secondary {
      max-width: 100%;
    }
    .cta-button {
      align-self: center;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
