<script lang="ts">
	import '../app.pcss';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import Navigation from '$lib/components/layout/navigation.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import Advertise from '$lib/components/layout/advertise.svelte';
	import SearchBar from '$lib/components/common/searchbar.svelte';

	let { children } = $props();

	// URL에서 초기값 가져오기
	const currentPath = $page.url.pathname;
	const initialQuery = currentPath.startsWith('/search/') ? decodeURIComponent(currentPath.split('/')[2]) : '';

	// 스토어 초기값 설정
	const searchStore = writable(initialQuery);
	let searchQuery = $state(initialQuery);

	// 검색 처리 함수
	function handleSearch() {
		if (searchQuery.trim()) {
			$searchStore = searchQuery;
			goto(`/character/${encodeURIComponent(searchQuery)}`);
		}
	}

	// URL 변경 감지 및 동기화
	$effect(() => {
		const path = $page.url.pathname;
		if (path.startsWith('/character/')) {
			const urlQuery = decodeURIComponent(path.split('/')[2]);
			searchQuery = urlQuery;
			$searchStore = urlQuery;
		}
	});
</script>

<Navigation />
<main class="text-sm-responsive mx-auto w-full max-w-[1536px] flex-1 px-4 lg:px-8 xl:px-10">
	<div class="flex flex-col items-center justify-center gap-12 pb-20 pt-5">
		<!-- <Advertise width="w-full sm:w-[440px] md:w-[640px] lg:w-[940px] xl:w-[1240px]" height="h-[100px]" type="static" /> -->
		<div class="flex w-full gap-4">
			<Advertise height="hidden md:flex md:h-[600px]" width="w-[200px]" />
			<div class="flex w-full flex-col gap-4">
				<SearchBar bind:searchQuery {handleSearch} />
				{@render children()}
			</div>
			<Advertise height="hidden xl:flex xl:h-[300px]" />
		</div>
	</div>
</main>
<Footer />
