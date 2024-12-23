<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { page } from '$app/stores';

	let searchResults = [];
	let searchPromise: Promise<any>;

	const testResults = [
		{
			title: '매우 긴 제목의 테스트 데이터입니다. 이것은 정말 길어서 반드시 말줄임표가 생길 것입니다. 과연 어떻게 보일까요?',
			link: 'https://example.com/1'
		},
		{
			title: '[공지] &lt;&lt;테스트 데이터&gt;&gt; 특수문자 테스트',
			link: 'https://example.com/2'
		},
		{
			title: '일반적인 길이의 제목',
			link: 'https://example.com/3'
		},
		{
			title: 'ThisIsAVeryLongWordWithoutAnySpacesLetsSeeHowItBreaks',
			link: 'https://example.com/4'
		},
		{
			title: '[태그] 태그가 있는 제목 &amp; 특수문자도 포함',
			link: 'https://example.com/5'
		},
		{
			title: '한글과English가 섞여있는 제목 테스트',
			link: 'https://example.com/6'
		}
	];

	onMount(() => {
		searchPromise = (async () => {
			// 실제 API 호출 대신 테스트 데이터 사용
			searchResults = testResults;
			return searchResults;

			// 기존 코드는 주석 처리
			/*
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
			*/
		})();
	});

	function cleanTitle(title: string) {
		return title
			.replace(/\[[^\]]*\]\s*/, '')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.trim();
	}
</script>

{#await searchPromise}
	<div class="flex min-h-[400px] w-full items-center justify-center">
		<div class="border-primary h-12 w-12 animate-spin rounded-full border-t-2"></div>
	</div>
{:then results}
	<div class="results-container">
		<div class="grid w-full">
			{#if results && results.length > 0}
				{#each results as result}
					<div class="w-full overflow-hidden">
						<a href={result.link} target="_blank" rel="noopener noreferrer" class="block w-full rounded-lg border border-primary-100 bg-bg-100 p-4 text-white transition-all hover:bg-bg-200 hover:shadow-primary">
							<p class="truncate break-all">
								{cleanTitle(result.title)}
							</p>
						</a>
					</div>
				{/each}
			{:else}
				<p class="text-center text-white">검색 결과가 없습니다.</p>
			{/if}
		</div>
	</div>
{:catch error}
	<p class="text-center text-red-500">검색 중 오류가 발생했습니다.</p>
{/await}

<style>
	.results-container {
		max-height: 240px;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem;
		width: 100%;
		padding: 1rem;
	}

	/* 스크롤바 스타일링 */
	.results-container::-webkit-scrollbar {
		width: 4px; /* 스크롤바 너비 */
	}
	.results-container::-webkit-scrollbar-track {
		background: #1e1e1e;
	}
	.results-container::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}
	.results-container::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.4); /* 호버 시 스크롤바 색상 */
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1rem;
		width: 100%;
		padding: 1rem;
	}
</style>
