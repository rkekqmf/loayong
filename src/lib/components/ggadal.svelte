<script>
	export let data;
	const allNumbers = [{ type: 'ggadal', num: 6 }, { type: 'ggadal', num: 18 }, { type: 'ggadal', num: 21 }, { type: 'ggadal', num: 23 }, ...Array.from({ length: 8 }, (_, i) => ({ type: 'doyak', num: i + 1 }))];

	const gridPositions = [
		'col-start-2 row-start-1',
		'col-start-3 row-start-1',
		'col-start-2 row-start-2',
		'col-start-3 row-start-2',
		'col-start-1 row-start-3',
		'col-start-2 row-start-3',
		'col-start-3 row-start-3',
		'col-start-4 row-start-3',
		'col-start-1 row-start-4',
		'col-start-2 row-start-4',
		'col-start-3 row-start-4',
		'col-start-4 row-start-4'
	];

	function handleImageError(event) {
		event.target.style.display = 'none';
	}

	function extractNumberFromUrl(url) {
		const match = url.match(/ark_passive_\w+_(\d+)\.png$/);
		return match ? parseInt(match[1]) : null;
	}

	$: {
		console.log('Effects data:', data?.Effects);
		console.log('Ggadal data:', ggadalData);
	}

	$: ggadalData =
		data?.Effects?.filter((effect) => effect.Name === '깨달음')?.map((effect) => ({
			iconNum: extractNumberFromUrl(effect.Icon)
		})) || [];
</script>

<section class="chartContainer">
	<h2 class="mb-6 inline-block border-b-2 border-blue-500 pb-2 text-2xl text-gray-800">깨달음 & 도약</h2>
	<div class="grid-layout">
		{#each allNumbers as item, i}
			{@const ggadalInfo = ggadalData.find((data) => data.iconNum === item.num)}
			<div class="relative {gridPositions[i]}">
				<img
					src="https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_01/ark_passive_01_{item.num}.png"
					alt="깨달음 {item.num}"
					on:error={handleImageError}
					class="h-20 w-20 rounded-md border border-gray-200 {ggadalInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {ggadalInfo ? '1' : '0.5'}"
					title={item.num.toString()}
				/>
				<img
					src="https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_ac/ark_passive_ac_{item.num}.png"
					alt="도약 {item.num}"
					on:error={handleImageError}
					class="absolute left-0 top-0 h-20 w-20 rounded-md border border-gray-200 {ggadalInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {ggadalInfo ? '1' : '0.5'}"
					title={item.num.toString()}
				/>
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
		background: radial-gradient(circle at center, #e8fef1, #c6cfff), linear-gradient(to bottom, #e8fef1, #c6cfff);
		position: relative;
		overflow: hidden;
	}

	.grid-layout {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1rem;
		padding: 1rem;
		justify-items: center;
		max-width: 600px;
		margin: 0 auto;
	}
</style>
