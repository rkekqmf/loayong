<!-- src/routes/character/[character]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import ProfileCard from '$lib/components/ProfileCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { fetchAllCharacterData, type CharacterData } from '$lib/utils/api';
  
  // URL에서 캐릭터명 가져오기
  $: characterName = $page.params.character;
  
  // 상태 관리
  let characterData: CharacterData | null = null;
  let isLoading = true;
  let error: string | null = null;
  
  // 캐릭터 데이터 로드
  async function loadCharacterData() {
    if (!characterName) return;
    
    isLoading = true;
    error = null;
    
    try {
      const data = await fetchAllCharacterData(decodeURIComponent(characterName));
      if (data) {
        characterData = data;
      } else {
        error = '캐릭터 정보를 찾을 수 없습니다.';
      }
    } catch (err) {
      console.error('캐릭터 데이터 로드 실패:', err);
      error = '캐릭터 정보를 불러오는 중 오류가 발생했습니다.';
    }
    
    isLoading = false;
  }
  
  // 컴포넌트 마운트 시 데이터 로드
  onMount(() => {
    loadCharacterData();
  });
  
  // 캐릭터명이 변경될 때마다 데이터 다시 로드
  $: if (characterName) {
    loadCharacterData();
  }
  
  const recentRaids = [
    { name: "발탄", difficulty: "노말", gate1Cut: 15, gate2Cut: 15, clearCount: 12, lastClear: "2024-01-15" },
    { name: "비아키스", difficulty: "하드", gate1Cut: 12, gate2Cut: 12, clearCount: 8, lastClear: "2024-01-14" },
    { name: "쿠크사이튼", difficulty: "노말", gate1Cut: 10, gate2Cut: 10, clearCount: 15, lastClear: "2024-01-13" }
  ];
  
  let activeTab = 'equipment';
  
  const tabs = [
    { id: 'equipment', name: '장비', icon: '⚔️' },
    { id: 'engraving', name: '각인', icon: '💎' },
    { id: 'gems', name: '보석', icon: '💠' },
    { id: 'cards', name: '카드', icon: '🃏' }
  ];
</script>

<!-- 메인 컨테이너 -->
<div class="bg-gray-900">
  <!-- 네비게이션 바 -->
  <NavBar />

  <!-- 메인 콘텐츠 -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if isLoading}
      <!-- 로딩 상태 -->
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <LoadingSpinner />
          <p class="text-gray-400 mt-4">캐릭터 정보를 불러오는 중...</p>
        </div>
      </div>
    {:else if error}
      <!-- 에러 상태 -->
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">오류 발생</h3>
          <p class="text-gray-400 mb-6">{error}</p>
          <button 
            on:click={loadCharacterData}
            class="inline-flex items-center px-6 py-3 bg-primary-500 text-gray-900 font-semibold rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    {:else if characterData}
      <!-- 캐릭터 프로필 -->
      <div class="mb-8">
        <ProfileCard user={{
          nickname: characterData.profile.CharacterName,
          server: characterData.profile.ServerName,
          class: characterData.profile.CharacterClassName,
          itemLevel: parseFloat(characterData.profile.ItemAvgLevel),
          characterImage: characterData.profile.CharacterImage,
          guild: characterData.profile.GuildName || '길드 없음',
          pvpRank: characterData.profile.PvpGradeName || '등급 없음'
        }} />
      </div>

    <!-- 탭 메뉴 -->
    <div class="mb-8">
      <div class="border-b border-gray-700">
        <nav class="-mb-px flex space-x-8">
          {#each tabs as tab}
            <button
              on:click={() => activeTab = tab.id}
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 {activeTab === tab.id 
                ? 'border-primary-500 text-primary-500' 
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}"
            >
              <span class="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          {/each}
        </nav>
      </div>
    </div>

      <!-- 탭 컨텐츠 -->
      <div class="mb-12">
        {#if activeTab === 'equipment'}
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 class="text-xl font-semibold text-white mb-4">장비 정보</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each characterData.equipment as equipment}
                <div class="bg-gray-700 rounded-lg p-4 text-center">
                  <img src={equipment.Icon} alt={equipment.Name} class="w-12 h-12 mx-auto mb-2" />
                  <div class="text-white text-sm">{equipment.Name}</div>
                  <div class="text-gray-400 text-xs">{equipment.Grade}</div>
                </div>
              {/each}
            </div>
          </div>
        {:else if activeTab === 'engraving'}
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 class="text-xl font-semibold text-white mb-4">각인 정보</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each characterData.engravings as engraving}
                <div class="bg-gray-700 rounded-lg p-4">
                  <div class="text-white font-medium mb-2">{engraving.Name}</div>
                  <div class="text-primary-500 text-sm">{engraving.Description}</div>
                </div>
              {/each}
            </div>
          </div>
        {:else if activeTab === 'gems'}
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 class="text-xl font-semibold text-white mb-4">보석 정보</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {#each characterData.gems as gem}
                <div class="bg-gray-700 rounded-lg p-3 text-center">
                  <img src={gem.Icon} alt={gem.Name} class="w-8 h-8 mx-auto mb-2" />
                  <div class="text-white text-xs">{gem.Name}</div>
                  <div class="text-primary-500 text-xs">Lv.{gem.Level}</div>
                </div>
              {/each}
            </div>
          </div>
        {:else if activeTab === 'cards'}
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 class="text-xl font-semibold text-white mb-4">카드 정보</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {#each characterData.cards as card}
                <div class="bg-gray-700 rounded-lg p-3 text-center">
                  <img src={card.Icon} alt={card.Name} class="w-12 h-16 mx-auto mb-2" />
                  <div class="text-white text-xs">{card.Name}</div>
                  <div class="text-primary-500 text-xs">{card.AwakeCount}/{card.AwakeTotal}</div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

    <!-- 최근 클리어 레이드 -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold text-white mb-6">최근 클리어 레이드</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each recentRaids as raid}
          <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-white">{raid.name}</h3>
              <span class="bg-primary-500 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                {raid.difficulty}
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">1게이트</span>
                <span class="text-white">{raid.gate1Cut}분 컷</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">2게이트</span>
                <span class="text-white">{raid.gate2Cut}분 컷</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">클리어 횟수</span>
                <span class="text-primary-500 font-semibold">{raid.clearCount}회</span>
              </div>
              <div class="text-xs text-gray-500 mt-2">
                마지막 클리어: {raid.lastClear}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

      <!-- 통계 섹션 -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-6">캐릭터 통계</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard value={characterData.profile.CharacterLevel.toString()} description="레벨" icon="⭐" />
          <StatCard value={characterData.profile.ItemAvgLevel} description="아이템 레벨" icon="⚔️" />
          <StatCard value={characterData.profile.ExpeditionLevel.toString()} description="원정대 레벨" icon="🏆" />
          <StatCard value={characterData.profile.PvpGradeName || '등급 없음'} description="PVP 등급" icon="⚡" />
        </div>
      </div>
    {/if}
  </main>

  <!-- 푸터 -->
  <footer>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-gray-900 font-bold text-lg">L</span>
          </div>
          <span class="text-xl font-bold text-white">로스트아크 전적</span>
        </div>
        <p class="text-gray-400 text-sm">
          © 2024 로스트아크 전적. 모든 권리 보유.
        </p>
      </div>
    </div>
  </footer>
</div>
