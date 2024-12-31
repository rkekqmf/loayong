<script lang="ts">
	import { fetchArmoriesData } from '$lib/utils';

	export let characterId: string;
	let data: any;
	$: if (characterId) {
		data = fetchArmoriesData(characterId, 'combat-skills');
	}
</script>

{#await data}
	<p>로딩중...</p>
{:then skills}
	{#each skills.filter((e: { Level: number }) => e.Level > 1) as skill}
		{skill.Name}
		<img src={skill.Icon} alt={skill.Name} />
	{/each}
{:catch error}
	<p>에러: {error.message}</p>
{/await}
