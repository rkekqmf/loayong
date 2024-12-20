<script lang="ts">
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { spring } from 'svelte/motion';
	import { flip } from 'svelte/animate';
	import Calculator from './components/calculator.svelte';
	import { onMount, onDestroy } from 'svelte';

	let Homework: any;
	let ClassInfo: any;

	if (browser) {
		Promise.all([import('./components/homework.svelte'), import('./components/class-info.svelte')]).then(([hw, info]) => {
			Homework = hw.default;
			ClassInfo = info.default;
			isLoading = false;
		});
	}

	function getInitialTabs() {
		if (browser) {
			const savedTabs = localStorage.getItem('tabs');
			if (savedTabs) {
				return JSON.parse(savedTabs);
			}
		}
		return [
			{ id: 'calculator', label: '계산기', checked: true },
			{ id: 'homework', label: '과제', checked: true },
			{ id: 'classInfo', label: '수업 정보', checked: true },
			{ id: 'test1', label: '테스트 1', checked: false },
			{ id: 'test2', label: '테스트 2', checked: false },
			{ id: 'test3', label: '테스트 3', checked: false }
		];
	}

	let isLoading = true;
	let tabs: typeof getInitialTabs extends () => infer R ? R : never = [];
	let activeTab = 'calculator';
	let isDragging = false;
	let draggedTab: HTMLElement | null = null;
	let startX = 0;
	let offsetX = 0;
	let draggedIndex = -1;
	let hoveredIndex = -1;
	let lastSwapTime = 0;
	let targetIndex = -1;
	let isSettingsOpen = false;
	let newTabName = '';
	let editingTabs = [...tabs];
	let editingTabId: string | null = null;

	const position = spring(
		{ x: 0 },
		{
			stiffness: 0.15,
			damping: 0.7
		}
	);

	onMount(() => {
		if (browser) {
			tabs = getInitialTabs();
			activeTab = localStorage.getItem('activeTab') || 'calculator';
			isLoading = false;
		}

		const initDragAndDrop = () => {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		};

		initDragAndDrop();

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});

	function handleMouseDown(e: MouseEvent, tab: HTMLElement, index: number) {
		if (!browser) return;
		isDragging = true;
		draggedTab = tab;
		draggedIndex = index;

		const rect = tab.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		startX = e.clientX;

		tab.style.cursor = 'grabbing';
		tab.style.zIndex = '10';
	}

	function handleMouseMove(e: MouseEvent) {
		if (!draggedTab) return;

		const moveX = e.clientX - startX;
		position.set({ x: moveX });

		const draggedRect = draggedTab.getBoundingClientRect();
		const draggedCenter = draggedRect.left + draggedRect.width / 2;
		const tabsContainer = document.querySelector('[role="toolbar"]');

		if (!tabsContainer) return;

		const visibleTabs = tabs.filter((tab: any) => tab.checked);
		const visibleTabsCount = visibleTabs.length;
		targetIndex = -1;

		// 각 보이는 탭에 대해 검사
		for (let i = 0; i < visibleTabsCount; i++) {
			const currentTab = document.getElementById(`tab-${i}`);
			if (!currentTab || i === draggedIndex) continue;

			const rect = currentTab.getBoundingClientRect();

			// 버튼 영역 전체를 감지 영역으로 사용
			if (draggedCenter >= rect.left && draggedCenter <= rect.right) {
				targetIndex = i;
				break;
			}
		}

		// 맨 앞으로 드래그하는 경우
		const firstTab = document.getElementById('tab-0');
		if (firstTab && draggedIndex !== 0) {
			const firstRect = firstTab.getBoundingClientRect();
			if (draggedCenter <= firstRect.right) {
				targetIndex = 0;
			}
		}

		// 맨 뒤로 드래그하는 경우
		const lastTab = document.getElementById(`tab-${visibleTabsCount - 1}`);
		if (lastTab && draggedIndex !== visibleTabsCount - 1) {
			const lastRect = lastTab.getBoundingClientRect();
			if (draggedCenter >= lastRect.left) {
				targetIndex = visibleTabsCount - 1;
			}
		}
	}

	function handleMouseUp() {
		if (draggedTab) {
			if (targetIndex !== -1 && targetIndex !== draggedIndex) {
				const visibleTabs = tabs.filter((tab: any) => tab.checked);
				const draggedVisibleTab = visibleTabs[draggedIndex];
				const targetVisibleTab = visibleTabs[targetIndex];
				const actualDraggedIndex = tabs.findIndex((tab: any) => tab.id === draggedVisibleTab.id);
				const actualTargetIndex = tabs.findIndex((tab: any) => tab.id === targetVisibleTab.id);
				const newTabs = [...tabs];
				const [movedTab] = newTabs.splice(actualDraggedIndex, 1);
				newTabs.splice(actualTargetIndex, 0, movedTab);
				tabs = newTabs;

				if (browser) {
					localStorage.setItem('tabs', JSON.stringify(tabs));
				}
			}

			position.set({ x: 0 });
			isDragging = false;
			if (draggedTab) {
				draggedTab.style.cursor = 'grab';
				draggedTab.style.zIndex = '';
			}
			draggedTab = null;
			draggedIndex = -1;
			targetIndex = -1;
		}
	}

	function handleMouseEnter(index: number) {
		if (!isDragging) hoveredIndex = index;
	}

	function handleMouseLeave() {
		if (!isDragging) hoveredIndex = -1;
	}

	function switchTab(tabId: string) {
		if (!isDragging) {
			activeTab = tabId;
			if (browser) {
				localStorage.setItem('activeTab', tabId);
			}
		}
	}

	function openSettings() {
		const checkedTabs = tabs.filter((tab: any) => tab.checked);
		const uncheckedTabs = tabs.filter((tab: any) => !tab.checked);
		editingTabs = [...checkedTabs, ...uncheckedTabs];
		isSettingsOpen = true;
	}

	function closeSettings() {
		isSettingsOpen = false;
		editingTabs = [...tabs];
	}

	function saveSettings() {
		const previousTabs = [...tabs];
		const checkedTabs = editingTabs.filter((tab) => tab.checked);
		const uncheckedTabs = editingTabs.filter((tab) => !tab.checked);
		tabs = [...checkedTabs, ...uncheckedTabs];

		// 새로 추가된 탭 찾기
		const newTab = editingTabs.find((tab) => tab.checked && !previousTabs.find((prevTab) => prevTab.id === tab.id && prevTab.checked));

		// 현재 활성 탭이 비활성화되었는지 확인
		const activeTabStillExists = tabs.find((tab: any) => tab.id === activeTab && tab.checked);

		// 로 추가된 탭이 있으면 그 탭으로 전환, 아니면서 활성 탭이 비활성화되었다면 첫 번째 활성화된 탭으로 전환
		if (newTab) {
			activeTab = newTab.id;
		} else if (!activeTabStillExists) {
			const firstCheckedTab = tabs.find((tab: any) => tab.checked);
			if (firstCheckedTab) {
				activeTab = firstCheckedTab.id;
			}
		}

		if (browser) {
			localStorage.setItem('activeTab', activeTab);
			localStorage.setItem('tabs', JSON.stringify(tabs));
		}
		draggedIndex = -1;
		targetIndex = -1;
		isSettingsOpen = false;
	}

	const autofocus = (node: HTMLElement) => {
		node.focus();
	};
