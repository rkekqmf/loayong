<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { activeSection, sectionToggles } from '$lib/stores/store';
	import Chart from '../components/chart.svelte';
	import Revolution from '../components/revolution.svelte';
	import Ggadal from '../components/ggadal.svelte';
	import Jump from '../components/jump.svelte';
	import Sasagae from '../components/sasagae.svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let data: any = null;
	let chartData: any[] = [];
	let arkPassiveData: any = null;
	let isLoading = true;
	let activeTab = '진화';

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

	$: {
		if ($page.url.pathname) {
			const id = $page.url.pathname.split('/')[2];
			if (id) {
				fetchData(id);
			}
		}
	}

	// 섹션 정의
	const sections = {
		sasagae: '사사게',
		arkpassive: '캐릭터 정보',
		'combat-stats': '전투 특성',
		equipment: '장비',
		collections: '수집품',
		achievements: '업적'
	};

	// 테스트 데이터 추가
	const testData = {
		combat: {
			치명: 1543,
			특화: 1782,
			신속: 532,
			제압: 45,
			인내: 45,
			숙련: 45
		},
		equipment: [
			{ name: '고대 무기', level: 25, quality: 100 },
			{ name: '고대 투구', level: 25, quality: 98 }
			// ... 더 많은 장비 데이터
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

{#if isLoading}
	<div class="flex h-full min-h-[765px] w-full flex-col gap-4">
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="flex min-w-[300px] flex-col items-center justify-center rounded-lg bg-bg-300 p-4 shadow-primary">
				<div class="animate-pulse">
					<div class="mb-2 h-4 w-20 rounded bg-bg-100"></div>
					<div class="mb-4 h-8 w-32 rounded bg-bg-100"></div>
					<div class="h-[300px] w-full rounded-lg bg-bg-100"></div>
				</div>
			</div>
			<div class="flex-1 rounded-lg bg-bg-300 shadow-primary">
				<div class="animate-pulse p-4">
					<div class="h-full w-full rounded bg-bg-100"></div>
				</div>
			</div>
		</div>

		<div class="flex flex-col">
			<div class="mb-4 flex justify-center gap-4">
				{#each ['revolution', 'ggadal', 'jump'] as tab}
					<button
						class="rounded-lg px-4 py-2 transition-all duration-200
							{activeTab === tab ? 'bg-primary-100 text-white shadow-primary' : 'bg-bg-300 hover:bg-bg-100'}"
						on:click={() => (activeTab = tab)}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				{/each}
			</div>

			<div class="h-[600px] rounded-lg bg-bg-300 p-4">
				<div class="h-full w-full animate-pulse rounded bg-bg-100"></div>
			</div>
		</div>
	</div>
{:else if data}
	<div class="engraving-container">
		<div class="engraving-content">
			<div class="accordion-sections">
				<!-- 캐릭터 정보 섹션 -->
				{#if $sectionToggles.sasagae}
					<div class="accordion-item">
						<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
							<div class="section-header">
								{sections.sasagae}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<Sasagae data={arkPassiveData} characterClassName={data.CharacterClassName} />
							</div>
						</div>
					</div>
				{/if}

				<!-- 캐릭터 정보 섹션 -->
				{#if $sectionToggles.arkpassive}
					<div class="accordion-item">
						<div in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
							<div class="section-header">
								{sections.arkpassive}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content p-4">
								<!-- 탭 버튼들 -->
								<div class="mb-4 flex justify-center gap-4">
									<button class="svg-wrapper1 text-lg" on:click={() => (activeTab = '진화')}>
										<svg height="40" width="150" xmlns="http://www.w3.org/2000/svg" class={activeTab === '진화' ? 'active' : ''}>
											<rect id="shape" height="40" width="150" />
										</svg>
										<div id="text">
											<span class="spot"></span>진화
										</div>
									</button>
									<button class="svg-wrapper2 text-lg" on:click={() => (activeTab = '깨달음')}>
										<svg height="40" width="150" xmlns="http://www.w3.org/2000/svg" class={activeTab === '깨달음' ? 'active' : ''}>
											<rect id="shape" height="40" width="150" />
										</svg>
										<div id="text">
											<span class="spot"></span>깨달음
										</div>
									</button>
									<button class="svg-wrapper3 text-lg" on:click={() => (activeTab = '도약')}>
										<svg height="40" width="150" xmlns="http://www.w3.org/2000/svg" class={activeTab === '도약' ? 'active' : ''}>
											<rect id="shape" height="40" width="150" />
										</svg>
										<div id="text">
											<span class="spot"></span>도약
										</div>
									</button>
								</div>

								<!-- 탭 내용 -->
								{#if activeTab === '진화'}
									<div class="tab-content"><Revolution data={arkPassiveData} characterClassName={data.CharacterClassName} /></div>
								{:else if activeTab === '깨달음'}
									<div class="tab-content"><Ggadal data={arkPassiveData} characterClassName={data.CharacterClassName} /></div>
								{:else if activeTab === '도약'}
									<div class="tab-content"><Jump data={arkPassiveData} characterClassName={data.CharacterClassName} /></div>
								{/if}
							</div>
						</div>
					</div>
				{/if}

				<!-- 전투 특성 섹션 -->
				{#if $sectionToggles['combat-stats']}
					<div class="accordion-item">
						<div in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
							<div class="section-header">
								{sections['combat-stats']}
								<div class="mt-2 border-b-2 border-primary-100"></div>
							</div>
							<div class="section-content">
								<div class="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
									{#each Object.entries(testData.combat) as [stat, value]}
										<div class="rounded-lg bg-bg-200 p-4">
											<p class="text-primary-100">{stat}</p>
											<p class="text-2xl font-bold">{value}</p>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- 장비 섹션 -->
				{#if $sectionToggles.equipment}
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

				<!-- 수집품 섹션 -->
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

				<!-- 업적 섹션 -->
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
				{/if}
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

	.spot {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.svg-wrapper1,
	.svg-wrapper2,
	.svg-wrapper3 {
		position: relative;
		width: 150px;
		height: 40px;
		display: inline-block;
		cursor: pointer;
	}

	#shape {
		stroke-width: 6px;
		fill: transparent;
		stroke: #858585;
		stroke-dasharray: 85 400;
		stroke-dashoffset: -220;
		transition: 1s all ease;
	}

	#text {
		margin-top: -35px;
		text-align: center;
		color: #858585;
		transition: 0.3s all ease;
	}

	/* Hover effects */
	.svg-wrapper1:hover #shape {
		stroke: #ffd700;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper2:hover #shape {
		stroke: #1e90ff;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper3:hover #shape {
		stroke: #32cd32;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	/* Active states */
	.svg-wrapper1 svg.active #shape {
		stroke: #ffd700;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper2 svg.active #shape {
		stroke: #1e90ff;
		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	.svg-wrapper3 svg.active #shape {
		stroke: #32cd32;

		stroke-dasharray: 50 0;
		stroke-width: 3px;
		stroke-dashoffset: 0;
	}

	/* ... 다른 스타일들은 그대로 ... */
	/* Hover effects */
	.svg-wrapper1:hover #text,
	.svg-wrapper2:hover #text,
	.svg-wrapper3:hover #text {
		color: white;
	}
	/* Active text color - 별도로 분리 */
	.svg-wrapper1 svg.active #text,
	.svg-wrapper2 svg.active #text,
	.svg-wrapper3 svg.active #text {
		color: white !important; /* 우선순위 강제 적용 */
	}

	/* Hover & Active text colors */
	.svg-wrapper1:hover #text,
	.svg-wrapper2:hover #text,
	.svg-wrapper3:hover #text,
	.svg-wrapper1:has(svg.active) #text,
	.svg-wrapper2:has(svg.active) #text,
	.svg-wrapper3:has(svg.active) #text {
		color: white;
	}
</style>
