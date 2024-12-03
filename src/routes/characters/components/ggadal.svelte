<script>
	import { classData } from '$lib/data/classData';
	export let characterClassName;
	export let data;

	// 해당 클래스의 깨달음 이미지 번호 가져오기
	const classGgadalImages = classData[characterClassName]?.ggadal.class || [];
	const folder01GgadalImages = classData[characterClassName]?.ggadal.folder01 || [];
	const folder02GgadalImages = classData[characterClassName]?.ggadal.folder02 || [];

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

	$: ggadalData =
		data?.Effects?.filter((effect) => effect.Name === '깨달음')?.map((effect) => ({
			iconNum: extractNumberFromUrl(effect.Icon)
		})) || [];
</script>

<section class="chartContainer">
	<h2 class="mb-6 inline-block border-b-2 border-blue-500 pb-2 text-2xl text-white">깨달음</h2>
	<div class="grid-layout">
		{#each folder01GgadalImages as imageNum, i}
			{@const ggadalInfo = ggadalData.find((data) => data.iconNum === imageNum)}
			<div class="relative {gridPositions[i]}">
				<img
					src="/ark_passive/01/{imageNum}.png"
					alt="깨달음 {imageNum}"
					on:error={handleImageError}
					class="h-20 w-20 rounded-md border border-gray-200 {ggadalInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {ggadalInfo ? '1' : '0.5'}"
					title={imageNum.toString()}
				/>
			</div>
		{/each}

		{#each folder02GgadalImages as imageNum, i}
			{@const ggadalInfo = ggadalData.find((data) => data.iconNum === imageNum)}
			<div class="relative {gridPositions[i]}">
				<img
					src="/ark_passive/02/{imageNum}.png"
					alt="깨달음 {imageNum}"
					on:error={handleImageError}
					class="h-20 w-20 rounded-md border border-gray-200 {ggadalInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {ggadalInfo ? '1' : '0.5'}"
					title={imageNum.toString()}
				/>
			</div>
		{/each}

		{#each classGgadalImages as imageNum, i}
			{@const ggadalInfo = ggadalData.find((data) => data.iconNum === imageNum)}
			<div class="relative {gridPositions[i]}">
				<img
					src="/ark_passive/{classData[characterClassName].code}/{imageNum}.png"
					alt="깨달음 {imageNum}"
					on:error={handleImageError}
					class="h-20 w-20 rounded-md border border-gray-200 {ggadalInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
					style="opacity: {ggadalInfo ? '1' : '0.5'}"
					title={imageNum.toString()}
				/>
			</div>
		{/each}
	</div>
</section>

<style>
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
