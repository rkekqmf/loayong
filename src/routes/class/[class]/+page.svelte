<script lang="ts">
	import { page } from '$app/stores';
	import { classData } from '$lib/data/classData';
	import Engrave from '../components/engrave.svelte';

	const currentClass = Object.values(classData).find((c) => c.code === $page.params.class);
</script>

<div class="flex items-center gap-4">
	{#if currentClass}
		<Engrave selectedClass={currentClass.name} />
	{/if}
</div>
