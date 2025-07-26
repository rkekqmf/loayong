<script>
	let stages = ['1막', '2막', '3막'];
	let selectedStage = '1막';
	let difficulty = '노말';

	let allBosses = [
		{ stage: '1막', gate: '1관', difficulty: '노말', hp: 1779.56, cutFrom: 266.93, cutTo: 355.91 },
		{ stage: '1막', gate: '2관', difficulty: '노말', hp: 2043.63, cutFrom: 306.54, cutTo: 408.73 },
		{ stage: '1막', gate: '1관', difficulty: '하드', hp: 2990.24, cutFrom: 448.54, cutTo: 598.05 },
		{ stage: '1막', gate: '2관', difficulty: '하드', hp: 3840.42, cutFrom: 576.06, cutTo: 768.08 },
		{ stage: '2막', gate: '1관', difficulty: '노말', hp: 3220.71, cutFrom: 483.11, cutTo: 644.14 },
		{ stage: '2막', gate: '2관', difficulty: '노말', hp: 3853.60, cutFrom: 578.04, cutTo: 770.72 },
		{ stage: '2막', gate: '1관', difficulty: '하드', hp: 5984.32, cutFrom: 897.65, cutTo: 1196.86 },
		{ stage: '2막', gate: '2관', difficulty: '하드', hp: 8177.60, cutFrom: 1226.64, cutTo: 1635.52 },
		{ stage: '3막', gate: '1관', difficulty: '노말', hp: 3515.65, cutFrom: 527.35, cutTo: 703.13 },
		{ stage: '3막', gate: '2관', difficulty: '노말', hp: 3845.83, cutFrom: 483.54, cutTo: 647.07 },
		{ stage: '3막', gate: '3관', difficulty: '노말', hp: 6770.75, cutFrom: 1015.61, cutTo: 1354.15 },
		{ stage: '3막', gate: '1관', difficulty: '하드', hp: 6220.50, cutFrom: 933.07, cutTo: 1244.1 },
		{ stage: '3막', gate: '2관', difficulty: '하드', hp: 6095.13, cutFrom: 914.27, cutTo: 1219.02 },
		{ stage: '3막', gate: '3관', difficulty: '하드', hp: 14386.80, cutFrom: 2158.02, cutTo: 2877.36 }
	];

	let damageInputs = {};

	// 필터링된 보스 리스트
	$: filteredBosses = allBosses.filter(b => b.stage === selectedStage && b.difficulty === difficulty);

	// 딜 값 파싱
	$: dmgValues = Object.fromEntries(
		filteredBosses.map(b => [b.gate, parseFloat(damageInputs[b.gate]?.replace(/,/g, '') || 0)])
	);

	function getCutStatus(boss, dmg) {
		if (dmg <= boss.cutFrom && dmg > 0) return '🛡️ 투사';
		if (dmg > boss.cutFrom && dmg <= boss.cutTo) return '💪 강직한 투사';
		if (dmg > boss.cutTo) return '🩸 잔혹한 혈투사';
		return '';
	}

	function getColorClass(status) {
		if (status.includes('투사')) return 'text-blue-400';
		if (status.includes('강직')) return 'text-yellow-400';
		if (status.includes('잔혹')) return 'text-red-500';
		return '';
	}
</script>

<div class="p-4 mx-auto space-y-6">
	<div class="space-y-2">
		<label class="font-bold text-lg">선택</label>
		<select bind:value={selectedStage} class="input">
			{#each stages as stage}
				<option value={stage}>{stage}</option>
			{/each}
		</select>
	</div>

	<div class="space-x-4">
		<label>
			<input type="radio" bind:group={difficulty} value="노말" />
			노말
		</label>
		<label>
			<input type="radio" bind:group={difficulty} value="하드" />
			하드
		</label>
	</div>

	<div class="flex gap-4">
		{#each filteredBosses as boss}
			<div class="p-4 border rounded-lg bg-gray-50 shadow min-w-[250px]">
				<h2 class="text-lg font-bold mb-2 text-black">{boss.gate} ({difficulty}) - HP: {boss.hp}억</h2>
				
				<input
					type="text"
					class="input mb-2"
					placeholder="딜 입력 (예: 355.91)"
					bind:value={damageInputs[boss.gate]}
				/>

				{#if damageInputs[boss.gate]}
					<p class="text-base font-bold text-black">
						딜 비율: {(dmgValues[boss.gate] / boss.hp * 100).toFixed(2)}%
					</p>
					<p class="text-xl font-bold cut-flash {getColorClass(getCutStatus(boss, dmgValues[boss.gate]))}">
						{getCutStatus(boss, dmgValues[boss.gate])}
					</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		background-color: #fff;
		font-size: 1rem;
		color: #000;
	}
	.cut-flash {
		animation: shine 1.2s infinite alternate;
	}
	@keyframes shine {
		0% { transform: scale(1); opacity: 0.9; }
		100% { transform: scale(1.05); opacity: 1; }
	}
</style>
