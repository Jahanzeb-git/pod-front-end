<script lang="ts">
  import { Plus, Minus } from 'lucide-svelte';
  import DoodleBackground from '$lib/components/landing/DoodleBackground.svelte';
  export let faqs: { question: string; answer: string; }[];

  let expandedFaq: number | null = null;
</script>

<section id="faq" class="faq-section">
  <DoodleBackground count={12} />
  <div class="section-container">
    <h2 class="section-title text-center">Frequently Asked Questions</h2>
    
    <div class="faq-list">
      {#each faqs as faq, i}
        <div class="faq-item" class:expanded={expandedFaq === i}>
          <button 
            class="faq-question"
            on:click={() => expandedFaq = expandedFaq === i ? null : i}
          >
            <span>{faq.question}</span>
            {#if expandedFaq === i}
              <Minus size={20} />
            {:else}
              <Plus size={20} />
            {/if}
          </button>
          {#if expandedFaq === i}
            <div class="faq-answer">
              <p>{faq.answer}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .faq-section {
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

  .faq-list {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    background: var(--color-bg-elevated);
    border-radius: var(--radius-xl);
    margin-bottom: 1rem;
    border: 1px solid var(--color-border-primary);
    overflow: hidden;
    transition: all 0.3s;
  }
  
  .faq-item.expanded {
    box-shadow: var(--shadow-md);
  }
  
  .faq-question {
    width: 100%;
    padding: 1.25rem 1.5rem;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-text-primary);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
  }
  
  .faq-question:hover {
    background: var(--color-bg-tertiary);
  }
  
  .faq-answer {
    padding: 0 1.5rem 1.5rem;
    animation: slideDown 0.3s ease;
  }
  
  .faq-answer p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }
  }
</style>