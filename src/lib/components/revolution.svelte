<script>
	export let data;

	const numbers = [1, 2, 3, 4, 5, 6, 12, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 27, 29, 32, 33, 34, 35, 38];

	function handleImageError(event) {
		event.target.style.display = 'none';
	}

	function extractNumberFromUrl(url) {
		const match = url.match(/evolution_(\d+)\.png$/);
		return match ? parseInt(match[1]) : null;
	}

	function extractLevel(description) {
		const match = description.match(/Lv\.(\d+)/);
		return match ? match[1] : '';
	}

	function extractName(description) {
		const matches = description.match(/#F1D594'>(.*?)<\/FONT>/g);
		if (matches && matches.length >= 2) {
			const secondMatch = matches[1].match(/#F1D594'>(.*?)<\/FONT>/);
			return secondMatch ? secondMatch[1].split(' ')[0] : '';
		}
		return '';
	}

	// data가 변경될 때마다 evolutionData를 다시 계산
	$: evolutionData =
		data?.Effects?.filter((effect) => effect.Name === '진화')?.map((effect) => ({
			iconNum: extractNumberFromUrl(effect.Icon),
			level: extractLevel(effect.Description),
			name: extractName(effect.Description)
		})) || [];
</script>

<section class="chartContainer">
	<h2 class="mb-6 inline-block border-b-2 border-emerald-500 pb-2 text-2xl text-gray-800">진화</h2>
	<div class="grid grid-cols-6 gap-3 rounded-lg bg-gray-50 p-4">
		{#each numbers as num}
			{@const evolutionInfo = evolutionData.find((data) => data.iconNum === num)}
			<div class="relative">
				<img
					src="https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_evolution/ark_passive_evolution_{num}.png"
					alt="진화 {num}"
					on:error={handleImageError}
					class="h-20 w-20 rounded-md border border-gray-200 {evolutionInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {evolutionInfo ? '1' : '0.5'}"
					title={num.toString()}
				/>
				{#if evolutionInfo}
					<div class="absolute bottom-[4px]">
						<span class="rounded bg-black bg-opacity-70 px-1.5 py-0.5 text-xs text-white">
							Lv.{evolutionInfo.level}
						</span>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.chartContainer {
		min-height: 765px;
		min-width: 800px;
		width: 100%;
		margin: 0 auto;
		box-shadow:
			inset 0 -3px 10px rgba(0, 0, 0, 0.4),
			inset 0 3px 10px rgba(255, 255, 255, 0.4),
			0 3px 8px rgba(0, 0, 0, 0.3);
		background: radial-gradient(circle at center, #e8fef1, #ffc6c6), linear-gradient(to bottom, #e8fef1, #77b790);
		position: relative;
		overflow: hidden;
	}
</style>
