<script lang="ts">
	export let height = 'h-[700px]';
	export let width = 'w-[350px]';
	export let type = 'sticky';
</script>

<div class="{type} top-20 flex {height} {width} flex-none items-center justify-center rounded-md bg-bg-300">
	{#if type !== 'sticky'}
		<span class="text-2xl text-white">AD</span>
	{:else}
		<div class="flex flex-col">
			<div class="h-[65px] w-full bg-primary-100">primary-100</div>
			<div class="h-[65px] w-full bg-primary-200">primary-200</div>
			<div class="h-[65px] w-full bg-primary-300">primary-300</div>
			<div class="h-[65px] w-full bg-accent-100">accent-100</div>
			<div class="h-[65px] w-full bg-accent-200">accent-200</div>
			<div class="h-[65px] w-full bg-text-100">text-100</div>
			<div class="h-[65px] w-full bg-text-200">text-200</div>
			<div class="h-[65px] w-full bg-bg-100">bg-100</div>
			<div class="h-[65px] w-full bg-bg-200">bg-200</div>
			<div class="h-[65px] w-full bg-bg-300">bg-300</div>
		</div>
	{/if}
</div>
