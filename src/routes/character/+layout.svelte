<script lang="ts">
	import { Chevron_left, Chevron_right } from 'svelte-google-materialdesign-icons';
	import { page } from '$app/stores';
	import { searchStore } from '$lib/stores/store';
	import { goto } from '$app/navigation';
	import { classData } from '$lib/data/classData';
	import { activeSection, sectionToggles } from '$lib/stores/store';

	let isLoading = false;
	let data: any[] = [];
	let selectedId = '';

	const sections = {
		'character-info': '캐릭터 정보',
		'combat-stats': '전투 특성',
		equipment: '장비',
		collections: '수집품',
		achievements: '업적'
	};

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

	function getClassCode(className) {
		return classData[className]?.code || '';
	}

	// 마스터 토글 변경 핸들러
	function handleMasterToggle(checked: boolean) {
		sectionToggles.update(() => ({
			'character-info': checked,
			'combat-stats': checked,
			equipment: checked,
			collections: checked,
			achievements: checked
		}));
	}

	// 개별 섹션 토글 핸들러
	function handleSectionToggle(key: string, checked: boolean) {
		sectionToggles.update((current) => ({
			...current,
			[key]: checked
		}));
	}
</script>

<section class="flex gap-4">
	<!-- 왼쪽 사이드바: 정대 캐릭터 목록 -->

	<div class="sticky top-20 mb-6 flex h-fit w-64 flex-shrink-0 flex-col gap-4">
		<!-- 토글 섹션 추가 -->
		<div class="mt-4 flex flex-col gap-2">
			<label class="toggle-container">
				<input type="checkbox" checked={$sectionToggles && Object.values($sectionToggles).every((value) => value)} on:change={(e) => handleMasterToggle(e.currentTarget.checked)} />
				<span class="toggle-label">전체 선택</span>
			</label>

			{#each Object.entries(sections) as [key, label]}
				<label class="toggle-container">
					<input type="checkbox" bind:checked={$sectionToggles[key]} on:change={(e) => handleSectionToggle(key, e.currentTarget.checked)} />
					<span class="toggle-label">{label}</span>
				</label>
			{/each}
		</div>
		<!-- 캐릭터 선택 드롭다운 -->
		{#if !isLoading}
			<!-- 캐릭터 목록 -->
			<div class="flex flex-col gap-2">
				{#each sortedCharacters as character}
					{@const isActive = character.CharacterName === selectedId}
					<button
						class="flex items-center gap-2 rounded-lg bg-bg-300 p-2 transition-all hover:bg-accent-100
							   {isActive ? 'border-2 border-primary-100' : ''}"
						on:click={() => handleSelectChange(character.CharacterName)}
					>
						<img src={`/class/${getClassCode(character.CharacterClassName)}.png`} alt={character.CharacterClassName} class="h-10 w-10 rounded-full object-cover p-1 [filter:brightness(0)_invert(1)]" />
						<div class="flex flex-col text-left">
							<span class="text-sm">{character.CharacterName}</span>
							<span class="text-xs text-gray-400">{character.ItemAvgLevel}</span>
						</div>
					</button>
				{/each}
			</div>
		{:else}
			<div class="flex h-[40px] w-full items-center justify-center">캐릭터 정보를 불러오는 중...</div>
		{/if}
	</div>

	<!-- 오른쪽: 선택된 캐릭터 상세 정보 -->
	<div class="flex-1 rounded-xl bg-bg-200 p-4 shadow-primary">
		<slot />
	</div>
</section>

<style>
	select:focus {
		outline: none;
	}

	.toggle-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.toggle-container input[type='checkbox'] {
		appearance: none;
		width: 3rem;
		height: 1.5rem;
		background-color: var(--bg-300);
		border-radius: 1rem;
		position: relative;
		cursor: pointer;
		transition: all 0.3s;
	}

	.toggle-container input[type='checkbox']:checked {
		background-color: var(--primary-100);
	}

	.toggle-container input[type='checkbox']::before {
		content: '';
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background-color: white;
		top: 0.125rem;
		left: 0.125rem;
		transition: all 0.3s;
	}

	.toggle-container input[type='checkbox']:checked::before {
		transform: translateX(1.5rem);
	}

	.toggle-label {
		font-size: 0.875rem;
		color: var(--text-100);
	}
</style>
