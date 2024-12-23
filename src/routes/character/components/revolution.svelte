<script>
	import { classData, commonRevolutionImages } from '$lib/data/classData';
	import { fly } from 'svelte/transition';
	export let data;
	export let characterClassName;
	let hoveringItems = {};
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

<article>
	<div class="grid grid-cols-6 gap-3 rounded-lg">
		{#each commonRevolutionImages as { imageNum, name } (imageNum)}
			{@const evolutionInfo = evolutionData.find((data) => data.iconNum === imageNum)}
			<div class="relative aspect-square w-full" role="button" tabindex="0" on:mouseenter={() => (hoveringItems[imageNum] = true)} on:mouseleave={() => (hoveringItems[imageNum] = false)}>
				<img
					src="/ark_passive/00/{imageNum}.png"
					alt={name}
					on:error={handleImageError}
					class="h-full w-full rounded-md border border-gray-200 object-contain {evolutionInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {evolutionInfo ? '1' : '0.5'}"
				/>
				{#if evolutionInfo}
					<div class="absolute bottom-0">
						<span class="rounded bg-black bg-opacity-70 px-1.5 py-0.5 text-xs text-white">
							Lv.{evolutionInfo.level}
						</span>
					</div>
				{/if}
				{#if hoveringItems[imageNum]}
					<div class="absolute inset-0 flex items-center justify-center" transition:fly={{ y: 20, duration: 300 }}>
						<div class="rounded-md bg-black bg-opacity-80 p-2 text-sm text-white">
							{name}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</article>

<style>
</style>
