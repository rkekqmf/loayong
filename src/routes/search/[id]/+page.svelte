<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Chart from './chart.svelte';
	import Revolution from '$lib/components/revolution.svelte';
	import Ggadal from '$lib/components/ggadal.svelte';
	import Jump from '$lib/components/jump.svelte';

	let data: any;
	let chartData: any = [];
	let activeTab = 'revolution';
	let arkPassiveData: any;
	const fetchData = async (id: string) => {
		console.log(`Fetching data for ID: ${id}`);
		const url = `https://developer-lostark.game.onstove.com/armories/characters/${id}/profiles`;
		const arkPassiveUrl = `https://developer-lostark.game.onstove.com/armories/characters/${id}/arkpassive`;
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`
			}
		};

		const maxValues = {
			레벨: 2000,
			치명: 2000,
			특화: 2000,
			신속: 2000,
			최대생명력: 350000,
			공격력: 200000
		};

		try {
			const response = await fetch(url, options);
			const arkPassiveResponse = await fetch(arkPassiveUrl, options);

			if (response.ok) {
				const responseData = await response.json();
				arkPassiveData = await arkPassiveResponse.json();
				console.log('아크패시브 데이터:', arkPassiveData);

				data = responseData;
				chartData = [
					{ axis: '레벨', value: (Number(responseData.ItemMaxLevel.replace(/,/g, '')) / maxValues.레벨) * 100, originalValue: responseData.ItemMaxLevel, maxValue: maxValues.레벨 },
					{ axis: '공격력', value: (Number(responseData.Stats[7].Value) / maxValues.공격력) * 100, originalValue: responseData.Stats[7].Value, maxValue: maxValues.공격력 },
					{ axis: '특화', value: (Number(responseData.Stats[1].Value) / maxValues.특화) * 100, originalValue: responseData.Stats[1].Value, maxValue: maxValues.특화 },
					{ axis: '치명', value: (Number(responseData.Stats[0].Value) / maxValues.치명) * 100, originalValue: responseData.Stats[0].Value, maxValue: maxValues.치명 },
					{ axis: '신속', value: (Number(responseData.Stats[3].Value) / maxValues.신속) * 100, originalValue: responseData.Stats[3].Value, maxValue: maxValues.신속 },
					{ axis: '최대생명력', value: (Number(responseData.Stats[6].Value) / maxValues.최대생명력) * 100, originalValue: responseData.Stats[6].Value, maxValue: maxValues.최대생명력 }
				];
				console.log('Updated chartData:', chartData);
			} else {
				console.error('API 호출 실패:', response.statusText);
			}
		} catch (error) {
			console.error('API 호출 중 오류 발생:', error);
		}
	};

	const unsubscribe = page.subscribe(($page) => {
		const pathname = $page.url.pathname;
		const id = pathname.split('/')[2];
		console.log(`URL changed, new ID: ${id}`);
		fetchData(id);
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#await data}
	<p>Loading...</p>
{:then loadedData}
	<div class="flex h-full">
		<div class="flex-1">
			<div class="chartContainer flex flex-col items-center justify-center">
				<p class="text-2xl font-bold text-white">
					<span class="text-lime-500">{loadedData.GuildName}</span><span class="text-pink-500">{loadedData.Title}</span>
					{loadedData.CharacterName} <span class="text-red-300">{loadedData.CharacterClassName}</span>
				</p>
				<img width="200" src={loadedData.CharacterImage} alt="item" class="character-image" />
			</div>
			<Chart data={chartData} />
		</div>

		<div class="flex-[3]">
			<div class="mb-4 flex justify-center gap-4">
				<button class="px-4 py-2 {activeTab === 'revolution' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'revolution')}> Revolution </button>
				<button class="px-4 py-2 {activeTab === 'ggadal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'ggadal')}> Ggadal </button>
				<button class="px-4 py-2 {activeTab === 'jump' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'jump')}> Jump </button>
			</div>

			<div class="tab-content">
				{#if activeTab === 'revolution'}
					<Revolution data={arkPassiveData} />
				{:else if activeTab === 'ggadal'}
					<Ggadal data={arkPassiveData} />
				{:else if activeTab === 'jump'}
					<Jump data={arkPassiveData} />
				{/if}
			</div>
		</div>
	</div>
{:catch error}
	<p>Error loading data: {error.message}</p>
{/await}

<style>
	.chartContainer {
		width: 100%;
		height: 400px;
		margin: 0 auto;
		box-shadow:
			inset 0 -3px 10px rgba(0, 0, 0, 0.4),
			inset 0 3px 10px rgba(255, 255, 255, 0.4),
			0 3px 8px rgba(0, 0, 0, 0.3);
		background: #171a20;
		position: relative;
		overflow: hidden;
	}

	.character-image {
		filter: brightness(1.1);
	}
</style>
