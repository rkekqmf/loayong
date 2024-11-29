<script lang="ts">
	import { onMount } from 'svelte';

	let allImages: string[] = [];
	let loadedImages: string[] = [];

	onMount(() => {
		const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

		// 2자리 조합 (예: aa, ab, ac...)
		const combinations2 = letters.flatMap((l1) => letters.map((l2) => l1 + l2));
		const urls2 = combinations2.flatMap((combo) => Array.from({ length: 5 }, (_, i) => i + 1).map((num) => `https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_${combo}/ark_passive_${combo}_${num}.png`));

		// 3자리 조합으로 URL 생성
		const combinations3 = letters.flatMap((l1) => letters.flatMap((l2) => letters.map((l3) => l1 + l2 + l3)));

		const urls3 = combinations3.flatMap((combo) => Array.from({ length: 5 }, (_, i) => i + 1).map((num) => `https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_${combo}/ark_passive_${combo}_${num}.png`));

		// 특수 조합 추가
		const specialCombinations = [
			// 테스트용 접두어/접미어
			'pre',
			'post',
			'neo',
			'meta',
			'ultra',
			'hyper',
			'super',
			'mega',
			'proto',
			'arch',
			'grand',
			'high',
			'over',
			'under',
			'inner',
			'outer',
			'omni',
			'multi',
			'uni',
			'poly',
			'trans',
			'cyber',
			'quantum',
			'bio',
			'techno',
			'prime',
			'test',
			'temp',
			'demo',
			'sample',
			'basic',
			'simple',
			'easy',
			'quick',
			'new',
			'old',
			'main',
			'sub',
			'mini',
			'max',
			'min',
			'beta',
			'alpha',
			'dev',
			'debug',
			'exp',
			'tmp',
			'dummy',
			'mock',
			'fake',
			'real',
			'custom',
			'user',
			'sys',
			'app',
			'web',
			'net',
			'data',
			'info',
			'log',
			'cache',
			'temp',
			'auto',
			'manual',
			'default',
			'extra',
			'plus',
			'pro',
			'lite',
			'full',
			'half',
			'mid',
			'top',
			'bot',
			'left',
			'right',
			'center',
			'front',
			'back',
			'up',
			'down',
			'in',
			'out',
			'on',
			'off',

			// 상태
			'open',
			'close',
			'lock',
			'hide',
			'show',
			'active',
			'idle',
			'busy',
			'ready',
			'start',
			'stop',
			'pause',
			'play',
			'wait',
			'load',
			'save',
			'sync',
			'async',
			'enable',
			'disable',
			'pending',
			'success',
			'fail',
			'error',
			'cancel',
			'reset',
			'update',
			'refresh',
			'connect',
			'disconnect'
		];
		const specialUrls = specialCombinations.flatMap((combo) => Array.from({ length: 5 }, (_, i) => i + 1).map((num) => `https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_${combo}/ark_passive_${combo}_${num}.png`));

		// 원하는 조합만 주석 해제해서 사용
		allImages = [
			// ...specialUrls,
			// ...urls2
			...urls3
		];
	});

	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		const container = img.parentElement;
		if (container) {
			container.style.display = 'none';
		}
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		const combo = img.src.split('ark_passive_')[1].split('/')[0];
		if (!loadedImages.includes(combo)) {
			loadedImages = [...loadedImages, combo];
			console.log('발견된 조합:', combo);
		}
	}
</script>

<div>
	<h3>발견된 조합들:</h3>
	<div style="margin-bottom: 20px;">
		{#each loadedImages as combo}
			<span style="margin-right: 10px;">{combo}</span>
		{/each}
	</div>
</div>

<div class="image-grid">
	{#each allImages as imageUrl}
		<div class="image-container">
			<img src={imageUrl} alt="ark passive" title={imageUrl} on:error={handleImageError} on:load={handleImageLoad} />
		</div>
	{/each}
</div>

<style>
	.image-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
		padding: 1rem;
	}

	.image-container {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
	}

	img {
		max-width: 100%;
		height: auto;
	}
</style>
