<script lang="ts">
  export let size: number = 24;
  export let className: string = '';
</script>

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
  <circle cx="12" cy="12" r="10"></circle>
  <circle cx="12" cy="12" r="4"></circle>
  <line x1="21.17" y1="8" x2="12" y2="8"></line>
  <line x1="3.95" y1="6.06" x2="12" y2="6.06"></line>
  <line x1="18.5" y1="12" x2="12" y2="12"></line>
  <line x1="12" y1="17.94" x2="3.95" y2="17.94"></line>
  <line x1="12" y1="21.17" x2="12" y2="12"></line>
</svg>