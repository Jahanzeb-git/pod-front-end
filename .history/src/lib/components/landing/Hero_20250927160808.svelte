<script lang="ts">
  import AuthForm from '../auth/AuthForm.svelte';
  import DoodleBackground from './DoodleBackground.svelte';

  export let email: string;
  export let loading: boolean;
  export let error: string;
  export let emailSent: boolean;
  export let hasRefreshToken: boolean;
</script>

<section class="hero-section">
  <DoodleBackground count={20} />
  <div class="hero-container">
    <div class="hero-left">
      <div class="hero-content">
        <h1 class="hero-title">
          {hasRefreshToken ? 'Welcome Back!' : 'Design & Print'}
          <span class="hero-gradient">Your Ideas</span>
        </h1>
        <p class="hero-subtitle">
          {hasRefreshToken 
            ? 'Continue where you left off and bring your creative visions to life' 
            : 'AI-powered custom printing that turns your imagination into reality'}
        </p>
        
        <AuthForm 
          bind:email
          bind:loading
          bind:error
          bind:emailSent
          {hasRefreshToken}
          on:emailAuth
          on:googleAuth
          on:facebookAuth
          on:reset
        />
      </div>
    </div>
    
    <div class="hero-right">
      <div class="pinterest-grid">
        {#each Array(12) as _, i}
          <div class="grid-item" style="animation-delay: {i * 0.05}s">
            <img 
              src="https://picsum.photos/300/400?random={i}" 
              alt="Design example {i + 1}"
              loading="lazy"
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .hero-section {
    position: relative; /* This is crucial for containing the absolute doodles */
    padding-top: 80px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden; /* Hide parts of doodles that go outside the hero */
  }
  
  .hero-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 4rem;
    align-items: center;
    position: relative; /* Ensure content is on top of doodles */
    z-index: 1;
  }
  
  .hero-content {
    animation: fadeInUp 0.8s ease;
  }
  
  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
  }
  
  .hero-gradient {
    display: block;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-500) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    margin-bottom: 3rem;
    line-height: 1.6;
  }

  .pinterest-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 2rem;
  }
  
  .grid-item {
    border-radius: var(--radius-xl);
    overflow: hidden;
    animation: floatIn 0.6s ease backwards;
    transition: transform 0.3s;
  }
  
  .grid-item:hover {
    transform: translateY(-4px);
  }
  
  .grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .grid-item:nth-child(3n+1) {
    grid-row: span 2;
  }
  
  .grid-item:nth-child(5) {
    grid-row: span 2;
  }
  
  .grid-item:nth-child(8) {
    grid-row: span 2;
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
  
  @keyframes floatIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @media (max-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    .hero-right {
      display: none;
    }
    
    .hero-title {
      font-size: 2.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 1.75rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
  }
</style>