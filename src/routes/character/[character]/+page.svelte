<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Chart from '../components/chart.svelte';
	import Revolution from '../components/revolution.svelte';
	import Ggadal from '../components/ggadal.svelte';
	import Jump from '../components/jump.svelte';
	import Sasagae from '../components/sasagae.svelte';

	let data: any = null;
	let chartData: any[] = [];
	let activeTab = 'revolution';
	let arkPassiveData: any = null;
	let isLoading = true;

	const fetchData = async (id: string) => {
		isLoading = true;
		try {
			const encodedId = encodeURIComponent(id);
			const url = `https://developer-lostark.game.onstove.com/armories/characters/${encodedId}/profiles`;
			const arkPassiveUrl = `https://developer-lostark.game.onstove.com/armories/characters/${encodedId}/arkpassive`;
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

			const [response, arkPassiveResponse] = await Promise.all([fetch(url, options), fetch(arkPassiveUrl, options)]);

			if (!response.ok) {
				throw new Error(`캐릭터 정보를 가져오는데 실패했습니다 (${response.status})`);
			}
			0;
			const responseData = await response.json();

			if (arkPassiveResponse.ok) {
				arkPassiveData = await arkPassiveResponse.json();
			}

			data = responseData;
			console.log('data:', data);
			chartData = [
				{ axis: '레벨', value: (Number(responseData.ItemMaxLevel.replace(/,/g, '')) / maxValues.레벨) * 100, originalValue: responseData.ItemMaxLevel, maxValue: maxValues.레벨 },
				{ axis: '공격력', value: (Number(responseData.Stats[7].Value) / maxValues.공격력) * 100, originalValue: responseData.Stats[7].Value, maxValue: maxValues.공격력 },
				{ axis: '특화', value: (Number(responseData.Stats[1].Value) / maxValues.특화) * 100, originalValue: responseData.Stats[1].Value, maxValue: maxValues.특화 },
				{ axis: '치명', value: (Number(responseData.Stats[0].Value) / maxValues.치명) * 100, originalValue: responseData.Stats[0].Value, maxValue: maxValues.치명 },
				{ axis: '신속', value: (Number(responseData.Stats[3].Value) / maxValues.신속) * 100, originalValue: responseData.Stats[3].Value, maxValue: maxValues.신속 },
				{ axis: '최대생명력', value: (Number(responseData.Stats[6].Value) / maxValues.최대생명력) * 100, originalValue: responseData.Stats[6].Value, maxValue: maxValues.최대생명력 }
			];
			console.log('Updated chartData:', chartData);
		} catch (error) {
			console.error('데이터 로딩 오류ㅋㅋ:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	$: {
		if ($page.url.pathname) {
			const id = $page.url.pathname.split('/')[2];
			if (id) {
				console.log('페이지 로드/새로고침, ID:', id);
				fetchData(id);
			}
		}
	}
</script>

{#if isLoading}
	<div class="mt-20 flex h-full w-full">
		<div class="flex-1">
			<div class="flex flex-col items-center justify-center bg-[#334b33]">
				<p class="text-lg">데이터를 불러오는 중...</p>
			</div>
			<div class="bg-[#334b33]"></div>
		</div>
		<div class="flex-[3]">
			<div class="mb-4 flex justify-center gap-4">
				<button class="px-4 py-2 {activeTab === 'revolution' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'revolution')}> Revolution </button>
				<button class="px-4 py-2 {activeTab === 'ggadal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'ggadal')}> Ggadal </button>
				<button class="px-4 py-2 {activeTab === 'jump' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'jump')}> Jump </button>
			</div>
			<div class="h-[765px] w-full bg-red-100"></div>
		</div>
	</div>
{:else if data}
	<div class="flex h-full w-full flex-col gap-4">
		<div class="flex flex-col md:flex-row">
			<div class=" flex min-w-[300px] flex-col items-center justify-center">
				<p class="text-sm text-lime-500">{data.GuildName}</p>
				<p class="text-2xl font-bold text-white">
					<!-- <span class="text-pink-500">{data.Title}</span> -->
					{data.CharacterName}
					<!-- <span class="text-red-300">{data.CharacterClassName}</span> -->
				</p>
				<div class="relative h-[300px] w-full overflow-hidden bg-[#15181d]">
					<div class="absolute">
						<div class="absolute bottom-0 left-0 top-0 w-20 bg-gradient-to-r from-[#15181d] to-transparent"></div>
						<img alt={data.CharacterName} loading="lazy" width="612" height="708" decoding="async" data-nimg="1" src={data.CharacterImage} style="color: transparent;" />
						<div class="absolute bottom-0 right-0 top-0 w-20 bg-gradient-to-l from-[#15181d] to-transparent"></div>
					</div>
					<div
						class="absolute inset-0 bg-[#3f7a27] mix-blend-lighten transition-colors duration-[2000ms] ease-out"
						style="mask-image: linear-gradient(
							 100deg, 
							 rgba(255, 255, 255, 0.65), 
							 rgba(255, 255, 255, 0) 70%
						 ), linear-gradient(
							 -100deg, 
							 rgba(255, 255, 255, 0.65), 
							 rgba(255, 255, 255, 0) 70%
						 );"
					></div>
					<div class="absolute left-5 top-5 text-white drop-shadow"></div>
					<div class="absolute right-0 top-0"></div>
				</div>
			</div>
			<Sasagae />
			<!-- <Chart data={chartData} /> -->
		</div>

		<div class="flex flex-col">
			<div class="mb-4 flex justify-center gap-4">
				<button class="px-4 py-2 {activeTab === 'revolution' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'revolution')}> Revolution </button>
				<button class="px-4 py-2 {activeTab === 'ggadal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'ggadal')}> Ggadal </button>
				<button class="px-4 py-2 {activeTab === 'jump' ? 'bg-blue-500 text-white' : 'bg-gray-200'}" on:click={() => (activeTab = 'jump')}> Jump </button>
			</div>

			<div class="tab-content">
				{#if activeTab === 'revolution'}
					<Revolution data={arkPassiveData} characterClassName={data.CharacterClassName} />
				{:else if activeTab === 'ggadal'}
					<Ggadal data={arkPassiveData} characterClassName={data.CharacterClassName} />
				{:else if activeTab === 'jump'}
					<Jump data={arkPassiveData} characterClassName={data.CharacterClassName} />
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="p-4 text-center text-red-500">
		<p>데이터를 불러올 수 없습니다.</p>
		<p>잠시 후 다시 시도해주세요.</p>
	</div>
{/if}

<style>
</style>
