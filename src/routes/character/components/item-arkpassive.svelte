<script>
	import Ggadal from './ggadal.svelte';
	import Jump from './jump.svelte';
	import Revolution from './revolution.svelte';

	let activeTab = '진화';
	export let arkPassiveData;
	export let data;
</script>

<!-- 탭 버튼들 -->
<div class="mb-4 flex justify-center gap-4 p-4">
	<button class="svg-wrapper1 text-lg" on:click={() => (activeTab = '진화')}>
		<svg height="40" width="150" xmlns="http://www.w3.org/2000/svg" class={activeTab === '진화' ? 'active' : ''}>
			<rect id="shape" height="40" width="150" />
		</svg>
		<div id="text">
			<span class="spot"></span>진화
		</div>
	</button>
	<button class="svg-wrapper2 text-lg" on:click={() => (activeTab = '깨달음')}>
		<svg height="40" width="150" xmlns="http://www.w3.org/2000/svg" class={activeTab === '깨달음' ? 'active' : ''}>
			<rect id="shape" height="40" width="150" />
		</svg>
		<div id="text">
			<span class="spot"></span>깨달음
		</div>
	</button>
	<button class="svg-wrapper3 text-lg" on:click={() => (activeTab = '도약')}>
		<svg height="40" width="150" xmlns="http://www.w3.org/2000/svg" class={activeTab === '도약' ? 'active' : ''}>
			<rect id="shape" height="40" width="150" />
		</svg>
		<div id="text">
			<span class="spot"></span>도약
		</div>
	</button>
</div>

<!-- 탭 내용 -->
<div class="tab-content p-4">
	여기에 장비,장신구,팔찌 보여주기
	{#if activeTab === '진화'}
		<Revolution data={arkPassiveData} characterClassName={data.CharacterClassName} />
	{:else if activeTab === '깨달음'}
		<Ggadal data={arkPassiveData} characterClassName={data.CharacterClassName} />
	{:else if activeTab === '도약'}
		<Jump data={arkPassiveData} characterClassName={data.CharacterClassName} />
	{/if}
</div>

<style>
	.spot {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.svg-wrapper1,
	.svg-wrapper2,
	.svg-wrapper3 {
		position: relative;
		width: 150px;
		height: 40px;
		display: inline-block;
		cursor: pointer;
	}

	#shape {
		stroke-width: 6px;
		fill: transparent;
		stroke: #858585;
		stroke-dasharray: 85 400;
		stroke-dashoffset: -220;
		transition: 1s all ease;
	}

	#text {
		margin-top: -35px;
		text-align: center;
		color: #858585;
		transition: 0.3s all ease;
	}

	/* Hover effects */
	.svg-wrapper1:hover #shape {
		stroke: #ffd700;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper2:hover #shape {
		stroke: #1e90ff;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper3:hover #shape {
		stroke: #32cd32;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	/* Active states */
	.svg-wrapper1 svg.active #shape {
		stroke: #ffd700;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper2 svg.active #shape {
		stroke: #1e90ff;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper3 svg.active #shape {
		stroke: #32cd32;

		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	/* ... 다른 스타일들은 그대로 ... */
	/* Hover effects */
	.svg-wrapper1:hover #text,
	.svg-wrapper2:hover #text,
	.svg-wrapper3:hover #text {
		color: white;
	}

	/* Hover & Active text colors */
	.svg-wrapper1:hover #text,
	.svg-wrapper2:hover #text,
	.svg-wrapper3:hover #text,
	.svg-wrapper1:has(svg.active) #text,
	.svg-wrapper2:has(svg.active) #text,
	.svg-wrapper3:has(svg.active) #text {
		color: white;
	}
</style>
