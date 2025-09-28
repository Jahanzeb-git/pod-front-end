<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { apiClient } from '$lib/api/client';
  import { Mail, ChevronDown, Plus, Minus, ArrowRight, Check, Sparkles, Package, Palette } from 'lucide-svelte';
  import { browser } from '$app/environment';
  
  let email = '';
  let error = '';
  let loading = false;
  let emailSent = false;
  let hasRefreshToken = false;
  let expandedFaq: number | null = null;
  
  // Check for refresh token on mount
  onMount(async () => {
    if (browser) {
      // Try to refresh token to check if user has valid session
      try {
        loading = true;
        const response = await apiClient.refreshToken();
        if (response && response.access_token) {
          hasRefreshToken = true;
          authStore.setAuth(response.user || {}, response.access_token);
          // Redirect to main app if already authenticated
          window.location.href = '/';
        }
      } catch {
        hasRefreshToken = false;
      } finally {
        loading = false;
      }
      
      // Smooth scroll behavior for navigation
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  });
  
  async function handleEmailAuth() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      await apiClient.initiateEmailAuth(email);
      emailSent = true;
    } catch (err: any) {
      error = err.message || 'Failed to send magic link';
    } finally {
      loading = false;
    }
  }
  
  async function handleGoogleAuth() {
    loading = true;
    error = '';
    
    try {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.oauth2.initCodeClient({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
          scope: 'email profile',
          ux_mode: 'popup',
          callback: async (response: any) => {
            try {
              const authResult = await apiClient.googleAuth(response.code);
              authStore.setAuth(authResult.user, authResult.access_token);
              window.location.href = '/';
            } catch (err: any) {
              error = err.message || 'Google authentication failed';
            } finally {
              loading = false;
            }
          }
        }).requestCode();
      } else {
        error = 'Google authentication is not available';
        loading = false;
      }
    } catch (err: any) {
      error = err.message || 'Google authentication failed';
      loading = false;
    }
  }
  
  async function handleFacebookAuth() {
    loading = true;
    error = '';
    
    try {
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            apiClient.facebookAuth(response.authResponse.code, window.location.origin)
              .then((authResult) => {
                authStore.setAuth(authResult.user, authResult.access_token);
                window.location.href = '/';
              })
              .catch((err) => {
                error = err.message || 'Facebook authentication failed';
              })
              .finally(() => {
                loading = false;
              });
          } else {
            error = 'Facebook login was cancelled';
            loading = false;
          }
        }, { scope: 'email,public_profile' });
      } else {
        error = 'Facebook authentication is not available';
        loading = false;
      }
    } catch (err: any) {
      error = err.message || 'Facebook authentication failed';
      loading = false;
    }
  }
  
  const faqs = [
    {
      question: "How does the design process work?",
      answer: "Our AI-powered design tool helps you create custom prints in minutes. Simply describe what you want, and our AI generates unique designs tailored to your vision. You can then refine and customize until it's perfect."
    },
    {
      question: "What products can I customize?",
      answer: "We offer a wide range of products including t-shirts, hoodies, mugs, phone cases, posters, and more. Each product is printed on-demand with high-quality materials and vibrant, long-lasting prints."
    },
    {
      question: "How long does shipping take?",
      answer: "Production typically takes 2-5 business days, followed by shipping which varies by location. Standard shipping takes 3-7 business days, while express options are available for faster delivery."
    },
    {
      question: "Can I sell my designs?",
      answer: "Yes! Our platform allows creators to set up their own storefront and earn commissions on sales. You design, we handle production and shipping, and you earn passive income."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 30-day satisfaction guarantee. If you're not happy with your order, we'll make it right with a replacement or full refund. Quality is our top priority."
    }
  ];
  
  const categories = [
    { name: "Apparel", icon: "👕", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" },
    { name: "Home Decor", icon: "🏠", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
    { name: "Accessories", icon: "👜", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { name: "Wall Art", icon: "🖼️", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400" },
    { name: "Stationery", icon: "📝", image: "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?w=400" },
    { name: "Tech", icon: "📱", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400" }
  ];
</script>

<div class="auth-page">
  <!-- Navigation -->
  <nav class="auth-nav">
    <div class="nav-container">
      <div class="nav-logo">
        <Palette size={32} />
        <span>PrintCraft AI</span>
      </div>
      <div class="nav-links">
        <a href="#how-it-works">How it works</a>
        <a href="#categories">Categories</a>
        <a href="#faq">FAQ</a>
      </div>
    </div>
  </nav>
  
  <!-- Hero Section -->
  <section class="hero-section">
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
          
          {#if !emailSent}
            <div class="auth-form">
              <!-- Social Auth Buttons -->
              <div class="social-buttons">
                <button 
                  class="btn-social btn-google" 
                  on:click={handleGoogleAuth}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                
                <button 
                  class="btn-social btn-facebook" 
                  on:click={handleFacebookAuth}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
              </div>
              
              <div class="divider-fancy">
                <span>or</span>
              </div>
              
              <!-- Email Form -->
              <form on:submit|preventDefault={handleEmailAuth}>
                <div class="email-input-group">
                  <div class="email-input-wrapper">
                    <Mail size={20} class="email-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      bind:value={email}
                      class="email-input"
                      disabled={loading}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    class="btn-primary"
                    disabled={loading || !email}
                  >
                    {#if loading}
                      <div class="spinner"></div>
                    {:else}
                      {hasRefreshToken ? 'Sign In' : 'Get Started'}
                      <ArrowRight size={18} />
                    {/if}
                  </button>
                </div>
                
                {#if error}
                  <div class="error-alert">
                    {error}
                  </div>
                {/if}
              </form>
              
              <p class="auth-terms">
                By continuing, you agree to our 
                <a href="/terms" class="link">Terms of Service</a> and 
                <a href="/privacy" class="link">Privacy Policy</a>
              </p>
            </div>
          {:else}
            <div class="email-sent-card">
              <div class="success-icon">
                <Check size={32} />
              </div>
              <h3>Check your email!</h3>
              <p>We've sent a magic link to <strong>{email}</strong></p>
              <p class="email-hint">Click the link in the email to sign in instantly. No password needed!</p>
              <button 
                class="btn-secondary"
                on:click={() => {emailSent = false; email = '';}}
              >
                Try another email
              </button>
            </div>
          {/if}
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
  
  <!-- How It Works Section -->
  <section id="how-it-works" class="how-section">
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
  
  <!-- Categories Section -->
  <section id="categories" class="categories-section">
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
  
  <!-- FAQ Section -->
  <section id="faq" class="faq-section">
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
  
  <!-- Footer -->
  <footer class="auth-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <Palette size={28} />
          <span>PrintCraft AI</span>
        </div>
        <div class="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
        <div class="footer-copyright">
          © 2024 PrintCraft AI. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  }
  
  /* Navigation */
  .auth-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid var(--color-border-primary);
  }
  
  [data-theme="dark"] .auth-nav {
    background: rgba(26, 22, 20, 0.95);
  }
  
  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--color-primary-600);
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
  }
  
  .nav-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    font-size: 0.95rem;
  }
  
  .nav-links a:hover {
    color: var(--color-primary-600);
  }
  
  /* Hero Section */
  .hero-section {
    padding-top: 80px;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
  
  .hero-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 4rem;
    align-items: center;
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
  
  .auth-form {
    background: var(--color-bg-elevated);
    padding: 2rem;
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border-primary);
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-social {
    width: 100%;
    padding: 0.875rem 1.5rem;
    border-radius: var(--radius-xl);
    font-weight: 500;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all 0.2s;
    cursor: pointer;
    border: 1px solid var(--color-border-primary);
  }
  
  .btn-google {
    background: white;
    color: #333;
  }
  
  .btn-google:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary-400);
  }
  
  .btn-facebook {
    background: #1877f2;
    color: white;
    border-color: #1877f2;
  }
  
  .btn-facebook:hover:not(:disabled) {
    background: #166fe5;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .divider-fancy {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
  }
  
  .divider-fancy::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--color-border-primary);
  }
  
  .divider-fancy span {
    position: relative;
    background: var(--color-bg-elevated);
    padding: 0 1rem;
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .email-input-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .email-input-wrapper {
    position: relative;
  }
  
  .email-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-tertiary);
  }
  
  .email-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3.5rem;
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-xl);
    font-size: 1rem;
    background: var(--color-bg-primary);
    transition: all 0.2s;
  }
  
  .email-input:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
  }
  
  .btn-primary {
    width: 100%;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-xl);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--color-primary-600);
    border: 2px solid var(--color-primary-600);
    border-radius: var(--radius-xl);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-secondary:hover {
    background: var(--color-primary-600);
    color: white;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .error-alert {
    padding: 0.75rem 1rem;
    background: var(--color-error-50);
    color: var(--color-error-600);
    border-radius: var(--radius-lg);
    font-size: 0.9rem;
    margin-top: 1rem;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .auth-terms {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }
  
  .link {
    color: var(--color-primary-600);
    text-decoration: none;
    font-weight: 500;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  .email-sent-card {
    text-align: center;
    padding: 2rem;
  }
  
  .success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    background: var(--color-success-50);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-success-600);
  }
  
  .email-sent-card h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }
  
  .email-sent-card p {
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }
  
  .email-hint {
    font-size: 0.9rem;
    color: var(--color-text-tertiary);
    margin-bottom: 1.5rem;
  }
  
  /* Pinterest Grid */
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
  
  /* How It Works Section */
  .how-section {
    padding: 6rem 2rem;
    background: var(--color-bg-tertiary);
  }
  
  .section-container {
    max-width: 1200px;
    margin: 0 auto;
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
  
  /* Categories Section */
  .categories-section {
    padding: 6rem 2rem;
    background: var(--color-bg-primary);
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
  
  /* FAQ Section */
  .faq-section {
    padding: 6rem 2rem;
    background: var(--color-bg-secondary);
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
  
  /* Footer */
  .auth-footer {
    background: var(--color-bg-tertiary);
    border-top: 1px solid var(--color-border-primary);
    padding: 3rem 2rem;
  }
  
  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--color-primary-600);
  }
  
  .footer-links {
    display: flex;
    gap: 2rem;
  }
  
  .footer-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }
  
  .footer-links a:hover {
    color: var(--color-primary-600);
  }
  
  .footer-copyright {
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
  }
  
  /* Animations */
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
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .hero-container {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    .hero-right {
      display: none;
    }
    
    .how-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .hero-title {
      font-size: 2.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    
    .hero-title {
      font-size: 2rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .categories-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .footer-content {
      flex-direction: column;
      text-align: center;
    }
    
    .footer-links {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 1.75rem;
    }
    
    .hero-subtitle {
      font-size: 1rem;
    }
    
    .auth-form {
      padding: 1.5rem;
    }
  }
</style>