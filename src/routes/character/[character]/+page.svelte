<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { activeSection, sectionToggles } from '$lib/stores/store';
	import Chart from '../components/chart.svelte';

	import { slide } from 'svelte/transition';
	import Detail from '../components/item-detail.svelte';
	import Sasagae from '../components/item-sasagae.svelte';
	import Arkpassive from '../components/item-arkpassive.svelte';
	import Skill from '../components/item-skill.svelte';

	let data: any = null;
	let chartData: any[] = [];
	let arkPassiveData: any = null;
	let isLoading = true;
	let characterId: string;

	$: {
		if ($page.url.pathname) {
			characterId = $page.url.pathname.split('/')[2];
			if (characterId) {
				fetchData(characterId);
			}
		}
	}

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
			// chartData = [
			// 	{ axis: '레벨', value: (Number(responseData.ItemMaxLevel.replace(/,/g, '')) / maxValues.레벨) * 100, originalValue: responseData.ItemMaxLevel, maxValue: maxValues.레벨 },
			// 	{ axis: '공격력', value: (Number(responseData.Stats[7].Value) / maxValues.공격력) * 100, originalValue: responseData.Stats[7].Value, maxValue: maxValues.공격력 },
			// 	{ axis: '특화', value: (Number(responseData.Stats[1].Value) / maxValues.특화) * 100, originalValue: responseData.Stats[1].Value, maxValue: maxValues.특화 },
			// 	{ axis: '치명', value: (Number(responseData.Stats[0].Value) / maxValues.치명) * 100, originalValue: responseData.Stats[0].Value, maxValue: maxValues.치명 },
			// 	{ axis: '신속', value: (Number(responseData.Stats[3].Value) / maxValues.신속) * 100, originalValue: responseData.Stats[3].Value, maxValue: maxValues.신속 },
			// 	{ axis: '최대생명력', value: (Number(responseData.Stats[6].Value) / maxValues.최대생명력) * 100, originalValue: responseData.Stats[6].Value, maxValue: maxValues.최대생명력 }
			// ];
		} catch (error) {
			console.error('상세 에러 정보:', error);
			throw error;
		} finally {
			isLoading = false;
		}
	};

	// 섹션 정의
	const sections = {
		detail: '정보',
		sasagae: '사사게',
		arkpassive: '캐릭터 정보',
		stats: '전투 특성',
		equipment: '장비',
		collections: '수집품',
		achievements: '업적'
	};

	const testData = {
		equipment: [
			{ name: '고대 무기', level: 25, quality: 100 },
			{ name: '고대 투구', level: 25, quality: 98 }
		],
		collections: {
			모코코: '1234/1234',
			섬의마음: '95/95',
			오르페우스의별: '7/7',
			거인의심장: '15/15'
		},
		achievements: {
			total: 1234,
			recent: [
				{ name: '발탄 헬모드 클리어', points: 10 },
				{ name: '쿠크세이튼 헬모드 클리어', points: 10 }
			]
		}
	};
</script>

{#if data}
	<div class="engraving-container">
		<div class="engraving-content">
			<div class="accordion-sections">
				{#if $sectionToggles.detail}
					<div class="accordion-item">
						<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
							<div class="section-header">
								{sections.detail}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<Detail {data} />
							</div>
						</div>
					</div>
				{/if}

				{#if $sectionToggles.sasagae}
					<div class="accordion-item">
						<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
							<div class="section-header">
								{sections.sasagae}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<Sasagae />
							</div>
						</div>
					</div>
				{/if}

				{#if $sectionToggles.arkpassive}
					<div class="accordion-item">
						<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
							<div class="section-header">
								{sections.arkpassive}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<Arkpassive {arkPassiveData} {data} />
							</div>
						</div>
					</div>
				{/if}

				<!-- 전투 특성 섹션 -->
				{#if $sectionToggles.stats}
					<div class="accordion-item">
						<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
							<div class="section-header">
								{sections.stats}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<Skill {characterId} />
							</div>
						</div>
					</div>
				{/if}

				<!-- {#if $sectionToggles.equipment}
					<div class="accordion-item">
						<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
							<div class="section-header">
								{sections.equipment}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<div class="grid gap-4 p-4">
									{#each testData.equipment as item}
										<div class="flex items-center justify-between rounded-lg bg-bg-200 p-4">
											<span>{item.name}</span>
											<div class="flex gap-4">
												<span class="text-primary-100">+{item.level}</span>
												<span class="text-yellow-400">{item.quality}%</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}

				{#if $sectionToggles.collections}
					<div class="accordion-item">
						<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
							<div class="section-header">
								{sections.collections}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<div class="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
									{#each Object.entries(testData.collections) as [name, progress]}
										<div class="rounded-lg bg-bg-200 p-4">
											<p class="text-xl font-bold">{progress}</p>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}

				{#if $sectionToggles.achievements}
					<div class="accordion-item">
						<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
							<div class="section-header">
								{sections.achievements}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<div class="p-4">
									<p class="mb-4 text-lg">총 업적 점수: {testData.achievements.total}</p>
									<h3 class="mb-2 text-lg text-primary-100">최근 달성 업적</h3>
									<div class="grid gap-2">
										{#each testData.achievements.recent as achievement}
											<div class="flex items-center justify-between rounded-lg bg-bg-200 p-4">
												<span>{achievement.name}</span>
												<span class="text-primary-100">{achievement.points} 점</span>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if} -->
			</div>
		</div>
	</div>
{:else}
	<div class="rounded-lg bg-bg-300 p-4 text-center">
		<p class="text-red-500">데이터를 불러올 수 없습니다. (data: {JSON.stringify(data)})</p>
		<p class="text-red-500">잠시 후 다시 시도해주세요.</p>
	</div>
{/if}

<style>
	.engraving-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.accordion-sections {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		position: relative;
	}

	.accordion-item {
		border: 1px solid var(--bg-300);
		border-radius: 0.5rem;
		overflow: hidden;
		position: relative;
		transform-origin: top;
		will-change: transform, opacity;
	}

	.section-header {
		padding: 1rem;
		font-weight: 600;
		font-size: 1.1rem;
		background-color: var(--bg-200);
	}

	.section-content {
		background-color: var(--bg-100);
		position: relative;
	}

	:global(.slide-transition) {
		transition:
			transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 200ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/*    start code for the actual button:         */

	/*   
    Spot is the span on the inside of the href that
    fills the parent and makes the hover and link work
    for the entire div
*/
</style>
