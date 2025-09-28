<script lang="ts">
  import DoodleBackground from '$lib/components/landing/DoodleBackground.svelte';
  export let categories: { name: string; icon: string; image: string; }[];
</script>

<section id="categories" class="categories-section">
  <DoodleBackground count={16} />
  <div class="section-container">
    <h2 class="section-title text-center">Explore Categories</h2>
    <p class="section-subtitle">Discover endless possibilities for custom printing</p>
    
    <div class="categories-grid">
      {#each categories as category}
        <div class="category-card">
          <div class="category-image">
            <img src={category.image} alt={category.name} />
            <div class="category-overlay">
              <span class="category-icon">{category.icon}</span>
            </div>
          </div>
          <h3>{category.name}</h3>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .categories-section {
    position: relative;
    overflow: hidden;
    padding: 6rem 2rem;
    background: transparent;
  }

  .section-container {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: var(--color-text-primary);
  }
  
  .text-center {
    text-align: center;
  }
  
  .section-subtitle {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    margin-bottom: 3rem;
    margin-top: -1rem;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
  }
  
  .category-card {
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s;
  }
  
  .category-card:hover {
    transform: translateY(-8px);
  }
  
  .category-image {
    position: relative;
    border-radius: var(--radius-2xl);
    overflow: hidden;
    margin-bottom: 1rem;
    aspect-ratio: 4/5;
    box-shadow: var(--shadow-md);
  }
  
  .category-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  .category-card:hover .category-image img {
    transform: scale(1.05);
  }
  
  .category-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1.5rem;
  }
  
  .category-icon {
    font-size: 2.5rem;
  }
  
  .category-card h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
    
    .categories-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
  }
</style>