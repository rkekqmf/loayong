<script>
	import { classData } from '$lib/data/classData';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import { Star } from 'svelte-google-materialdesign-icons';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { raidTiers } from '$lib/data/raidData';

	let inputValue = '';
	let savedValue = '';
	let isLoading = true;
	let profileData = null;
	let currentSlide = 0;
	let sortedCharacters = [];
	let showToast = false;
	let toastMessage = '';
	let isCharacterModalOpen = false;
	let selectedCharacters = new Set();
	let draggedCharacter = null;
	let dragOverCharacter = null;
	let raidGoldStatus = {}; // 레이드별 추가/차감 골드 저장
	let totalGold = 0; // 전체 골드 합계

	// 캐릭터별 레이드 완료 상태를 저장할 객체
	let raidStatus = {};

	// 일일 컨텐츠 상태 추가
	let dailyStatus = {};

	// 모달 상태 관리
	let isModalOpen = false;
	let selectedCharacter = null;

	// 핀된 레이드 상태 저장을 위한 변수 추가
	let pinnedRaids = {};

	onMount(() => {
		savedValue = localStorage.getItem('savedInputValue') || '';
		if (savedValue) {
			fetchData(savedValue);
		} else {
			isLoading = false;
		}
		// 저장된 레이드 상태 불러오기 및 초기화 확인
		loadRaidStatus();
		loadPinnedRaids();
		checkWeeklyReset();
		loadDailyStatus();
		checkDailyReset();
		// 초기 선택된 캐릭터 설정
		const savedSelectedChars = localStorage.getItem('selectedCharacters');
		if (savedSelectedChars) {
			selectedCharacters = new Set(JSON.parse(savedSelectedChars));
		} else if (sortedCharacters.length > 0) {
			selectedCharacters = new Set(sortedCharacters.slice(0, 6).map((char) => char.CharacterName));
			localStorage.setItem('selectedCharacters', JSON.stringify([...selectedCharacters]));
		}
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
		const krMinute = krTime.getUTCMinutes();

		// 수요일 05:59 AM (KST) 체크
		if (krDay === 3 && ((krHour === 5 && krMinute === 59) || krHour < 5)) {
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

	// 레이드 상태 토글 시 메인 화면에 표시되는 레이드만 업데이트
	function toggleRaid(characterName, raidId) {
		if (!raidStatus[characterName]) {
			raidStatus[characterName] = {};
		}
		raidStatus[characterName][raidId] = !raidStatus[characterName][raidId];
		localStorage.setItem('raidStatus', JSON.stringify(raidStatus));
	}

	// 핀 토글 함수 추가
	function togglePin(characterName, raidId) {
		if (!pinnedRaids[characterName]) {
			pinnedRaids[characterName] = {};
		}

		// 이미 핀된 상태라면 핀 제거
		if (pinnedRaids[characterName][raidId]) {
			pinnedRaids[characterName][raidId] = false;
		} else {
			// 현재 핀된 개수 확인
			const currentPinnedCount = Object.values(pinnedRaids[characterName]).filter(Boolean).length;

			if (currentPinnedCount >= 3) {
				showToastMessage('최대 3개까지만 핀할 수 있습니다');
				return;
			}

			pinnedRaids[characterName][raidId] = true;
		}

		localStorage.setItem('pinnedRaids', JSON.stringify(pinnedRaids));
		pinnedRaids = pinnedRaids;
	}

	// 캐릭터의 레벨에 따른 레이드 목록 반환 (메인 화면용 - 최대 3개)
	function getAvailableRaids(itemLevel) {
		const level = parseFloat(itemLevel.replace(',', ''));
		let availableRaids = [];

		Object.values(raidTiers).forEach((tierRaids) => {
			tierRaids.forEach((raid) => {
				if (level >= raid.minLevel) {
					availableRaids.push(raid);
				}
			});
		});

		// 가장 높은 레벨의 레이드 3개만 반환
		return availableRaids.sort((a, b) => b.minLevel - a.minLevel).slice(0, 3);
	}

	// 모든 가능한 레이드 목록 반환 (모달용)
	function getAllAvailableRaids(itemLevel) {
		const level = parseFloat(itemLevel.replace(',', ''));
		let availableRaids = [];

		Object.values(raidTiers).forEach((tierRaids) => {
			tierRaids.forEach((raid) => {
				if (level >= raid.minLevel) {
					availableRaids.push(raid);
				}
			});
		});

		return availableRaids;
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
		localStorage.removeItem('pinnedRaids');
		localStorage.removeItem('selectedCharacters');
		localStorage.removeItem('characterOrder'); // 캐릭터 순서도 초기화
		raidStatus = {};
		dailyStatus = {};
		pinnedRaids = {};
		profileData = null;
		sortedCharacters = [];
		selectedCharacters = new Set();
	}

	const fetchData = async (characterName) => {
		if (!characterName) return;
		isLoading = true;
		profileData = null;
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

			const data = await response.json();

			// 저장된 순서가 있으면 그 순서대로, 없으면 레벨순
			const savedOrder = localStorage.getItem('characterOrder');
			if (savedOrder) {
				const orderList = JSON.parse(savedOrder);
				const orderedData = [];
				// 저장된 순서대로 정렬
				orderList.forEach((name) => {
					const char = data.find((c) => c.CharacterName === name);
					if (char) orderedData.push(char);
				});
				// 새로 추가된 캐릭터가 있다면 끝에 추가
				data.forEach((char) => {
					if (!orderList.includes(char.CharacterName)) {
						orderedData.push(char);
					}
				});
				profileData = orderedData;
			} else {
				// 초기 정렬: 레벨 순
				profileData = data.sort((a, b) => parseFloat(b.ItemMaxLevel.replace(',', '')) - parseFloat(a.ItemMaxLevel.replace(',', '')));
			}

			// 선택된 캐릭터 설정
			const savedSelectedChars = localStorage.getItem('selectedCharacters');
			if (savedSelectedChars) {
				selectedCharacters = new Set(JSON.parse(savedSelectedChars));
			} else if (profileData.length > 0) {
				// 초기 6개 선택
				selectedCharacters = new Set(profileData.slice(0, 6).map((char) => char.CharacterName));
				localStorage.setItem('selectedCharacters', JSON.stringify([...selectedCharacters]));
			}

			// 선택된 캐릭터들로 sortedCharacters 설정
			sortedCharacters = profileData.filter((char) => selectedCharacters.has(char.CharacterName));

			// 각 캐릭터의 기본 핀 설정
			sortedCharacters.forEach((character) => {
				const characterName = character.CharacterName;
				if (!pinnedRaids[characterName] || Object.keys(pinnedRaids[characterName]).length === 0) {
					const topRaids = getAvailableRaids(character.ItemMaxLevel);
					pinnedRaids[characterName] = {};
					topRaids.forEach((raid) => {
						pinnedRaids[characterName][raid.id] = true;
					});
				}
			});

			// 변경된 pinnedRaids 저장
			localStorage.setItem('pinnedRaids', JSON.stringify(pinnedRaids));
			pinnedRaids = pinnedRaids; // Svelte 반응성 트리거

			// 프로필 데이터 업데이트 후 즉시 상태 저장
			localStorage.setItem('characterOrder', JSON.stringify(profileData.map((char) => char.CharacterName)));
		} catch (error) {
			console.error('데이터 가져오기 실패:', error);
			profileData = [];
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

	// 직업 코드 가져오는 함수
	function getClassCode(className) {
		return classData[className]?.code || '';
	}

	// 모달 열기 함수
	function openRaidModal(character) {
		selectedCharacter = character;
		isModalOpen = true;
	}

	// 메인 화면에 표시할 레이드 목록 가져오는 함수 수정
	function getDisplayRaids(character) {
		const characterName = character.CharacterName;
		if (pinnedRaids[characterName] && Object.keys(pinnedRaids[characterName]).length > 0) {
			// 핀된 레이드 반환
			return Object.entries(pinnedRaids[characterName])
				.filter(([_, isPinned]) => isPinned)
				.map(([raidId]) => {
					for (const [_, raids] of Object.entries(raidTiers)) {
						const raid = raids.find((r) => r.id === raidId);
						if (raid) return raid;
					}
				})
				.filter(Boolean);
		} else {
			// 기본값: 상위 3개 레이드
			return getAvailableRaids(character.ItemMaxLevel);
		}
	}

	// pinnedRaids 로드 함수 추가
	function loadPinnedRaids() {
		const saved = localStorage.getItem('pinnedRaids');
		if (saved) {
			pinnedRaids = JSON.parse(saved);
		}
	}

	function showToastMessage(message) {
		toastMessage = message;
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 3000);
	}

	// 캐릭터 선택 토글 함수
	function toggleCharacterSelection(character) {
		const wasSelected = selectedCharacters.has(character.CharacterName);

		if (wasSelected) {
			// 마지막 캐릭터를 제거하려고 할 때 방지
			if (selectedCharacters.size <= 1) {
				showToastMessage('최소 1개의 캐릭터는 선택해야 합니다');
				return;
			}

			selectedCharacters.delete(character.CharacterName);
			// 현재 보고 있던 캐릭터가 제거되는 경우
			if (sortedCharacters[currentSlide]?.CharacterName === character.CharacterName) {
				currentSlide = Math.max(0, currentSlide - 1);
			}
		} else {
			if (selectedCharacters.size >= 6) {
				showToastMessage('최대 6개의 캐릭터만 선택할 수 있습니다');
				return;
			}
			selectedCharacters.add(character.CharacterName);
			// 새로 추가된 캐릭터로 슬라이드 이동
			const newSortedCharacters = profileData.filter((char) => selectedCharacters.has(char.CharacterName)).sort((a, b) => parseFloat(b.ItemMaxLevel.replace(',', '')) - parseFloat(a.ItemMaxLevel.replace(',', '')));
			const newCharacterIndex = newSortedCharacters.findIndex((char) => char.CharacterName === character.CharacterName);
			currentSlide = newCharacterIndex;
		}

		// 선택된 캐릭터들로 sortedCharacters 업데이트
		sortedCharacters = profileData.filter((char) => selectedCharacters.has(char.CharacterName)).sort((a, b) => parseFloat(b.ItemMaxLevel.replace(',', '')) - parseFloat(a.ItemMaxLevel.replace(',', '')));

		// 선택된 캐릭터 목록 저장
		localStorage.setItem('selectedCharacters', JSON.stringify([...selectedCharacters]));
		selectedCharacters = selectedCharacters; // Svelte 반응성 트리거
	}

	// 저장된 캐릭터 선택 불러오기
	function loadSelectedCharacters() {
		const saved = localStorage.getItem('selectedCharacters');
		const savedOrder = localStorage.getItem('characterOrder');

		if (saved) {
			selectedCharacters = new Set(JSON.parse(saved));
			if (profileData) {
				if (savedOrder) {
					const orderList = JSON.parse(savedOrder);
					sortedCharacters = orderList.map((name) => profileData.find((char) => char.CharacterName === name)).filter(Boolean);
				} else {
					sortedCharacters = profileData.filter((char) => selectedCharacters.has(char.CharacterName)).sort((a, b) => parseFloat(b.ItemMaxLevel.replace(',', '')) - parseFloat(a.ItemMaxLevel.replace(',', '')));
				}
			}
		}
	}

	// 드래그 앤 드롭 핸들러 수정
	function handleDragStart(e, character) {
		e.dataTransfer.effectAllowed = 'move';
		draggedCharacter = character;

		// 빈 이미지를 드래그 이미지로 설정하여 기본 금지 표시 제거
		const img = new Image();
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
		e.dataTransfer.setDragImage(img, 0, 0);

		// 드래그 시작할 때 시각적 피드백 추가
		e.target.classList.add('dragging');
		e.target.style.opacity = '0.7';
		e.target.style.transform = 'scale(0.98)';
	}

	function handleDragOver(e, character) {
		e.preventDefault();
		if (character !== draggedCharacter) {
			dragOverCharacter = character;

			// 드래그 오버 시 시각적 피드백
			const items = document.querySelectorAll('.character-item');
			items.forEach((item) => {
				item.classList.remove('drag-over');
				if (item.dataset.characterName === character.CharacterName) {
					item.classList.add('drag-over');
				}
			});
		}
	}

	function handleDragEnd(e) {
		// 드래그 종료 시 모든 스타일 초기화
		e.target.classList.remove('dragging');
		e.target.style.opacity = '';
		e.target.style.transform = '';

		const items = document.querySelectorAll('.character-item');
		items.forEach((item) => {
			item.classList.remove('drag-over');
		});

		draggedCharacter = null;
		dragOverCharacter = null;
	}

	function handleDrop(e) {
		e.preventDefault();
		if (!draggedCharacter || !dragOverCharacter || draggedCharacter === dragOverCharacter) return;

		const newOrder = [...profileData];
		const fromIndex = newOrder.findIndex((c) => c.CharacterName === draggedCharacter.CharacterName);
		const toIndex = newOrder.findIndex((c) => c.CharacterName === dragOverCharacter.CharacterName);

		// 순서 변경
		const [removed] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, removed);

		// 프로필 데이터 업데이트
		profileData = newOrder;

		// 선택된 캐릭터들 순서도 업데이트
		sortedCharacters = profileData.filter((char) => selectedCharacters.has(char.CharacterName));

		// 변경된 순서 저장
		localStorage.setItem('characterOrder', JSON.stringify(profileData.map((char) => char.CharacterName)));
	}

	function calculateCharacterGold(character) {
		let total = 0;
		const raids = getDisplayRaids(character);
		console.log(raids);
		raids.forEach((raid) => {
			if (raidStatus[character.CharacterName]?.[raid.id]) {
				// 기본 골드
				total += raid.goldReward;

				console.log(raidGoldStatus[character.CharacterName]?.[raid.id]);
				// 추가 골드
				const extraGold = raidGoldStatus[character.CharacterName]?.[raid.id]?.extraGold || 0;
				total += extraGold;

				// 차감 골드
				const minusGold = raidGoldStatus[character.CharacterName]?.[raid.id]?.minusGold || 0;
				total -= minusGold;
			}
		});

		return total;
	}

	function calculateTotalGold() {
		return sortedCharacters.reduce((sum, character) => {
			return sum + calculateCharacterGold(character);
		}, 0);
	}
</script>

<div class="w-full space-y-4 p-4 text-text-100">
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
							class="border-app-box-border bg-app-box w-full rounded-md border-2 p-2 text-center text-white transition-colors placeholder:text-gray-400 focus:border-green-500 focus:outline-none"
						/>
						<button on:click={handleSave} class="bg-app-box-bg border-app-box-border min-w-[60px] rounded-md border-2 p-2 text-center text-white transition-colors hover:bg-green-700"> 등록 </button>
					</div>
				</div>
			{:else}
				<div class="relative mb-2 w-full gap-4 overflow-hidden rounded-lg border border-text-100">
					<div class="slider-wrapper">
						{#each sortedCharacters as character, i (character.CharacterName)}
							<div
								animate:flip={{
									duration: 300,
									easing: quintOut
								}}
								class="slider-slide p-4"
								style="transform: translateX({(i - currentSlide) * 100}%)"
							>
								<div class="flex flex-col gap-3 rounded-md">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<img src={`/class/${getClassCode(character.CharacterClassName)}.png`} alt={character.CharacterClassName} class="border-app-box-border h-10 w-10 rounded-full border object-cover p-1 [filter:brightness(0)_invert(1)]" />
											<span class="text-sm">{character.CharacterName}</span>
											<div class="flex items-center gap-1">
												<span class="text-sm">{character.ItemMaxLevel}</span>
												<button class="rounded-full p-1 hover:bg-white/10" on:click={() => openRaidModal(character)} aria-label="레이드 수정">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
														<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
														<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
													</svg>
												</button>
											</div>
										</div>
										<div class="flex gap-2">
											<!-- 캐릭터 수정 버튼 -->
											<button aria-label="캐릭터 수정" on:click={() => (isCharacterModalOpen = true)} class="block rounded-full bg-primary-100 p-2 text-white transition-colors hover:bg-blue-300">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
											</button>
											<!-- 기존 리셋 버튼 -->
											<button aria-label="초기화" on:click={handleReset} class="block rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-300">
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="#fff" viewBox="0 0 24 24">
													<path
														d="M 3.5 2 C 3.372 2 3.2444844 2.0494844 3.1464844 2.1464844 C 2.9514844 2.3414844 2.9514844 2.6585156 3.1464844 2.8535156 L 5.09375 4.8007812 C 3.1950225 6.6199194 2 9.1685121 2 12 C 2 17.511334 6.4886661 22 12 22 C 17.511334 22 22 17.511334 22 12 C 22 6.864114 18.106486 2.6175896 13.109375 2.0644531 A 1.0001 1.0001 0 0 0 13.009766 2.0585938 A 1.0001 1.0001 0 0 0 12.890625 4.0527344 C 16.891514 4.4955979 20 7.871886 20 12 C 20 16.430666 16.430666 20 12 20 C 7.5693339 20 4 16.430666 4 12 C 4 9.7105359 4.967513 7.6643975 6.5039062 6.2109375 L 8.1464844 7.8535156 C 8.3414844 8.0485156 8.6585156 8.0485156 8.8535156 7.8535156 C 8.9515156 7.7565156 9 7.628 9 7.5 L 9 3 A 1 1 0 0 0 8 2 L 3.5 2 z"
													></path>
												</svg>
											</button>
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
												쿠잔
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
										{#each getDisplayRaids(character) as raid}
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

									<!-- 골드 표시 -->
									<div class="mt-2 text-right text-sm text-yellow-400">
										{calculateCharacterGold(character).toLocaleString()}G
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- 슬라이더 컨트롤 -->
					<div class="mt-4 flex flex-col items-center gap-2">
						<div class="slider-dots">
							{#each sortedCharacters as character, i}
								{@const pinnedRaidsList = getDisplayRaids(character)}
								{@const dailyCompleteCount = [dailyStatus[character.CharacterName]?.guardian, dailyStatus[character.CharacterName]?.chaos, dailyStatus[character.CharacterName]?.epona].filter(Boolean).length}
								{@const raidCompleteCount = pinnedRaidsList.filter((raid) => raidStatus[character.CharacterName]?.[raid.id]).length}
								{@const isAllComplete = dailyCompleteCount === 3 && raidCompleteCount === pinnedRaidsList.length}

								<div class="relative h-8 w-8">
									<button class="dot relative {i === currentSlide ? 'active' : ''} {isAllComplete ? 'complete' : ''} group" on:click={() => (currentSlide = i)}>
										{#if !isAllComplete}
											<!-- 일일 숙제 진행도 (왼쪽) -->
											<div class="absolute left-0 h-full w-1/2 overflow-hidden">
												<div class="absolute bottom-0 w-full bg-yellow-400/40 transition-all" style="height: {(dailyCompleteCount / 3) * 100}%"></div>
											</div>
											<!-- 주간 숙제 진행도 (오른쪽) -->
											<div class="absolute right-0 h-full w-1/2 overflow-hidden">
												<div class="absolute bottom-0 w-full bg-purple-400/40 transition-all" style="height: {(raidCompleteCount / pinnedRaidsList.length) * 100}%"></div>
											</div>
										{:else}
											<div class="absolute inset-0 bg-green-600"></div>
										{/if}
										<img src={`/class/${getClassCode(character.CharacterClassName)}.png`} alt={character.CharacterClassName} class="relative z-10 h-full w-full object-cover p-1 [filter:brightness(0)_invert(1)]" />
									</button>
									{#if isAllComplete}
										<span class="absolute -right-1 -top-1 z-20 flex h-3 w-3 items-center justify-center rounded-full bg-green-400 text-[10px] text-white">✓</span>
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
				</div>

				<!-- 전체 골드 표시 -->
				<div class="mt-4 text-center text-lg text-yellow-400">
					총 골드: {calculateTotalGold().toLocaleString()}G
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
				class="border-app-box-border bg-app-box w-full rounded-md border-2 p-2 text-center text-white transition-colors placeholder:text-gray-400 focus:border-green-500 focus:outline-none"
			/>
			<button on:click={handleSave} class="bg-app-box-bg border-app-box-border min-w-[60px] rounded-md border-2 p-2 text-center text-white transition-colors hover:bg-green-700"> 등록 </button>
		</div>
	{/if}
</div>
<!-- 모달 부분 수정 -->
{#if isModalOpen && selectedCharacter}
	<div transition:slide={{ duration: 300, easing: quartOut }} class="border-app-box-border absolute left-0 right-0 top-[90px] z-20 border-t-2 bg-gradient-to-tr from-[#2c402f]/55 to-[#354f34]/95 p-3 shadow-lg backdrop-blur-sm">
		<div class="mb-3 flex items-center justify-between">
			<h3 class="text-lg text-white">레이드 목록 - {selectedCharacter.CharacterName}</h3>
			<button on:click={() => (isModalOpen = false)} class="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="모달 닫기">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		{#each Object.entries(raidTiers) as [tierKey, raids]}
			<div class="mb-4">
				<h3 class="mb-2 text-sm text-white/80">
					{tierKey === 'abyssDungeon' ? '어비스 던전' : tierKey === 'epicRaid' ? '에픽 레이드' : tierKey === 'legionRaid' ? '군단장 레이드' : '카오스 레이드'}
				</h3>
				<div class="grid grid-cols-3 gap-2">
					{#each raids as raid}
						{@const isAvailable = parseFloat(selectedCharacter.ItemMaxLevel.replace(',', '')) >= raid.minLevel}
						<div class="relative">
							<button
								class="group relative flex h-[56px] w-full flex-col items-center justify-center rounded-md px-3 py-2 transition-colors
									{isAvailable ? (raidStatus[selectedCharacter.CharacterName]?.[raid.id] ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600') : 'cursor-not-allowed bg-gray-800 opacity-50'}"
								on:click={() => isAvailable && toggleRaid(selectedCharacter.CharacterName, raid.id)}
								disabled={!isAvailable}
							>
								<div class="text-sm text-white">{raid.name}</div>
								<div class="text-xs text-white/60">Lv.{raid.minLevel}</div>
								{#if raidStatus[selectedCharacter.CharacterName]?.[raid.id]}
									<span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-xs">✓</span>
								{/if}
							</button>
							{#if isAvailable}
								<button
									class="absolute -left-2.5 -top-2.5 z-10 select-none appearance-none rounded-full p-1
											   text-white/60 hover:text-white focus:outline-none focus:ring-0
											   focus-visible:outline-none active:outline-none
											   {pinnedRaids[selectedCharacter.CharacterName]?.[raid.id] ? 'text-yellow-400' : ''}"
									on:click={() => togglePin(selectedCharacter.CharacterName, raid.id)}
									aria-label="레이드 핀 고정"
									style=" -webkit-tap-highlight-color: transparent;"
								>
									<Star size="16" variation={pinnedRaids[selectedCharacter.CharacterName]?.[raid.id] ? 'filled' : 'outlined'} />
								</button>
							{/if}

							<!-- 레이드 모달 내부 -->
							<div class="flex items-center gap-2">
								{#if true}
									{@const charStatus = raidGoldStatus[selectedCharacter.CharacterName] ??= {}}
									{@const raidStatus = charStatus[raid.id] ??= { extraGold: 0, minusGold: 0 }}
								{/if}
								<input
									type="number"
									placeholder="버스/전리품 골드"
									on:input={(e) => {
										raidGoldStatus[selectedCharacter.CharacterName] ??= {};
										raidGoldStatus[selectedCharacter.CharacterName][raid.id] ??= { extraGold: 0, minusGold: 0 };
										raidGoldStatus[selectedCharacter.CharacterName][raid.id].extraGold = +e.target.value;
									}}
									value={raidGoldStatus[selectedCharacter.CharacterName]?.[raid.id]?.extraGold || 0}
									class="w-24 rounded bg-gray-700 px-2 py-1 text-white"
								/>
								<input type="number" placeholder="더보기 골드" bind:value={raidStatus.minusGold} class="w-24 rounded bg-gray-700 px-2 py-1 text-white" />
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

<!-- 토스트 메시지 추가 -->
{#if showToast}
	<div transition:slide={{ duration: 300 }} class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg">
		{toastMessage}
	</div>
{/if}

<!-- 캐릭터 선택 모달 수정 -->
{#if isCharacterModalOpen}
	<div transition:slide={{ duration: 300, easing: quartOut }} class="border-app-box-border absolute left-0 right-0 top-[90px] z-20 border-t-2 bg-gradient-to-tr from-[#2c402f]/55 to-[#354f34]/95 p-3 shadow-lg backdrop-blur-sm">
		<div class="mb-2 flex items-center justify-between">
			<h3 class="text-sm text-white">캐릭터 선택</h3>
			<button on:click={() => (isCharacterModalOpen = false)} class="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="custom-scrollbar max-h-[500px] space-y-1.5 overflow-y-auto">
			{#each profileData as character (character.CharacterName)}
				{@const dailyCount = [dailyStatus[character.CharacterName]?.guardian, dailyStatus[character.CharacterName]?.chaos, dailyStatus[character.CharacterName]?.epona].filter(Boolean).length}
				{@const raidCount = getDisplayRaids(character).filter((raid) => raidStatus[character.CharacterName]?.[raid.id]).length}
				{@const totalRaids = getDisplayRaids(character).length}
				{@const isAllComplete = dailyCount === 3 && raidCount === 3}

				<div
					role="listitem"
					class="character-item relative flex w-full items-center gap-2 rounded-md border border-white/20 px-2 py-1 text-left text-white
								{isAllComplete ? 'bg-green-600' : 'bg-gray-700'}"
					data-character-name={character.CharacterName}
					draggable={true}
					on:dragstart={(e) => handleDragStart(e, character)}
					on:dragover={(e) => handleDragOver(e, character)}
					on:dragend={handleDragEnd}
					on:drop={handleDrop}
				>
					{#if !isAllComplete}
						<!-- 일일 숙제 진행도 (왼쪽) -->
						<div class="absolute left-0 h-full overflow-hidden" style="width: {dailyCount * (100 / 6)}%; background: rgba(255, 200, 0, 0.2)"></div>

						<!-- 주간 숙제 진행도 (오른쪽) -->
						<div class="absolute right-0 h-full overflow-hidden" style="width: {raidCount * (100 / 6)}%; background: rgba(147, 51, 234, 0.2)"></div>
					{/if}

					<button class="relative flex flex-1 items-center gap-2" on:click={() => toggleCharacterSelection(character)}>
						<img src={`/class/${getClassCode(character.CharacterClassName)}.png`} alt={character.CharacterClassName} class="border-app-box-border h-6 w-6 rounded-full border object-cover p-1 [filter:brightness(0)_invert(1)]" />
						<span class="text-xs">{character.CharacterName}</span>
						<span class="text-xs text-white/60">{character.ItemMaxLevel}</span>
					</button>

					{#if selectedCharacters.has(character.CharacterName)}
						<div class="absolute right-2 top-1/2 -translate-y-1/2 text-green-400">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.slider-wrapper {
		position: relative;
		min-height: 212px;
		height: 100%;
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
		z-index: 10;
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

	/* 드래그 중인 요소 스타일 */
	.dragging {
		cursor: grabbing;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	/* 드래그 오버 효과 개선 */
	.drag-over {
		transform: scale(1.02);
		border-color: rgb(234 179 8);
		box-shadow: 0 0 8px rgba(234, 179, 8, 0.3);
		transition: all 0.2s ease;
	}

	/* 부드러 전환 효과 */
	.flex {
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			opacity 0.15s ease;
	}

	/* 스크롤바 스타일링 */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	/* 진행도 도트 스타일 */
	.progress-dot {
		@apply h-1.5 w-1.5 rounded-full transition-all duration-200;
	}

	.progress-dot.completed {
		@apply bg-green-400;
	}

	.progress-dot.incomplete {
		@apply bg-white/20;
	}

	.character-item {
		transition: all 0.2s ease;
	}

	.dragging {
		cursor: grabbing;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.drag-over {
		transform: scale(1.02);
		border-color: rgb(234 179 8);
		box-shadow: 0 0 8px rgba(234, 179, 8, 0.3);
		transition: all 0.2s ease;
	}
</style>
