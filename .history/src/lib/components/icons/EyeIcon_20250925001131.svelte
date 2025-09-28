<script lang="ts">
  export let size: number = 24;
  export let className: string = '';
  export let closed: boolean = false;
</script>

{#if closed}
<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.54 18.54 0 0 1 2.21-3.02m4.63-4.63A10.07 10.07 0 0 1 12 4c7 0 11 8 11 8a18.54 18.54 0 0 1-2.21 3.02M15 12a3 3 0 1 1-6 0"></path>
  <line x1="1" y1="1" x2="23" y2="23"></line>
</svg>
{:else}
<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
  <circle cx="12" cy="12" r="3"></circle>
</svg>
{/if}