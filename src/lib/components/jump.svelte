<script>
	export let data;
	const numbers = [54, 10];
	const jumpNumber = [1, 2, 3, 5];
	const testNumbers = [9, 10, 11, 12];

	function handleImageError(event) {
		event.target.style.display = 'none';
	}

	function extractNumberFromUrl(url) {
		console.log('URL to extract:', url);
		const match = url.match(/ark_passive_\w+_(\d+)\.png$/);
		return match ? parseInt(match[1]) : null;
	}

	$: jumpData =
		data?.Effects?.filter((effect) => effect.Name === '도약')?.map((effect) => ({
			iconNum: extractNumberFromUrl(effect.Icon)
		})) || [];

	$: {
		console.log('Jump data:', jumpData);
	}
</script>

<section class="chartContainer">
	<h2 class="mb-6 inline-block border-b-2 border-blue-500 pb-2 text-2xl text-gray-800">도약</h2>
	<div class="flex flex-wrap gap-3 rounded-lg bg-gray-50 p-4">
		{#each numbers as num}
			{@const jumpInfo = jumpData.find((data) => data.iconNum === num)}
			<img
				src="https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_01/ark_passive_01_{num}.png"
				alt="도약 {num}"
				on:error={handleImageError}
				class="h-20 w-20 rounded-md border border-gray-200 {jumpInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
				style="opacity: {jumpInfo ? '1' : '0.5'}"
				title={num.toString()}
			/>
		{/each}

		{#each jumpNumber as num}
			{@const jumpInfo = jumpData.find((data) => data.iconNum === num)}
			<img
				src="https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_02/ark_passive_02_{num}.png"
				alt="도약 {num}"
				on:error={handleImageError}
				class="h-20 w-20 rounded-md border border-gray-200 {jumpInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
				style="opacity: {jumpInfo ? '1' : '0.5'}"
				title={num.toString()}
			/>
		{/each}

		{#each testNumbers as num}
			{@const jumpInfo = jumpData.find((data) => data.iconNum === num)}
			<img
				src="https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_ac/ark_passive_ac_{num}.png"
				alt="도약 {num}"
				on:error={handleImageError}
				class="h-20 w-20 rounded-md border border-gray-200 {jumpInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
				style="opacity: {jumpInfo ? '1' : '0.5'}"
				title={num.toString()}
			/>
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
		background: radial-gradient(circle at center, #e8fef1, #82a764), linear-gradient(to bottom, #e8fef1, #77b790);
		position: relative;
		overflow: hidden;
	}
</style>
