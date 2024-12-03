<script>
	import { classData, commonRevolutionImages } from '$lib/data/classData';
	export let data;
	export let characterClassName;

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

	$: evolutionData =
		data?.Effects?.filter((effect) => effect.Name === '진화')?.map((effect) => ({
			iconNum: extractNumberFromUrl(effect.Icon),
			level: extractLevel(effect.Description),
			name: extractName(effect.Description)
		})) || [];
</script>

<section class="chartContainer">
	<h2 class="mb-6 inline-block border-b-2 border-yellow-500 pb-2 text-2xl text-white">진화</h2>
	<div class="grid grid-cols-6 gap-3 rounded-lg p-4">
		{#each commonRevolutionImages as num}
			{@const evolutionInfo = evolutionData.find((data) => data.iconNum === num)}
			<div class="relative">
				<img
					src="/ark_passive/00/{num}.png"
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
</style>
