<script lang="ts">
	import { Chevron_left, Chevron_right } from 'svelte-google-materialdesign-icons';
	import { page } from '$app/stores';
	import { searchStore } from '$lib/store/store';
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
			goto(`/search/${encodeURIComponent(newValue)}`);
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
		goto(`/search/${encodeURIComponent(newCharacter)}`);
	}
</script>

{#if !isLoading}
	<select class="h-[40px] w-[320px] rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={selectedId} on:change={(e) => handleSelectChange(e.currentTarget.value)}>
		{#each sortedCharacters as { CharacterName, CharacterClassName, ItemAvgLevel }}
			<option value={CharacterName}>
				{CharacterName} [{CharacterClassName}] - {ItemAvgLevel}
			</option>
		{/each}
	</select>
{:else}
	<div class="flex h-[40px] w-[320px] items-center justify-center">캐릭터 정보를 불러오는 중...</div>
{/if}

<div class="flex w-full items-center justify-center gap-8 p-8">
	<button on:click={() => moveToCharacter('prev')} class="cursor-pointer">
		<Chevron_left size="100" />
	</button>
	<slot />
	<button on:click={() => moveToCharacter('next')} class="cursor-pointer">
		<Chevron_right size="100" />
	</button>
</div>
