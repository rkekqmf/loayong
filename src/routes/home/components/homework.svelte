<script>
	import { classData } from '$lib/data/classData';
	import { onMount } from 'svelte';

	let inputValue = '';
	let savedValue = '';
	let isLoading = true;
	let profileData = null;
	let currentSlide = 0;
	let sortedCharacters = [];

	// 레이드 목록 정의 (레벨별)
	const raidTiers = {
		tier1: [
			{ id: 'kayangel', name: '카양겔', minLevel: 1540 },
			{ id: 'abrev', name: '아브렐슈드', minLevel: 1540 },
			{ id: 'atop', name: '상아탑', minLevel: 1600 },
			{ id: 'kmen', name: '카멘', minLevel: 1610 }
		],
		tier2: [
			{ id: 'ekidna', name: '서막', minLevel: 1620 },
			{ id: 'vehemoth', name: '베히모스', minLevel: 1640 },
			{ id: '1mac', name: '1막', minLevel: 1660 },
			{ id: '2mac', name: '2막', minLevel: 1670 }
		]
	};

	// 캐릭터별 레이드 완료 상태를 저장할 객체
	let raidStatus = {};

	// 일일 컨텐츠 상태 추가
	let dailyStatus = {};

	onMount(() => {
		savedValue = localStorage.getItem('savedInputValue') || '';
		if (savedValue) {
			fetchData(savedValue);
		} else {
			isLoading = false;
		}
		// 저장된 레이드 상태 불러오기 및 초기화 확인
		loadRaidStatus();
		checkWeeklyReset();
		loadDailyStatus();
		checkDailyReset();
	});

	// 레이드 상태 불러오기
	function loadRaidStatus() {
		const saved = localStorage.getItem('raidStatus');
		if (saved) {
			raidStatus = JSON.parse(saved);
		}
	}

	// 일일 컨텐츠 상태 불러오기
	function loadDailyStatus() {
		const saved = localStorage.getItem('dailyStatus');
		if (saved) {
			dailyStatus = JSON.parse(saved);
		}
	}

	// 주간 초기화 체크
	function checkWeeklyReset() {
		const lastReset = localStorage.getItem('lastResetCheck');
		const now = new Date();
		const krTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
		const krDay = krTime.getUTCDay();
		const krHour = krTime.getUTCHours();

		// 수요일 06:00 AM (KST) 체크
		if (krDay === 3 && krHour >= 6 && lastReset !== krTime.toDateString()) {
			raidStatus = {};
			localStorage.setItem('raidStatus', JSON.stringify(raidStatus));
			localStorage.setItem('lastResetCheck', krTime.toDateString());
		}
	}

	// 일일 초기화 체크 (매일 06:00 AM KST)
	function checkDailyReset() {
		const lastDailyReset = localStorage.getItem('lastDailyReset');
		const now = new Date();
		const krTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
		const krHour = krTime.getUTCHours();

		if (krHour >= 6 && lastDailyReset !== krTime.toDateString()) {
			dailyStatus = {};
			localStorage.setItem('dailyStatus', JSON.stringify(dailyStatus));
			localStorage.setItem('lastDailyReset', krTime.toDateString());
		}
	}

	// 레이드 상태 토글
	function toggleRaid(characterName, raidId) {
		if (!raidStatus[characterName]) {
			raidStatus[characterName] = {};
		}
		raidStatus[characterName][raidId] = !raidStatus[characterName][raidId];
		localStorage.setItem('raidStatus', JSON.stringify(raidStatus));
	}

	// 캐릭터의 모든 레이드 상태 토글
	function toggleAllRaids(characterName, value) {
		if (!raidStatus[characterName]) {
			raidStatus[characterName] = {};
		}
		raids.forEach((raid) => {
			raidStatus[characterName][raid.id] = value;
		});
		localStorage.setItem('raidStatus', JSON.stringify(raidStatus));
	}

	// 일일 컨텐츠 토글
	function toggleDaily(characterName, contentType) {
		if (!dailyStatus[characterName]) {
			dailyStatus[characterName] = {};
		}
		dailyStatus[characterName][contentType] = !dailyStatus[characterName][contentType];
		localStorage.setItem('dailyStatus', JSON.stringify(dailyStatus));
	}

	function handleSave() {
		savedValue = inputValue;
		localStorage.setItem('savedInputValue', inputValue);
		inputValue = '';
		fetchData(savedValue);
	}

	function handleReset() {
		savedValue = '';
		localStorage.removeItem('savedInputValue');
		localStorage.removeItem('raidStatus');
		localStorage.removeItem('dailyStatus');
		localStorage.removeItem('lastResetCheck');
		localStorage.removeItem('lastDailyReset');
		raidStatus = {};
		dailyStatus = {};
		profileData = null;
	}

	const fetchData = async (characterName) => {
		if (!characterName) return; // 빈 문자열일 경우 실행하지 않음
		isLoading = true;
		profileData = null; // 로딩 시작할 때 profileData 초기화
		try {
			const encodedName = encodeURIComponent(characterName);
			const url = `https://developer-lostark.game.onstove.com/characters/${encodedName}/siblings`;
			const response = await fetch(url, {
				headers: {
					accept: 'application/json',
					authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`
				}
			});

			if (!response.ok) {
				throw new Error('API 호출 실패');
			}

			profileData = await response.json();
			sortedCharacters = profileData.sort((a, b) => parseFloat(b.ItemMaxLevel.replace(',', '')) - parseFloat(a.ItemMaxLevel.replace(',', ''))).slice(0, 6);
		} catch (error) {
			console.error('데이터 가져오기 실패:', error);
			profileData = []; // 에러 발생 시 빈 배열로 설정
		} finally {
			isLoading = false;
		}
	};

	const nextSlide = () => {
		currentSlide = (currentSlide + 1) % sortedCharacters.length;
	};

	const prevSlide = () => {
		currentSlide = (currentSlide - 1 + sortedCharacters.length) % sortedCharacters.length;
	};

	// 캐릭터 레벨에 따른 레이드 목록 반환
	function getAvailableRaids(itemLevel) {
		const level = parseFloat(itemLevel.replace(',', ''));
		let availableRaids = [];

		// 모든 티어의 레이드를 순회하며 레벨 체크
		Object.values(raidTiers).forEach((tierRaids) => {
			tierRaids.forEach((raid) => {
				if (level >= raid.minLevel) {
					availableRaids.push(raid);
				}
			});
		});

		// 최대 3개까지만 반환 (가장 높은 레벨의 레이드 우선)
		return availableRaids.slice(-3);
	}

	// 직업 코드 가져오는 함수
	function getClassCode(className) {
		return classData[className]?.code || '';
	}
</script>

<section class="relative flex min-h-[370px] flex-col items-center rounded-xl border-2 border-app-box-border bg-gradient-to-tr from-[#2c402f] to-[#354f34] p-3 shadow-box">
	{#if isLoading}
		<div class="text-white">로딩 중...</div>
	{:else if savedValue}
		{#if profileData}
			{#if profileData.length === 0}
				<div class="flex flex-col items-center gap-4">
					<p class="text-white">캐릭터 정보를 찾을 수 없습니다.</p>
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={inputValue}
							placeholder="캐릭터 닉네임"
							on:keydown={(e) => e.key === 'Enter' && handleSave()}
							class="w-full rounded-md border-2 border-app-box-border bg-app-box p-2 text-center text-white transition-colors placeholder:text-gray-400 focus:border-green-500 focus:outline-none"
						/>
						<button on:click={handleSave} class="bg-app-box-bg min-w-[60px] rounded-md border-2 border-app-box-border p-2 text-center text-white transition-colors hover:bg-green-700"> 등록 </button>
					</div>
				</div>
			{:else}
				<button aria-label="초기화" on:click={handleReset} class=" absolute right-3 top-3 block rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-300">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="#fff" viewBox="0 0 24 24">
						<path
							d="M 3.5 2 C 3.372 2 3.2444844 2.0494844 3.1464844 2.1464844 C 2.9514844 2.3414844 2.9514844 2.6585156 3.1464844 2.8535156 L 5.09375 4.8007812 C 3.1950225 6.6199194 2 9.1685121 2 12 C 2 17.511334 6.4886661 22 12 22 C 17.511334 22 22 17.511334 22 12 C 22 6.864114 18.106486 2.6175896 13.109375 2.0644531 A 1.0001 1.0001 0 0 0 13.009766 2.0585938 A 1.0001 1.0001 0 0 0 12.890625 4.0527344 C 16.891514 4.4955979 20 7.871886 20 12 C 20 16.430666 16.430666 20 12 20 C 7.5693339 20 4 16.430666 4 12 C 4 9.7105359 4.967513 7.6643975 6.5039062 6.2109375 L 8.1464844 7.8535156 C 8.3414844 8.0485156 8.6585156 8.0485156 8.8535156 7.8535156 C 8.9515156 7.7565156 9 7.628 9 7.5 L 9 3 A 1 1 0 0 0 8 2 L 3.5 2 z"
						></path>
					</svg></button
				>
				<div class="slider-container mt-7">
					<div class="slider-wrapper">
						{#each sortedCharacters as character, i}
							{@const availableRaids = getAvailableRaids(character.ItemMaxLevel)}
							<div class="slider-slide" style="transform: translateX({(i - currentSlide) * 100}%)">
								<div class="bg-app-box-bg flex flex-col gap-3 rounded-md border-2 border-app-box-border p-2 text-white">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<img src={`/class/${getClassCode(character.CharacterClassName)}.png`} alt={character.CharacterClassName} class="h-10 w-10 rounded-full border border-app-box-border object-cover p-1 [filter:brightness(0)_invert(1)]" />
											<span class="text-sm">{character.CharacterName}</span>
											<span class="text-sm">{character.ItemMaxLevel}</span>
										</div>
									</div>
									<!-- 일일 컨텐츠 버튼 -->
									<div>
										<div class="flex gap-2">
											<button
												class="group relative min-h-[56px] flex-1 rounded-md px-3 py-2 transition-colors
												{dailyStatus[character.CharacterName]?.guardian ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}"
												on:click={() => toggleDaily(character.CharacterName, 'guardian')}
											>
												가디언
												{#if dailyStatus[character.CharacterName]?.guardian}
													<span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs">✓</span>
												{/if}
											</button>
											<button
												class="group relative min-h-[56px] flex-1 rounded-md px-3 py-2 transition-colors
												{dailyStatus[character.CharacterName]?.chaos ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}"
												on:click={() => toggleDaily(character.CharacterName, 'chaos')}
											>
												쿠르잔
												{#if dailyStatus[character.CharacterName]?.chaos}
													<span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs">✓</span>
												{/if}
											</button>
											<button
												class="group relative min-h-[56px] flex-1 rounded-md px-3 py-2 transition-colors
												{dailyStatus[character.CharacterName]?.epona ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}"
												on:click={() => toggleDaily(character.CharacterName, 'epona')}
											>
												에포나
												{#if dailyStatus[character.CharacterName]?.epona}
													<span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs">✓</span>
												{/if}
											</button>
										</div>
									</div>

									<!-- 레이드 목록 (가로 ) -->
									<div class="flex gap-2">
										{#each availableRaids as raid}
											<button
												class="group relative min-h-[56px] flex-1 rounded-md px-3 py-2 transition-colors
											{raidStatus[character.CharacterName]?.[raid.id] ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}"
												on:click={() => toggleRaid(character.CharacterName, raid.id)}
											>
												<div class="text-sm">{raid.name}</div>
												{#if raidStatus[character.CharacterName]?.[raid.id]}
													<span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs">✓</span>
												{/if}
												<div class="shadow-glow absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
											</button>
										{/each}
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- 슬라이더 컨트롤 -->
					{#if sortedCharacters.length > 1}
						<div class="mt-4 flex flex-col items-center gap-2">
							<div class="slider-dots">
								{#each sortedCharacters as character, i}
									{@const availableRaids = getAvailableRaids(character.ItemMaxLevel)}
									{@const dailyCompleteCount = [dailyStatus[character.CharacterName]?.guardian, dailyStatus[character.CharacterName]?.chaos, dailyStatus[character.CharacterName]?.epona].filter(Boolean).length}
									{@const raidCompleteCount = availableRaids.filter((raid) => raidStatus[character.CharacterName]?.[raid.id]).length}
									{@const isAllComplete = dailyCompleteCount === 3 && raidCompleteCount === availableRaids.length}

									<div class="relative h-8 w-8">
										<button class="dot relative {i === currentSlide ? 'active' : ''} {isAllComplete ? 'complete' : ''} group" on:click={() => (currentSlide = i)}>
											{#if !isAllComplete}
												<!-- 일일 숙제 진행도 (왼쪽) -->
												<div class="absolute left-0 h-full w-1/2 overflow-hidden">
													<div class="absolute bottom-0 w-full bg-yellow-400/40 transition-all" style="height: {(dailyCompleteCount / 3) * 100}%"></div>
												</div>
												<!-- 주간 숙제 진행도 (오른쪽) -->
												<div class="absolute right-0 h-full w-1/2 overflow-hidden">
													<div class="absolute bottom-0 w-full bg-purple-400/40 transition-all" style="height: {(raidCompleteCount / availableRaids.length) * 100}%"></div>
												</div>
											{:else}
												<div class="absolute inset-0 bg-green-600"></div>
											{/if}
											<img src={`/class/${getClassCode(character.CharacterClassName)}.png`} alt={character.CharacterClassName} class="relative z-10 h-full w-full object-cover p-1 [filter:brightness(0)_invert(1)]" />
										</button>
										{#if isAllComplete}
											<span class="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-400 text-[10px] text-white">✓</span>
										{/if}
									</div>
								{/each}
							</div>

							<!-- 범례 추가 -->
							<div class="mt-2 flex gap-4 text-xs text-white/80">
								<div class="flex w-16 flex-col items-center gap-1">
									<div class="h-3 w-3 rounded-full bg-yellow-400/40"></div>
									<span class="text-center">일일 완료</span>
								</div>
								<div class="flex w-16 flex-col items-center gap-1">
									<div class="h-3 w-3 rounded-full bg-purple-400/40"></div>
									<span class="text-center">주간 완료</span>
								</div>
								<div class="flex w-16 flex-col items-center gap-1">
									<div class="h-3 w-3 rounded-full bg-green-400/40"></div>
									<span class="text-center">현재 선택</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	{:else}
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={inputValue}
				placeholder="캐릭터 닉네임"
				on:keydown={(e) => e.key === 'Enter' && handleSave()}
				class="w-full rounded-md border-2 border-app-box-border bg-app-box p-2 text-center text-white transition-colors placeholder:text-gray-400 focus:border-green-500 focus:outline-none"
			/>
			<button on:click={handleSave} class="bg-app-box-bg min-w-[60px] rounded-md border-2 border-app-box-border p-2 text-center text-white transition-colors hover:bg-green-700"> 등록 </button>
		</div>
	{/if}
</section>

<style>
	.slider-container {
		position: relative;
		width: 100%;
		max-width: 600px;
		overflow: hidden;
	}

	.slider-wrapper {
		position: relative;
		height: 212px;
	}

	.slider-slide {
		position: absolute;
		width: 100%;
		transition: transform 0.5s ease;
	}

	.slider-button {
		background: rgba(255, 255, 255, 0.3);
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		cursor: pointer;
		z-index: 10;
		color: white;
	}

	.slider-dots {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
		margin-bottom: 4px;
	}

	.dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.6);
		cursor: pointer;
		padding: 1px;
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.dot.complete {
		border: none;
	}

	.dot.active {
		border-color: rgba(44, 210, 58, 0.8);
		transform: scale(1.1);
		z-index: 1;
	}

	.dot.active::after {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(44, 210, 58, 0.4);
		z-index: -1;
		border-radius: 50%;
	}

	.shadow-glow {
		box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.2);
	}
</style>
