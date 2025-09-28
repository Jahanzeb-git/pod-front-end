<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { apiClient } from '$lib/api/client';

  import PageHeader from '$lib/components/landing/PageHeader.svelte';
  import Hero from '$lib/components/landing/Hero.svelte';
  import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
  import Categories from '$lib/components/landing/Categories.svelte';
  import Faq from '$lib/components/landing/Faq.svelte';
  import PageFooter from '$lib/components/landing/PageFooter.svelte';


  let email = '';
  let error = '';
  let loading = false;
  let emailSent = false;
  let hasRefreshToken = false;

  onMount(async () => {
    if (browser) {
      try {
        loading = true;
        const response = await apiClient.refreshToken();
        if (response && response.access_token) {
          hasRefreshToken = true;
          authStore.setAuth(response.user || {}, response.access_token);
          goto('/');
        }
      } catch {
        hasRefreshToken = false;
      } finally {
        loading = false;
      }
      
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
              goto('/');
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
    }
    catch (err: any) {
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
                goto('/');
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

  const faqsData = [
    { question: "How does the design process work?", answer: "Our AI-powered design tool helps you create custom prints in minutes. Simply describe what you want, and our AI generates unique designs tailored to your vision. You can then refine and customize until it's perfect." },
    { question: "What products can I customize?", answer: "We offer a wide range of products including t-shirts, hoodies, mugs, phone cases, posters, and more. Each product is printed on-demand with high-quality materials and vibrant, long-lasting prints." },
    { question: "How long does shipping take?", answer: "Production typically takes 2-5 business days, followed by shipping which varies by location. Standard shipping takes 3-7 business days, while express options are available for faster delivery." },
    { question: "Can I sell my designs?", answer: "Yes! Our platform allows creators to set up their own storefront and earn commissions on sales. You design, we handle production and shipping, and you earn passive income." },
    { question: "What's your return policy?", answer: "We offer a 30-day satisfaction guarantee. If you're not happy with your order, we'll make it right with a replacement or full refund. Quality is our top priority." }
  ];

  const categoriesData = [
    { name: "Apparel", icon: "👕", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400", description: "Custom tees, hoodies, and more." },
    { name: "Home Decor", icon: "🏠", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", description: "Mugs, pillows, and posters." },
    { name: "Wall Art", icon: "🖼️", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400", description: "Canvas prints and framed art." },
    { name: "Stationery", icon: "📝", image: "https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?w=400", description: "Journals, stickers, and cards." },
  ];
</script>

<div class="auth-page">
  <div class="main-content">
    <PageHeader />
    <Hero 
      bind:email
      bind:loading
      bind:error
      bind:emailSent
      {hasRefreshToken}
      on:emailAuth={handleEmailAuth}
      on:googleAuth={handleGoogleAuth}
      on:facebookAuth={handleFacebookAuth}
      on:reset={() => { emailSent = false; email = ''; }}
    />
    <HowItWorks />
    <Categories categories={categoriesData} />
    <Faq faqs={faqsData} />
    <PageFooter />
  </div>
</div>