<script>
	import { fade } from 'svelte/transition';
	let partySize = 16;
	let driverCount = 4;
	let nonParticipantCount = 11;
	let soloParticipantCount = 1;
	let nonParticipantPrice = 10000;
	let soloParticipantPrice = 15000;
	// 천 단위 구분자 포맷팅 함수
	function formatNumber(num) {
		return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	function parseNumber(str) {
		return parseInt(str?.replace(/,/g, '') || 0);
	}
	// 버튼 클릭 시 partySize 값 설정
	function setPartySize(size) {
		partySize = size;
	}
	// 포맷된 값을 저장할 변수들
	let formattedNonParticipantPrice = formatNumber(nonParticipantPrice);
	let formattedSoloParticipantPrice = formatNumber(soloParticipantPrice);

	// 값이 변경될 때마다 실제 값과 포맷된 값을 동기화
	$: {
		formattedNonParticipantPrice = formatNumber(nonParticipantPrice);
		formattedSoloParticipantPrice = formatNumber(soloParticipantPrice);
	}
	$: nonParticipantTradePrice = nonParticipantPrice + (soloParticipantPrice - nonParticipantPrice) / partySize;

	$: soloAuctionPrice = soloParticipantPrice - nonParticipantPrice - (soloParticipantPrice - nonParticipantPrice) / partySize;

	$: driverDistribution = nonParticipantTradePrice * 0.95 + soloAuctionPrice / (partySize - 1);

	$: nonParticipantCount = partySize - driverCount - soloParticipantCount;

	$: xValue = (soloParticipantPrice - nonParticipantPrice) / partySize;

	$: yValue = (allParticipantDriverDistribution - xValue) / (partySize - 1);

	$: allParticipantNonParticipantPrice =
		(((nonParticipantPrice * nonParticipantCount + soloParticipantPrice) / driverCount - (soloParticipantPrice - nonParticipantPrice) / partySize) / (nonParticipantCount + soloParticipantCount)) * (partySize - 1);

	$: allParticipantSoloPrice = ((soloParticipantPrice - nonParticipantPrice) / partySize + allParticipantNonParticipantPrice / (partySize - 1)) * (partySize - 1);

	$: allParticipantDriverDistribution = (nonParticipantPrice * nonParticipantCount + soloParticipantPrice) / driverCount;
</script>

<div class="w-full space-y-4 p-4">
	<div class="mb-2 gap-4 rounded-lg border border-text-100 p-4">
		<h3 class="mb-3 text-lg">파티 설정</h3>
		<div class="mb-3 flex gap-2">
			{#each [{ size: 4, text: '4인 파티' }, { size: 8, text: '8인 파티' }, { size: 16, text: '16인 파티' }] as { size, text }}
				<button
					class="relative rounded-lg px-4 py-2 transition-colors duration-300 ease-in-out
					{partySize === size ? 'bg-accent-100' : 'bg-primary-100'} 
					hover:bg-accent-100"
					on:click={() => setPartySize(size)}
				>
					{#if partySize === size}
						<span transition:fade={{ duration: 150 }} class="absolute -right-1 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-text-200 text-xs">✓</span>
					{/if}
					<span>{text}</span>
				</button>
			{/each}
		</div>
		<div class="flex flex-wrap gap-4">
			<label class="min-w-[120px] flex-1">
				기사인원
				<input type="number" bind:value={driverCount} class="input focus:outline-none" />
			</label>
			<label class="min-w-[120px] flex-1">
				미참인원
				<input type="number" value={nonParticipantCount} disabled class="input disabled:opacity-50" />
			</label>
		</div>
	</div>

	<div class="mb-2 gap-4 rounded-lg border border-text-100 p-4">
		<h3 class="mb-3 text-lg">가격 설정</h3>
		<div class="flex flex-wrap gap-4">
			<label class="min-w-[120px] flex-1">
				미참가격
				<input type="text" class="input" value={formattedNonParticipantPrice} on:input={(e) => (nonParticipantPrice = parseNumber(e.target.value))} />
			</label>
			<label class="min-w-[120px] flex-1">
				독식가격
				<input type="text" class="input" value={formattedSoloParticipantPrice} on:input={(e) => (soloParticipantPrice = parseNumber(e.target.value))} />
			</label>
		</div>
	</div>

	<div class="mb-2 gap-4 rounded-lg border border-text-100 p-4">
		<h3 class="mb-3 text-lg">계산 결과</h3>
		<div class="flex flex-col gap-4">
			<div class="result-section">
				<h4 class="mb-2">독식 입찰</h4>
				{#each [{ label: '미참 거래가격', value: nonParticipantTradePrice }, { label: '독식 경매가격', value: soloAuctionPrice }, { label: '기사 분배금액', value: driverDistribution }] as item}
					<div class="result-item">
						<span class="text-text-200">{item.label}:</span>
						<span class="font-bold">{item.value.toLocaleString()}</span>
					</div>
				{/each}
			</div>

			<div class="result-section">
				<h4 class="mb-2">손님 모두 입찰</h4>
				{#each [{ label: '미참 경매가격', value: allParticipantNonParticipantPrice }, { label: '독식 경매가격', value: allParticipantSoloPrice }, { label: '기사 분배금액', value: allParticipantDriverDistribution }] as item}
					<div class="result-item">
						<span class="text-text-200">{item.label}:</span>
						<span class="font-bold">{item.value.toLocaleString()}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.input {
		@apply mt-1 w-full rounded border border-white/20 bg-white/10 px-2 py-1;
	}

	label {
		@apply flex flex-col;
	}

	.result-item {
		@apply mb-1 flex justify-between border-b border-white/10 py-1;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	button::after {
		content: '';
		@apply absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-200;
	}

	button:active::after {
		@apply opacity-100;
	}
</style>
