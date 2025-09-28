<script lang="ts">
  export let trustpilot = { rating: 4.6, reviews: 6936 };
  export let google = { rating: 4.8, reviews: 5123 };
</script>

<div class="reviews-wrapper">
  <!-- Trustpilot -->
  <div class="review-item">
    <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon trustpilot-logo" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.39 7.26H22l-5.8 4.21L18.58 22 12 17.77 5.42 22l2.38-8.53L2 9.26h7.61z"/>
    </svg>
    <div class="review-details">
      <span class="review-name">Trustpilot</span>
      <div class="rating-line">
        <span class="review-rating">{trustpilot.rating}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.39 7.26H22l-5.8 4.21L18.58 22 12 17.77 5.42 22l2.38-8.53L2 9.26h7.61z"/>
        </svg>
        <span class="review-count">({trustpilot.reviews.toLocaleString()} reviews)</span>
      </div>
    </div>
  </div>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Google Reviews -->
  <div class="review-item">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" class="logo-icon google-logo">
      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c67.5 0 124.6 24.8 168.3 65.5l-68.2 65.5C322.5 111.5 288.3 96 248 96c-89.4 0-162 73.2-162 160s72.6 160 162 160c77.4 0 128.7-44.6 138.7-107.4H248v-85.2h240c2.3 13.4 3.3 27.1 3.3 42.4z"/>
    </svg>
    <div class="review-details">
      <span class="review-name">Google Reviews</span>
      <div class="rating-line">
        <span class="review-rating">{google.rating}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="star-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.39 7.26H22l-5.8 4.21L18.58 22 12 17.77 5.42 22l2.38-8.53L2 9.26h7.61z"/>
        </svg>
        <span class="review-count">({google.reviews.toLocaleString()} reviews)</span>
      </div>
    </div>
  </div>
</div>

<style>
  .reviews-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-6);
  }
  .review-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
  .review-details {
    display: flex;
    flex-direction: column;
  }
  .rating-line {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }
  .logo-icon {
    height: 1.5rem;
    width: 1.5rem;
    color: var(--color-text-secondary);
  }
  .trustpilot-logo {
    color: #00B67A;
  }
  .google-logo {
    fill: currentColor;
  }
  .review-name {
    font-weight: 600;
    color: var(--color-text-primary);
    font-size: 0.875rem;
  }
  .review-rating {
    font-weight: 700;
    color: var(--color-text-primary);
    font-size: 0.875rem;
  }
  .star-icon {
    height: 0.875rem;
    width: 0.875rem;
    color: #00B67A;
  }
  .review-count {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
  .divider {
    height: 2rem;
    width: 2px;
    background-color: var(--color-border-secondary);
    border-radius: 1px;
  }
</style>
