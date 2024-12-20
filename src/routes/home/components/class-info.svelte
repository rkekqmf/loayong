<script lang="ts">
	import { continentClasses } from '$lib/data/classData';
	import { goto } from '$app/navigation';
</script>

<div class="flex w-full flex-col gap-y-8 p-4">
	{#each Array.from({ length: Math.ceil(Object.entries(continentClasses).length / 2) }) as _, rowIndex}
		<div class="grid grid-cols-2 gap-x-4">
			{#each Object.entries(continentClasses).slice(rowIndex * 2, rowIndex * 2 + 2) as [category, classes]}
				<div class="category-row">
					<h3 class="mb-2 text-lg font-semibold text-white">{category}</h3>
					<div class="flex flex-row gap-x-2">
						{#each Object.values(classes) as character}
							<button
								on:click={() => goto(`/class/${character.code}`)}
								class="relative h-80 cursor-pointer rounded-xl bg-bg-300 p-1.5 transition-all
								before:absolute before:inset-0 before:rounded-xl before:shadow-[0_2px_4px_rgba(0,0,0,0.2)]
								hover:scale-105 hover:bg-accent-100 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:before:shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
							>
								<div class="text-center text-white">
									<img src="/class/{character.code}.png" alt={character.name} class="h-12 w-12 rounded-lg brightness-0 invert group-hover:brightness-110" />
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
