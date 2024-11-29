<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// URL에서 초기값 가져오기
	const currentPath = $page.url.pathname;
	const initialQuery = currentPath.startsWith('/search/') ? decodeURIComponent(currentPath.split('/')[2]) : '';

	// 스토어 초기값 설정
	const searchStore = writable(initialQuery);
	let searchQuery = $searchStore;

	// 검색 처리 함수
	function handleSearch() {
		if (searchQuery.trim()) {
			console.log('검색어 저장:', searchQuery); // 디버깅 로그
			$searchStore = searchQuery;
			console.log('저장된 스토어 값:', $searchStore); // 디버깅 로그
			goto(`/search/${encodeURIComponent(searchQuery)}`);
		}
	}

	// URL 변경 감지 및 동기화
	$effect(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/search/')) {
			const urlQuery = decodeURIComponent(path.split('/')[2]);
			searchQuery = urlQuery;
			$searchStore = urlQuery;
		}
	});

	// 검색 아이콘 SVG 추가
	const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
	  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
	</svg>`;
</script>

<!-- 배경 그라데이션 레이어 수정 -->
<div class="fixed inset-0 -z-10 mt-10 bg-green-950">
	<div class="radial-gradient"></div>
</div>

<nav class="fixed top-0 z-50 w-full bg-gradient-to-t from-green-950 to-green-900 shadow-2xl backdrop-blur-sm">
	<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
		<div class="flex items-center gap-20">
			<div class="flex-shrink-0">
				<a href="/" class="text-2xl font-bold text-white transition-colors hover:text-emerald-300">
					<span class="">ti</span> tle
				</a>
			</div>
			<div class="mx-4 max-w-2xl flex-1">
				<div class="relative">
					<input
						type="text"
						class="w-full rounded-full border-2 border-green-800/30 bg-green-950/20
							   py-3 pl-12
							   pr-4 text-emerald-100 placeholder-green-700
							   transition-all duration-200 ease-in-out
							   hover:bg-green-950/30 focus:border-emerald-500 focus:ring-2
							   focus:ring-emerald-500/50"
						placeholder="닉네임..."
						bind:value={searchQuery}
						onkeydown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button class="absolute inset-y-0 right-3 flex items-center text-emerald-500" onclick={handleSearch}> 검색 </button>
					<div class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-emerald-500">
						{@html searchIcon}
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>

<main class="relative mx-auto mt-20 min-h-[calc(100vh-180px)] px-4 py-8 sm:px-6 lg:px-8">
	<!-- 메인 컨텐츠 배경 -->
	<div class="absolute inset-0 rounded-xl"></div>

	<!-- 실제 컨텐츠 -->
	<div class="box_area relative">
		{@render children()}
	</div>
</main>

<footer class="fixed bottom-0 flex w-full flex-col items-center gap-[1.2rem] bg-gradient-to-b from-green-800 to-green-900 px-[1.6rem] py-[1rem] text-[1.2rem] text-[#ccc] shadow-2xl backdrop-blur-sm">
	<div class="flex items-center justify-center gap-4 text-[1rem]">
		<span>© Copyright 2024</span>
		<div class="divider"></div>
		<span>서모씨</span>
		<div class="divider"></div>
		<span>All Rights Reserved</span>
	</div>
</footer>

<style>
	.divider {
		border-left: 1px dotted #3eca4e;
		height: 15px;
	}
	/* 글로우 효과 */
	.hover\:shadow-xl:hover {
		box-shadow: 0 0 25px rgba(212, 255, 241, 0.2);
	}

	.box_area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.4rem;
		margin: 5rem 0;
		padding: 3.2rem 1.6rem;
		background: #52694e5a;
		justify-content: center;
		border-radius: 1.2rem;
		border: 2px solid #aaaaaa;
		box-shadow: 0px 0px 16px 0px rgba(210, 253, 235, 0.5);
		min-height: 320px;
	}

	.radial-gradient {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 200% 80% at 50% 50%,
			rgba(34, 197, 94, 0.35) 0%,
			/* 중앙 - green-500 */ rgba(22, 163, 74, 0.3) 15%,
			/* green-600 */ rgba(21, 128, 61, 0.4) 30%,
			/* green-700 */ rgba(22, 101, 52, 0.6) 45%,
			/* green-800 */ rgba(20, 83, 45, 0.8) 60%,
			/* green-900 */ rgba(5, 46, 22, 0.95) 70%,
			/* green-950 */ rgba(0, 10, 5, 1) 85%,
			/* 더 어두운 검은색 */ rgb(0, 5, 2) 100% /* 거의 완전한 검은색 */
		);
	}

	/* 중앙 하이라이트 효과 */
	.radial-gradient::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse 120% 60% at 50% 50%, rgba(74, 222, 128, 0.2) 0%, /* 밝은 green 하이라이트 */ transparent 70%);
		mix-blend-mode: screen;
	}
</style>
