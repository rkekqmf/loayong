<script>
	import { slide } from 'svelte/transition';
	import { classEngravings } from '$lib/data/classData';
	import { goto } from '$app/navigation';
	import { classes } from '$lib/data/classData';

	export let selectedClass; // URL 파라미터에서 받은 현재 클래스 코드

	// 현재 선택된 클래스 객체 찾기
	$: currentClass = classes.find((c) => c.code === selectedClass) || classes[0];
	$: currentEngravings = classEngravings[currentClass.name] || []; // name을 사용하도록 수정

	async function handleClassChange(event) {
		const selectedClassCode = event.target.value;
		selectedClass = selectedClassCode;
		activeEngraving = ''; // 클래스 변경시 활성 각인 초기화
		await goto(`/class/${selectedClassCode}`, {
			replaceState: true,
			noScroll: true // 스크롤 이동 방지
		});
	}

	let activeEngraving = '';

	// 토글 상태의 기본값을 true로 변경
	let toggleStates = {
		skills: true,
		effects: true,
		combos: true,
		tripod: true,
		rune: true
	};
	let masterToggle = true; // 마스터 토글도 true로 초기화

	// activeEngraving 초기화 로직 수정
	$: if (currentEngravings.length > 0) {
		activeEngraving = activeEngraving || currentEngravings[0];
	}

	// 마스터 토글 업데이트 함수 수정
	function updateMasterToggle() {
		masterToggle = Object.values(toggleStates).every((state) => state);
	}

	// 디버깅을 위한 반응형 선언
	$: console.log('toggleStates:', toggleStates);
	$: console.log('masterToggle:', masterToggle);
</script>

