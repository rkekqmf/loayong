<script>
	import { getClassCode } from '$lib/utils';

	export let data;
</script>

<div class="relative flex h-full min-h-[300px] w-full overflow-hidden rounded-xl p-4">
	<!-- 캐릭터 정보 -->
	<div class="flex w-full flex-col items-center justify-center gap-2">
		<div class="z-50 flex w-full items-center justify-center gap-2">
			<img src={`/class/${getClassCode(data?.CharacterClassName)}.png`} alt={data?.CharacterClassName} class="h-10 w-10 object-cover [filter:brightness(0)_invert(1)]" />

			<span class="text-xl font-semibold">{data?.CharacterClassName}</span>
		</div>

		<div class="z-50 flex w-full items-center justify-center gap-2">
			<span class="text-xl font-semibold">{data?.ItemMaxLevel}</span>

			<span class="mb-1 w-full text-center text-xl font-semibold">{data?.CharacterName}</span>
		</div>

		<div class="z-50 flex w-full flex-col items-center">
			<div class="-mt-2 flex w-full flex-col items-center">
				{#if data?.ServerName}
					<span class="text-xs text-gray-400">《 {data?.ServerName} 》</span>
				{/if}
				{#if data?.Title}
					<span class="text-xs text-orange-300">《 {data?.Title} 》</span>
				{/if}
				{#if data?.GuildName}
					<span class="text-xs text-green-400">《 {data?.GuildName} 》</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- 캐릭터 이미지 -->

	<div class="flex h-[200px] w-full items-center justify-center overflow-hidden bg-bg-100">
		{#if data?.CharacterImage}
			<img alt={data?.CharacterName} width="100" src={data.CharacterImage} class="h-full w-auto object-contain" style="color: transparent;" />
			<div class="absolute inset-0 bg-bg-100 mix-blend-lighten"></div>
		{/if}
	</div>
</div>
