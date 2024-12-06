<script lang="ts">
	import { page } from '$app/stores';
	import { classData } from '$lib/data/classData';

	const currentClass = Object.values(classData).find((c) => c.code === $page.params.class);
</script>

<div>
	{#if currentClass}
		<div class="flex items-center gap-4">
			<img src="/class/{currentClass.code}.png" alt={currentClass.name} class="h-16 w-16" />
			<div>
				<h1>{currentClass.name}</h1>
				<p>Class Code: {currentClass.code}</p>
			</div>
		</div>
	{/if}
</div>
