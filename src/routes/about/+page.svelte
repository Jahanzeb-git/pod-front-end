<svelte:head>
	<title>About • Professional SvelteKit App</title>
	<meta name="description" content="About this professional SvelteKit project" />
</svelte:head>

<div class="container p-8">
	<header class="mb-8">
		<a href="/" class="btn btn-secondary mb-4">← Back to Home</a>
		<h1 class="mb-4">About This Project</h1>
	</header>

	<div class="grid">
		<section class="border rounded p-8 shadow">
			<h2 class="font-semibold mb-4">Features Included</h2>
			<ul class="feature-list">
				<li>🚀 SvelteKit with TypeScript support</li>
				<li>🎨 Modern CSS with custom properties</li>
				<li>📱 Responsive design system</li>
				<li>🔍 SEO-friendly meta tags</li>
				<li>⚡ Fast development with hot module replacement</li>
				<li>📦 Production-ready build configuration</li>
				<li>🛠️ ESLint and Prettier for code quality</li>
				<li>🎯 Professional project structure</li>
			</ul>
		</section>

		<section class="border rounded p-8 shadow">
			<h2 class="font-semibold mb-4">Next Steps</h2>
			<p class="mb-4">This project is ready for you to start building. Here are some suggestions:</p>
			<ol class="next-steps-list">
				<li>Add your components to <code>src/lib/</code></li>
				<li>Create new routes in <code>src/routes/</code></li>
				<li>Configure your deployment adapter</li>
				<li>Add a database if needed</li>
				<li>Implement authentication</li>
				<li>Add your favorite UI library</li>
			</ol>
		</section>
	</div>
</div>

<style>
	.grid {
		display: grid;
		gap: var(--spacing-xl);
		grid-template-columns: 1fr;
	}

	@media (min-width: 768px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.feature-list,
	.next-steps-list {
		list-style: none;
		padding: 0;
	}

	.feature-list li,
	.next-steps-list li {
		padding: var(--spacing-sm) 0;
		border-bottom: 1px solid var(--border-color);
	}

	.feature-list li:last-child,
	.next-steps-list li:last-child {
		border-bottom: none;
	}

	.next-steps-list {
		counter-reset: step-counter;
	}

	.next-steps-list li {
		counter-increment: step-counter;
		padding-left: var(--spacing-lg);
		position: relative;
	}

	.next-steps-list li::before {
		content: counter(step-counter);
		position: absolute;
		left: 0;
		top: var(--spacing-sm);
		background-color: var(--color-primary);
		color: white;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
	}

	code {
		background-color: var(--color-bg-secondary);
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: calc(var(--border-radius) / 2);
		font-family: var(--font-family-mono);
		font-size: 0.875rem;
		color: var(--color-primary);
	}
</style>