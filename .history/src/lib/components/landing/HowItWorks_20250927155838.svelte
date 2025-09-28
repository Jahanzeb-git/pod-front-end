<script lang="ts">
  import DoodleBackground from '$lib/components/landing/DoodleBackground.svelte';
</script>

<section id="how-it-works" class="how-section">
  <DoodleBackground count={12} />
  <div class="section-container">
    <div class="how-content">
      <div class="how-image">
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600" 
          alt="Design process"
        />
      </div>
      <div class="how-text">
        <h2 class="section-title">How It Works</h2>
        <div class="how-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Choose Your Product</h3>
              <p>Browse our catalog of high-quality products ready for customization</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Design with AI</h3>
              <p>Use our AI tools to create unique designs or upload your own artwork</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>We Print & Ship</h3>
              <p>Your order is printed on-demand and shipped directly to your door</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .how-section {
    position: relative; /* Needed for z-index context */
    padding: 6rem 2rem;
    background: transparent;
    overflow: hidden; /* Contain the doodles */
  }
  
  .section-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative; /* Ensure content is above doodles */
    z-index: 2;
  }
  
  .how-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  
  .how-image img {
    width: 100%;
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-xl);
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: var(--color-text-primary);
  }
  
  .how-steps {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .step {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }
  
  .step-number {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
  }
  
  .step-content h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }
  
  .step-content p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  @media (max-width: 1024px) {
    .how-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
  }
</style>