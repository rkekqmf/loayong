<script lang="ts">
	import { Chevron_left, Chevron_right } from 'svelte-google-materialdesign-icons';
	import { page } from '$app/stores';
	import { searchStore } from '$lib/stores/store';
	import { goto } from '$app/navigation';
	let isLoading = false;
	let data: any[] = [];
	let selectedId = '';

	const fetchData = async (id: string) => {
		isLoading = true;
		try {
			const encodedId = encodeURIComponent(id);
			const url = `https://developer-lostark.game.onstove.com/characters/${encodedId}/siblings`;
			const options = {
				method: 'GET',
				headers: {
					accept: 'application/json',
					authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`
				}
			};

			const [response] = await Promise.all([fetch(url, options)]);

			if (!response.ok) {
				throw new Error(`캐릭터 정보를 가져오는데 실패했습니다 (${response.status})`);
			}
			0;
			const responseData = await response.json();

			data = responseData;
			console.log(data);
		} catch (error) {
			console.error('데이터 로딩 오류:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	$: {
		if ($page.url.pathname) {
			const id = $page.url.pathname.split('/')[2];
			if (id) {
				console.log('페이지 로드/새로고침, ID:', id);
				fetchData(id);
			}
		}
	}

	$: sortedCharacters = data.sort((a, b) => {
		return parseFloat(b.ItemAvgLevel.replace(',', '')) - parseFloat(a.ItemAvgLevel.replace(',', ''));
	});

	$: currentSearchQuery = $searchStore;
	$: selectedId = currentSearchQuery || '';

	$: {
		console.log('스토어 값:', $searchStore);
		console.log('currentSearchQuery:', currentSearchQuery);
		console.log('selectedId:', selectedId);
	}

	$: {
		// URL에서 검색어 가져오기
		const urlQuery = $page.url.pathname.split('/')[2];
		if (urlQuery) {
			currentSearchQuery = decodeURIComponent(urlQuery);
			$searchStore = currentSearchQuery; // 스토어 업데이트
		}
		console.log('URL 쿼리:', urlQuery);
		console.log('스토어 값:', $searchStore);
	}

	$: selectedId = $searchStore || '';

	// select 변경 핸들러
	function handleSelectChange(newValue: string) {
		if (newValue) {
			$searchStore = newValue;
			goto(`/character/${encodeURIComponent(newValue)}`);
		}
	}

	// 이전/다음 캐릭터 이동
	function moveToCharacter(direction: 'prev' | 'next') {
		const currentIndex = sortedCharacters.findIndex((char) => char.CharacterName === selectedId);
		if (currentIndex === -1) return;

		let newIndex;
		if (direction === 'prev') {
			newIndex = currentIndex === 0 ? sortedCharacters.length - 1 : currentIndex - 1;
		} else {
			newIndex = currentIndex === sortedCharacters.length - 1 ? 0 : currentIndex + 1;
		}

		const newCharacter = sortedCharacters[newIndex].CharacterName;
		$searchStore = newCharacter;
		goto(`/character/${encodeURIComponent(newCharacter)}`);
	}
</script>

<section class="relative flex flex-[2] flex-col items-center justify-center gap-2 rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-4 shadow-box">
	{#if !isLoading}
		<div class="mb-10 flex items-center justify-center">
			<select class="h-[40px] min-h-[40px] w-[320px] rounded-md border border-[#65ad7a] bg-[#3a6346] px-3 text-[#fff] focus:outline-none" bind:value={selectedId} on:change={(e) => handleSelectChange(e.currentTarget.value)}>
				{#each sortedCharacters as { CharacterName, CharacterClassName, ItemAvgLevel }}
					<option value={CharacterName}>
						{CharacterName} [{CharacterClassName}] - {ItemAvgLevel}
					</option>
				{/each}
			</select>
		</div>
	{:else}
		<div class="flex h-[40px] w-[320px] items-center justify-center">캐릭터 정보를 불러오는 중...</div>
	{/if}

	<div class="flex w-full items-center justify-center">
		<button on:click={() => moveToCharacter('prev')} class="shrink-0 cursor-pointer text-2xl font-bold text-[#fff]">
			<Chevron_left size="70" />
		</button>
		<div class="min-w-0 flex-1">
			<slot />
		</div>
		<button on:click={() => moveToCharacter('next')} class="shrink-0 cursor-pointer text-2xl font-bold text-[#fff]">
			<Chevron_right size="70" />
		</button>
	</div>
</section>

<style>
	select:focus {
		outline: none;
	}
</style>
