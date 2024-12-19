<script lang="ts">
	import { classData } from '$lib/data/classData';
	import { goto } from '$app/navigation';
</script>

{#each Object.values(classData) as character}
	<button
		on:click={() => goto(`/class/${character.code}`)}
		class="group relative cursor-pointer rounded-xl
			bg-emerald-200/20 from-[#2d4530] to-[#243726]
			p-1.5 transition-all
			before:absolute
			before:inset-0
			before:rounded-xl before:shadow-[0_2px_4px_rgba(0,0,0,0.2)]
			hover:scale-105 hover:border-emerald-600/70
			hover:from-[#345235]
			hover:to-[#2d4530] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:before:shadow-[0_4px_8px_rgba(0,0,0,0.3)] active:scale-95
			active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
	>
		<div class="text-center text-white">
			<img src="/class/{character.code}.png" alt={character.name} class="h-8 w-8 rounded-lg brightness-0 invert group-hover:brightness-110" />
			<!-- <p class="mt-2 text-sm font-medium">{character.name}</p> -->
		</div>
	</button>
{/each}
