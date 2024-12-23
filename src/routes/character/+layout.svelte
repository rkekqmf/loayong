<script lang="ts">
	import { Chevron_left, Chevron_right } from 'svelte-google-materialdesign-icons';
	import { page } from '$app/stores';
	import { searchStore } from '$lib/stores/store';
	import { goto } from '$app/navigation';
	import { classData } from '$lib/data/classData';
	import { activeSection, sectionToggles } from '$lib/stores/store';
	import { onMount } from 'svelte';

	let isLoading = false;
	let rosterData: any[] = [];
	let currentRosterId = '';
	let profileData;
	let currentId = '';

	const sections = {
		sasagae: '사사게',
		arkpassive: '아크패시브',
		'combat-stats': '전투 특성',
		equipment: '장비',
		collections: '수집품',
		achievements: '업적'
	};

	const fetchRosterData = async (id: string) => {
		// 이미 해당 캐릭터의 원정대 데이터가 있는지 확인
		const existingCharacter = rosterData.find((char) => char.CharacterName === id);
		if (existingCharacter) {
			return rosterData;
		}

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

			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`캐릭터 정보를 가져오는데 실패했습니다 (${response.status})`);
			}

			const responseData = await response.json();
			rosterData = responseData;
			return responseData;
		} catch (error) {
			console.error('데이터 로딩 오류:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	// 버튼 클릭을 통한 캐릭터 선택 (API 호출 없이 기존 데이터 사용)
	function handleSelectChange(newValue: string) {
		console.log('캐릭터 선택됨:', newValue);
		if (newValue) {
			$searchStore = newValue;
			goto(`/character/${encodeURIComponent(newValue)}`, {
				replaceState: true,
				noScroll: true
			});
		}
	}

	$: {
		if ($page.url.pathname) {
			const id = $page.url.pathname.split('/')[2];
			if (id && id !== currentId) {
				currentId = id;
				if (rosterData.length === 0 || !rosterData.some((char) => char.CharacterName === id)) {
					fetchRosterData(id);
				}
			}
		}
	}

	$: sortedCharacters = rosterData.sort((a, b) => {
		return parseFloat(b.ItemAvgLevel.replace(',', '')) - parseFloat(a.ItemAvgLevel.replace(',', ''));
	});

	$: currentSearchQuery = $searchStore;
	$: selectedId = $searchStore || '';

	$: {
		// URL에서 검색어 가져오기
		const urlQuery = $page.url.pathname.split('/')[2];
		if (urlQuery) {
			currentSearchQuery = decodeURIComponent(urlQuery);
			$searchStore = currentSearchQuery; // 스토어 업데이트
		}
	}

	function getClassCode(className) {
		return classData[className]?.code || '';
	}

	// 마스터 토글 변경 핸들러
	function handleMasterToggle(checked: boolean) {
		sectionToggles.update(() => ({
			sasagae: checked,
			arkpassive: checked,
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

	const fetchData2 = async (id: string) => {
		isLoading = true;
		try {
			const encodedId = encodeURIComponent(id);
			const url = `https://developer-lostark.game.onstove.com/armories/characters/${encodedId}/profiles`;
			const options = {
				method: 'GET',
				headers: {
					accept: 'application/json',
					authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`
				}
			};
			const response = await fetch(url, options);

			if (!response.ok) {
				throw new Error(`API 요청 실패 (${response.status})`);
			}
			const profileData = await response.json();
			console.log(profileData);
			return profileData;
		} catch (error) {
			console.error('데이터 로딩 오류:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	// 프로필 데이터를 가져오는 리액티브 선언
	$: profileDataPromise = selectedId ? fetchData2(selectedId) : null;
	$: profileData = undefined; // 초기화
	$: {
		if (profileDataPromise) {
			profileDataPromise.then((data) => {
				profileData = data;
			});
		}
	}

	onMount(async () => {
		profileData = await fetchData2(selectedId);
	});
</script>

<section class="flex gap-4">
	<!-- 왼쪽 사이드바: 정대 캐릭터 목록 -->

	<div class="mb-6 flex h-fit w-64 flex-shrink-0 flex-col gap-4">
		<!-- 캐릭터 선택 드롭다운 -->
		{#if isLoading && rosterData.length === 0}
			<div class="flex h-[40px] w-full items-center justify-center">캐릭터 정보를 불러오는 중...</div>
		{:else}
			<div class="flex flex-col gap-2">
				<div class="flex flex-col gap-2">
					<div class="flex flex-col items-center gap-4 rounded-xl bg-bg-300 p-4">
						<!-- 캐릭터 정보 -->
						<div class="flex flex-col gap-1">
							<!-- 캐릭터 이름 & 레벨 -->
							<div class="flex items-center gap-2">
								<span class="text-2xl font-bold">{profileData?.CharacterName}</span>
								<span class="text-lg text-primary-100">{profileData?.ItemMaxLevel}</span>
							</div>

							<div class="flex items-center gap-2 text-sm text-gray-400">
								{#if profileData?.Title}
									<span>《{profileData?.Title}》</span>
								{/if}
								{#if profileData?.GuildName}
									<span>길드: {profileData?.GuildName}</span>
								{/if}
							</div>
						</div>

						<!-- 캐릭터 이미지 -->
						<div class="relative flex h-[300px] w-full items-center justify-center overflow-hidden bg-bg-300">
							{#if profileData?.CharacterImage}
								<img alt={profileData?.CharacterName} width="200" src={profileData.CharacterImage} class="h-full w-auto object-contain" style="color: transparent;" />
								<div class="absolute inset-0 bg-bg-300 mix-blend-lighten"></div>
							{:else}
								<div class="text-gray-400">이미지 로딩 중...</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- 토글 섹션 추가 -->
				<div class="mt-4 flex flex-col gap-2">
					<div>
						<label class="toggle-container">
							<input type="checkbox" checked={$sectionToggles && Object.values($sectionToggles).every((value) => value)} on:change={(e) => handleMasterToggle(e.currentTarget.checked)} />
							<span class="toggle-label">전체 선택</span>
						</label>
					</div>
					<div class="grid grid-cols-2 gap-2">
						{#each Object.entries(sections) as [key, label]}
							<label class="toggle-container">
								<input type="checkbox" bind:checked={$sectionToggles[key]} on:change={(e) => handleSectionToggle(key, e.currentTarget.checked)} />
								<span class="toggle-label">{label}</span>
							</label>
						{/each}
					</div>
				</div>

				{#each sortedCharacters as character}
					{@const isActive = character.CharacterName === selectedId}
					<button
						class="flex items-center gap-2 rounded-lg border-2 bg-bg-300 p-2 transition-colors
							   {isActive ? 'border-primary-100' : 'border-transparent'}"
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
		{/if}
	</div>

	<!-- 오른쪽: 선택된 캐릭터 상세 정보 -->
	<div class="flex-1 rounded-xl bg-bg-200 p-4 [box-shadow:2px_2px_8px_rgba(var(--primary-100-rgb),0.2)]">
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

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
</style>
