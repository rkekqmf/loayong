<script>
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

<div class="w-full p-3">
	<div class="mb-2 rounded-lg bg-bg-300 p-2">
		<h3 class="mb-3 px-2 pt-1 text-lg">파티 설정</h3>
		<div class="mb-3 flex gap-2">
			<button class="btn hover:bg-bg-200" on:click={() => setPartySize(4)} class:active={partySize === 4}>4인 파티</button>
			<button class="btn" on:click={() => setPartySize(8)} class:active={partySize === 8}>8인 파티</button>
			<button class="btn" on:click={() => setPartySize(16)} class:active={partySize === 16}>16인 파티</button>
		</div>
		<div class="flex flex-wrap gap-4">
			<label class="min-w-[120px] flex-1">
				기사인원
				<input type="number" bind:value={driverCount} class="input" />
			</label>
			<label class="min-w-[120px] flex-1">
				미참인원
				<input type="number" value={nonParticipantCount} disabled class="input disabled:border-opacity-10 disabled:bg-opacity-20" />
			</label>
		</div>
	</div>

	<div class="mb-2 rounded-lg bg-bg-300 p-2">
		<h3 class="mb-3 px-2 pt-1 text-lg">가격 설정</h3>
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

	<div class="mb-2 rounded-lg bg-bg-300 p-2">
		<h3 class="mb-3 px-2 pt-1 text-lg">계산 결과</h3>
		<div class="flex flex-col gap-4">
			<div class="result-section">
				<h4 class="mb-2 text-lime-400">독식 입찰</h4>
				<div class="result-item">
					<span class="text-white/70">미참 거래가격:</span>
					<span class="font-bold">{nonParticipantTradePrice.toLocaleString()}</span>
				</div>
				<div class="result-item">
					<span class="text-white/70">독식 경매가격:</span>
					<span class="font-bold">{soloAuctionPrice.toLocaleString()}</span>
				</div>
				<div class="result-item">
					<span class="text-white/70">기사 분배금액:</span>
					<span class="font-bold">{driverDistribution.toLocaleString()}</span>
				</div>
			</div>

			<div class="result-section">
				<h4 class="mb-2 text-lime-400">손님 모두 입찰</h4>
				<div class="result-item">
					<span class="text-white/70">미참 경매가격:</span>
					<span class="font-bold">{allParticipantNonParticipantPrice.toLocaleString()}</span>
				</div>
				<div class="result-item">
					<span class="text-white/70">독식 경매가격:</span>
					<span class="font-bold">{allParticipantSoloPrice.toLocaleString()}</span>
				</div>
				<div class="result-item">
					<span class="text-white/70">기사 분배금액:</span>
					<span class="font-bold">{allParticipantDriverDistribution.toLocaleString()}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.btn:hover {
		background-color: #909090; /* 밝은 색상 추가 */
	}

	.btn.active {
		background-color: #909090; /* Active 상태 색상 */
	}

	.input:disabled {
		background-color: #1a1a1a; /* 어두운 배경색 */
	}

	.btn {
		@apply rounded border border-white/20 bg-white/10 px-4 py-2 transition-all;
	}

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
</style>
