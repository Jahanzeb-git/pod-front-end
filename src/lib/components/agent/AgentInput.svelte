<script lang="ts">
  import { Send, Menu } from 'lucide-svelte';

  export let value = '';
  export let onSend: () => void;
  export let onMenu: () => void;

  let textarea: HTMLTextAreaElement;

  function adjustTextareaHeight() {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  $: if (textarea && value) {
    adjustTextareaHeight();
  }
</script>

<div class="input-container">
  <button class="menu-button" on:click={onMenu}>
    <Menu size={20} />
  </button>
  <div class="textarea-wrapper">
    <textarea
      bind:this={textarea}
      bind:value
      rows={1}
      placeholder="Ask the AI to design something..."
      on:input={adjustTextareaHeight}
    />
  </div>
  <button class="send-button" on:click={onSend} disabled={!value}>
    <Send size={20} />
  </button>
</div>

<style>
  .input-container {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-3);
    padding: var(--spacing-3);
    background-color: var(--color-bg-tertiary);
    border-top: 1px solid var(--color-border-primary);
  }

  .textarea-wrapper {
    flex: 1;
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-secondary);
    border-radius: var(--radius-2xl);
    padding: var(--spacing-2) var(--spacing-4);
    display: flex;
    align-items: center;
  }

  textarea {
    width: 100%;
    background: none;
    border: none;
    outline: none;
    resize: none;
    font-size: 1rem;
    line-height: 1.5;
    max-height: 150px; /* Limit growth */
    scrollbar-width: none; /* Firefox */
  }

  textarea::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  .menu-button, .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .menu-button {
    display: none; /* Hidden by default, shown on mobile */
    width: 44px;
    height: 44px;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-secondary);
  }

  .menu-button:hover {
    background-color: var(--color-border-primary);
  }

  .send-button {
    width: 44px;
    height: 44px;
    background-color: var(--color-primary-600);
    color: white;
  }

  .send-button:hover:not(:disabled) {
    background-color: var(--color-primary-700);
    transform: scale(1.05);
  }

  .send-button:disabled {
    background-color: var(--color-secondary-400);
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    .menu-button {
      display: flex;
    }
  }
</style>
