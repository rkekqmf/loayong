<script>
	import { classData } from '$lib/data/classData';
	export let characterClassName;
	export let data;

	// 해당 클래스의 도약 이미지 번호 가져오기
	const classJumpImages = classData[characterClassName]?.jump.class || [];
	const folder01JumpImages = classData[characterClassName]?.jump.folder01 || [];
	const folder02JumpImages = classData[characterClassName]?.jump.folder02 || [];

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
	<h2 class="mb-6 inline-block border-b-2 border-green-500 pb-2 text-2xl text-white">도약</h2>
	<div class="flex flex-wrap gap-3 rounded-lg p-4">
		{#each folder01JumpImages as num}
			{@const jumpInfo = jumpData.find((data) => data.iconNum === num)}
			<img
				src="/ark_passive/01/{num}.png"
				alt="도약 {num}"
				on:error={handleImageError}
				class="h-20 w-20 rounded-md border border-gray-200 {jumpInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
				style="opacity: {jumpInfo ? '1' : '0.5'}"
				title={num.toString()}
			/>
		{/each}

		{#each folder02JumpImages as num}
			{@const jumpInfo = jumpData.find((data) => data.iconNum === num)}
			<img
				src="/ark_passive/02/{num}.png"
				alt="도약 {num}"
				on:error={handleImageError}
				class="h-20 w-20 rounded-md border border-gray-200 {jumpInfo ? 'transition-transform hover:scale-110 hover:shadow-md' : ''}"
				style="opacity: {jumpInfo ? '1' : '0.5'}"
				title={num.toString()}
			/>
		{/each}

		{#each classJumpImages as num}
			{@const jumpInfo = jumpData.find((data) => data.iconNum === num)}
			<img
				src="/ark_passive/{classData[characterClassName].code}/{num}.png"
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
</style>
