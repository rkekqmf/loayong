<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { page } from '$app/stores';

	let searchResults = [];
	let searchPromise: Promise<any>;

	onMount(() => {
		searchPromise = (async () => {
			const currentPath = $page.url.pathname;
			const keyword = currentPath.startsWith('/character/') ? decodeURIComponent(currentPath.split('/')[2]) : '';

			try {
				console.log('keyword:', keyword);
				const response = await fetch(`${PUBLIC_API_URL}/search?keyword=${encodeURIComponent(keyword)}`);
				if (!response.ok) throw new Error('검색 실패');
				const allResults = await response.json();
				searchResults = allResults.slice(1);
				return searchResults;
			} catch (error) {
				console.error('검색 에러:', error);
				throw error;
			}
		})();
	});

	function cleanTitle(title: string) {
		return title
			.replace(/\[[^\]]*\]\s*/, '')
			.replace(/&gt;/g, '>')
			.trim();
	}
</script>

{#await searchPromise}
	<div class="flex min-h-[400px] w-full items-center justify-center">
		<div class="border-primary h-12 w-12 animate-spin rounded-full border-t-2"></div>
	</div>
{:then results}
	<div class="search-results">
		{#if results && results.length > 0}
			<ul class="flex flex-col gap-4">
				{#each results as result}
					<li class="search-item flex w-full items-center">
						<a href={result.link} target="_blank" rel="noopener noreferrer" class="block w-full rounded-lg border border-primary-100 bg-bg-100 p-4 text-white transition-all hover:bg-bg-200 hover:shadow-primary">
							{cleanTitle(result.title)}
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-center text-white">검색 결과가 없습니다.</p>
		{/if}
	</div>
{:catch error}
	<p class="text-center text-red-500">검색 중 오류가 발생했습니다.</p>
{/await}

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