<div class="flex w-full gap-4">
	{#if currentEngravings.length > 0}
		<div class=" mb-6 flex h-fit w-64 flex-shrink-0 flex-col gap-4">
			<div class="relative flex w-full flex-col items-center justify-center gap-4">
				<img src="/class/{currentClass.code}.png" alt={currentClass.name} class="h-24 w-24 brightness-0 invert" />
				<p class="absolute -bottom-2 text-base text-white">{currentClass.name}</p>
			</div>

			<div class="button-group flex w-full gap-2">
				{#each currentEngravings as engraving}
					<button class="engraving-button flex-1 bg-bg-300 hover:bg-accent-100 {activeEngraving === engraving ? 'active' : ''}" on:click={() => (activeEngraving = activeEngraving === engraving ? '' : engraving)}>
						{engraving}
					</button>
				{/each}
			</div>

			<div class="mt-4 flex flex-col gap-2">
				<div class="">
					<label class="toggle-container">
						<input
							type="checkbox"
							bind:checked={masterToggle}
							on:change={() => {
								Object.keys(toggleStates).forEach((key) => {
									toggleStates[key] = masterToggle;
								});
							}}
						/>
						<span class="toggle-label">전체 선택</span>
					</label>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<label class="toggle-container">
						<input type="checkbox" bind:checked={toggleStates.skills} on:change={updateMasterToggle} />
						<span class="toggle-label">스킬 정보</span>
					</label>
					<label class="toggle-container">
						<input type="checkbox" bind:checked={toggleStates.effects} on:change={updateMasterToggle} />
						<span class="toggle-label">스킬 효과</span>
					</label>
					<label class="toggle-container">
						<input type="checkbox" bind:checked={toggleStates.combos} on:change={updateMasterToggle} />
						<span class="toggle-label">연계</span>
					</label>
					<label class="toggle-container">
						<input type="checkbox" bind:checked={toggleStates.tripod} on:change={updateMasterToggle} />
						<span class="toggle-label">트라이포드</span>
					</label>
					<label class="toggle-container">
						<input type="checkbox" bind:checked={toggleStates.rune} on:change={updateMasterToggle} />
						<span class="toggle-label">룬 효과</span>
					</label>
				</div>
			</div>

			<div class="mt-4 border-t border-bg-300 pt-4">
				<p class="mb-2 text-center text-sm font-medium">직업 선택</p>
				<div class="grid grid-cols-3 gap-2">
					{#each classes as classItem}
						<button
							class="flex flex-col items-center rounded-lg p-2 transition-colors
								{currentClass.code === classItem.code ? 'bg-primary-100' : 'bg-bg-300 hover:bg-accent-100'}"
							on:click={() => handleClassChange({ target: { value: classItem.code } })}
						>
							<img src="/class/{classItem.code}.png" alt={classItem.name} class="h-8 w-8 brightness-0 invert" />
							<span class="mt-1 text-center text-xs">{classItem.name}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="engraving-container w-full">
			<!-- 선택된 각인 정보 표시 영역 -->
			{#if activeEngraving}
				<div class="engraving-details min-h-[600px]" transition:slide>
					<div class="engraving-content">
						<h3 class="mb-4 text-xl font-bold">{activeEngraving}</h3>

						<!-- 아코디언 섹션 수정 -->
						<div class="accordion-sections">
							{#if toggleStates.skills}
								<div class="accordion-item" transition:slide>
									<div class="section-header">
										스킬
										<div class="mt-2 border-b-2 border-primary-100"></div>
									</div>
									<div class="section-content">
										<div class="p-4">
											<h4 class="mb-2 text-lg font-medium">기본 스킬 정보</h4>
											<ul class="list-disc space-y-2 pl-4">
												<li>스킬 레벨: 10</li>
												<li>쿨타임: 15초</li>
												<li>타격 횟수: 3회</li>
												<li>기본 대미지: 1500%</li>
											</ul>
										</div>
									</div>
								</div>
							{/if}

							{#if toggleStates.effects}
								<div class="accordion-item" transition:slide>
									<div class="section-header">
										스킬 효과
										<div class="mt-2 border-b-2 border-primary-100"></div>
									</div>
									<div class="section-content">
										<div class="p-4">
											<h4 class="mb-2 text-lg font-medium">효과 상세</h4>
											<ul class="list-disc space-y-2 pl-4">
												<li>30% 확률로 출혈 효과 5초간 부여</li>
												<li>적중된 적에게 3초간 방어력 30% 감소</li>
												<li>백어택 시 추가 대미지 30%</li>
											</ul>
										</div>
									</div>
								</div>
							{/if}

							{#if toggleStates.combos}
								<div class="accordion-item" transition:slide>
									<div class="section-header">
										연계
										<div class="mt-2 border-b-2 border-primary-100"></div>
									</div>
									<div class="section-content">
										<div class="p-4">
											<h4 class="mb-2 text-lg font-medium">추천 연계</h4>
											<div class="space-y-3">
												<div class="combo-sequence">
													<p class="font-medium">기본 연계:</p>
													<p class="text-accent-100">스킬A → 스킬B → 스킬C</p>
												</div>
												<div class="combo-sequence">
													<p class="font-medium">버스트 연계:</p>
													<p class="text-accent-100">스킬X → 스킬Y → 궁극기</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							{/if}

							{#if toggleStates.tripod}
								<div class="accordion-item" transition:slide>
									<div class="section-header">
										트라이포드
										<div class="mt-2 border-b-2 border-primary-100"></div>
									</div>
									<div class="section-content">
										<div class="p-4">
											<h4 class="mb-2 text-lg font-medium">추천 트라이포드</h4>
											<div class="grid grid-cols-3 gap-4">
												<div class="tripod-item">
													<p class="font-medium">1단계</p>
													<p>대미지 증가 +30%</p>
												</div>
												<div class="tripod-item">
													<p class="font-medium">2단계</p>
													<p>쿨타임 감소 -2초</p>
												</div>
												<div class="tripod-item">
													<p class="font-medium">3단계</p>
													<p>범위 증가 +20%</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							{/if}

							{#if toggleStates.rune}
								<div class="accordion-item" transition:slide>
									<div class="section-header">
										룬 효과
										<div class="mt-2 border-b-2 border-primary-100"></div>
									</div>
									<div class="section-content">
										<div class="p-4">
											<h4 class="mb-2 text-lg font-medium">추천 룬</h4>
											<div class="space-y-3">
												<div class="rune-item">
													<p class="font-medium text-purple-400">질풍 룬</p>
													<p>스킬 시전 속도 +12%</p>
												</div>
												<div class="rune-item">
													<p class="font-medium text-orange-400">출��� 룬</p>
													<p>5초간 출혈 대미지 추가</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.engraving-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.engraving-button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.engraving-button.active {
		background: var(--primary-100);
		color: white;
		border-color: var(--primary-100);
	}

	.engraving-details {
		background: var(--bg-100);
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.info-tabs {
		display: flex;
		gap: 1rem;
		border-bottom: 1px solid var(--bg-300);
		margin-bottom: 1rem;
	}

	.info-tab {
		padding: 0.5rem 1rem;
		border-bottom: 2px solid transparent;
		transition: all 0.2s;
	}

	.info-tab.active {
		border-bottom-color: var(--primary-100);
		color: var(--primary-100);
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

	.accordion-sections {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.accordion-item {
		border: 1px solid var(--bg-300);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.accordion-header {
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--bg-200);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.accordion-header:hover {
		background-color: var(--bg-300);
	}

	.accordion-content {
		padding: 1rem;
		background-color: var(--bg-100);
	}

	.section-header {
		padding: 1rem;
		font-weight: 600;
		font-size: 1.1rem;
		background-color: var(--bg-200);
	}

	.section-content {
		background-color: var(--bg-100);
	}

	.tripod-item,
	.rune-item {
		padding: 0.5rem;
		background-color: var(--bg-200);
		border-radius: 0.25rem;
	}

	.combo-sequence {
		padding: 0.5rem;
		background-color: var(--bg-200);
		border-radius: 0.25rem;
	}
</style>