</script>

<div>
	{#if !isLoading}
		<div role="toolbar" tabindex="0" class="relative flex items-center">
			{#each tabs.filter((tab: any) => tab.checked) as tab, i (tab.id)}
				<button
					id="tab-{i}"
					animate:flip={{
						duration: 200,
						easing: (t) => t
					}}
					style={draggedIndex === i ? `transform: scale(1.05) translateX(${$position.x}px);  box-shadow: 0 8px 24px rgba(0,0,0,0.15);` : targetIndex === i && isDragging ? 'position: relative;' : ''}
					on:mousedown={(e) => handleMouseDown(e, e.currentTarget, i)}
					on:mouseenter={() => handleMouseEnter(i)}
					on:mouseleave={handleMouseLeave}
					on:click={() => switchTab(tab.id)}
					class="group relative rounded-t-lg px-4 py-2
						{activeTab === tab.id ? 'bg-bg-100' : 'bg-bg-300 hover:bg-bg-100'}
						{isDragging ? 'cursor-grabbing select-none' : ''}
						{draggedIndex === i ? 'z-10' : ''}
						transition-all duration-200 ease-out"
				>
					{#if targetIndex === i && isDragging}
						<div class="absolute inset-0 animate-[pulse_0.5s_ease-in-out_infinite] rounded-t-lg bg-bg-100 opacity-10"></div>
					{/if}
					<div
						class="absolute inset-x-0 -top-4 flex justify-center
						{!isDragging ? 'transition-opacity group-hover:opacity-100' : ''}"
					>
						<svg class="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM16 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM8 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM16 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
						</svg>
					</div>
					<span>{tab.label}</span>
				</button>
			{/each}

			<!-- 설정 -->
			<button
				on:click={openSettings}
				class="rounded-t-lg px-4 py-2 transition-all duration-300 hover:scale-110
					{isDragging ? '' : 'hover:rotate-180'}"
				aria-label="설정"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>

		<section class="relative z-10 mb-8 flex min-h-[600px] justify-center rounded-b-xl bg-bg-200 shadow-primary">
			{#if activeTab === 'calculator'}
				<svelte:component this={Calculator} />
			{:else if activeTab === 'homework'}
				<svelte:component this={Homework} />
			{:else if activeTab === 'classInfo'}
				<svelte:component this={ClassInfo} />
			{/if}
		</section>

		<!-- 설정 모달 -->
		{#if isSettingsOpen}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div class="max-h-[80vh] w-[500px] overflow-y-auto rounded-lg bg-bg-300 p-6">
					<h2 class="mb-4 text-xl font-bold">탭 설정</h2>

					<!-- 탭 목록 -->
					<div class="mb-4 space-y-2">
						{#each editingTabs as tab, i (tab.id)}
							<div class="flex h-9 items-center gap-2">
								<div class="flex flex-1 items-center gap-2">
									<input
										type="checkbox"
										checked={tab.checked}
										disabled={editingTabs.filter((t) => t.checked).length <= 1 && tab.checked}
										on:change={(e) => {
											const index = editingTabs.findIndex((t) => t.id === tab.id);
											editingTabs[index] = {
												...editingTabs[index],
												checked: (e.target as HTMLInputElement).checked
											};
											editingTabs = [...editingTabs];
										}}
										class="h-4 w-4 rounded border-gray-300"
										id={`tab-checkbox-${tab.id}`}
									/>
									<div class="flex flex-1 items-center">
										{#if editingTabId === tab.id}
											<input
												type="text"
												value={tab.label}
												use:autofocus
												on:blur={() => {
													editingTabId = null;
												}}
												on:keydown={(e) => {
													if (e.key === 'Enter') {
														editingTabId = null;
													}
												}}
												on:input={(e) => {
													const index = editingTabs.findIndex((t) => t.id === tab.id);
													editingTabs[index] = { ...editingTabs[index], label: (e.target as HTMLInputElement).value };
													editingTabs = [...editingTabs];
												}}
												class="flex-1 rounded border border-gray-300 px-2 py-1"
											/>
										{:else}
											<div class="flex flex-1 items-center justify-between">
												<label for={`tab-checkbox-${tab.id}`} class="cursor-pointer px-2">
													{tab.label}
												</label>
												<button aria-label="탭 이름 수정" on:click={() => (editingTabId = tab.id)} class="rounded p-1 hover:bg-gray-100">
													<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
														<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
													</svg>
												</button>
											</div>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- 버튼들 -->
					<div class="flex justify-end gap-2">
						<button on:click={closeSettings} class="rounded px-4 py-2 hover:bg-gray-500"> 취소 </button>
						<button on:click={saveSettings} class="rounded bg-primary-100 px-4 py-2 hover:bg-primary-100"> 저장 </button>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<!-- 선택사항: 로딩 중 표시 -->
		<div class="flex h-12 items-center justify-center">
			<div class="h-2 w-2 animate-pulse rounded-full bg-gray-300"></div>
		</div>
	{/if}
</div>

<style>
	button {
		touch-action: none;
		-webkit-user-select: none;
		user-select: none;
		will-change: transform;
	}

	/* 드래그 중이 아닐 때만 hover 효과 적용 */
	.group:not(.cursor-grabbing):hover {
		cursor: grab;
	}
</style>
