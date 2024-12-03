<script>
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { page } from '$app/stores';

	let searchResults = [];

	onMount(async () => {
		const currentPath = $page.url.pathname;
		const keyword = currentPath.startsWith('/characters/') ? decodeURIComponent(currentPath.split('/')[2]) : '';

		try {
			console.log('keyword:', keyword);
			const response = await fetch(`${PUBLIC_API_URL}/search?keyword=${encodeURIComponent(keyword)}`);
			if (!response.ok) throw new Error('검색 실패');
			const allResults = await response.json();
			searchResults = allResults.slice(1);
			console.log('검색 결과:', searchResults);
		} catch (error) {
			console.error('검색 에러:', error);
		}
	});

	function cleanTitle(title) {
		return title
			.replace(/\[[^\]]*\]\s*/, '')
			.replace(/&gt;/g, '>')
			.trim();
	}
</script>

<div class="search-results">
	{#if searchResults.length > 0}
		<ul class="flex flex-col gap-4">
			{#each searchResults as result}
				<li class="search-item flex items-center">
					<a href={result.link} target="_blank" rel="noopener noreferrer" class="block rounded-lg border border-green-600 bg-green-900/50 p-4 text-white transition-all hover:bg-green-800/50">
						{cleanTitle(result.title)}
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-center text-white">검색 결과가 없습니다.</p>
	{/if}
</div>

<style>
	.search-results {
		width: 100%;

		margin: 0 auto;
		padding: 1rem;
		overflow-y: auto;
	}

	.search-item a {
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.search-item a:hover {
		box-shadow: 0 0 10px rgba(74, 222, 128, 0.2);
	}
</style>
