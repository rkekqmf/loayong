<!-- src/routes/+page.svelte -->
<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import ProfileCard from '$lib/components/ProfileCard.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import MainSectionCarousel from '$lib/components/MainSectionCarousel.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import CharacterCard from '$lib/components/CharacterCard.svelte';
  import { onMount } from 'svelte';
  import { searchCharacter, type CharacterProfile } from '$lib/utils/api';
  import { goto } from '$app/navigation';
  
  // TypeScript 타입 정의
  interface UserProfile {
    nickname: string;
    server: string;
    class: string;
    itemLevel: number;
    characterImage: string;
    guild: string;
    pvpRank: string;
  }

  interface Character {
    name: string;
    class: string;
    level: number;
    itemLevel: number;
    characterImage: string;
    server: string;
  }

  // 상태 관리
  let searchQuery = '';
  let searchResults: Character[] = [];
  let userProfile: UserProfile | null = null;
  let isLoading = false;
  let hasSearched = false;
  let searchError: string | null = null;
  
  // 검색바 위치 상태 관리
  let showSearchBarInNav = false;
  let currentSectionId = 0;
  
  // Mock 데이터 (검색 결과용)
  const mockCharacters: Character[] = [
    { name: "홍길동", class: "데빌헌터", level: 60, itemLevel: 1620, characterImage: "/class/dh.png", server: "루페온" },
    { name: "김철수", class: "버서커", level: 60, itemLevel: 1610, characterImage: "/class/bs.png", server: "아만" },
    { name: "이영희", class: "소서리스", level: 60, itemLevel: 1630, characterImage: "/class/sc.png", server: "카단" },
    { name: "전설의검사", class: "블레이드", level: 60, itemLevel: 1640, characterImage: "/class/bl.png", server: "루페온" },
    { name: "마법의달인", class: "소서리스", level: 60, itemLevel: 1635, characterImage: "/class/sc.png", server: "아만" },
    { name: "궁수의정석", class: "데빌헌터", level: 60, itemLevel: 1625, characterImage: "/class/dh.png", server: "카단" }
  ];

  const mockUserProfile: UserProfile = {
    nickname: "홍길동",
    server: "루페온",
    class: "데빌헌터",
    itemLevel: 1620,
    characterImage: "/class/dh.png",
    guild: "전설의길드",
    pvpRank: "골드"
  };

  // 검색 함수 - 실제 로스트아크 API 호출
  async function handleSearch(eventData: { query: string }) {
    console.log('handleSearch 호출됨, eventData:', eventData);
    
    if (!eventData || !eventData.query) {
      console.error('잘못된 eventData:', eventData);
      return;
    }
    
    const searchQuery = eventData.query;
    
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
      console.error('유효하지 않은 검색어:', searchQuery);
      return;
    }
    
    isLoading = true;
    hasSearched = true;
    searchError = null;
    
    // API 키 확인
    const API_KEY = import.meta.env.VITE_LOSTARK_API_KEY;
    if (!API_KEY) {
      searchError = 'API 키가 설정되지 않았습니다. .env.local 파일에 VITE_LOSTARK_API_KEY를 설정해주세요.';
      isLoading = false;
      return;
    }
    
    try {
      console.log('검색 시작:', searchQuery.trim());
      
      // 로스트아크 API 호출
      const characterData = await searchCharacter(searchQuery.trim());
      
      if (characterData) {
        console.log('검색 성공:', characterData);
        
        // API 응답을 내부 형식으로 변환
        const character: Character = {
          name: characterData.CharacterName,
          class: characterData.CharacterClassName,
          level: characterData.CharacterLevel,
          itemLevel: parseFloat(characterData.ItemAvgLevel),
          characterImage: characterData.CharacterImage,
          server: characterData.ServerName
        };
        
        searchResults = [character];
        
        // 유저 프로필 설정
        userProfile = {
          nickname: characterData.CharacterName,
          server: characterData.ServerName,
          class: characterData.CharacterClassName,
          itemLevel: parseFloat(characterData.ItemAvgLevel),
          characterImage: characterData.CharacterImage,
          guild: characterData.GuildName || '길드 없음',
          pvpRank: characterData.PvpGradeName || '등급 없음'
        };
        
        // 캐릭터 상세 페이지로 이동
        goto(`/character/${encodeURIComponent(characterData.CharacterName)}`);
      } else {
        searchError = '캐릭터를 찾을 수 없습니다. 캐릭터명을 정확히 입력해주세요.';
        searchResults = [];
        userProfile = null;
      }
    } catch (error) {
      console.error('검색 오류:', error);
      
      // 구체적인 에러 메시지 제공
      if (error instanceof TypeError && error.message.includes('fetch')) {
        searchError = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
      } else if (error instanceof Error && error.message.includes('CORS')) {
        searchError = 'CORS 오류가 발생했습니다. 브라우저에서 API 호출이 차단되었습니다.';
      } else {
        searchError = `검색 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      }
      
      searchResults = [];
      userProfile = null;
    }
    
    isLoading = false;
  }


  function handleSectionChange(event: CustomEvent) {
    const sectionId = event.detail.sectionId;
    currentSectionId = sectionId;
    
    // 검색바 위치 제어: 1번 섹션(캐릭터)이 아닐 때만 NavBar에 표시
    showSearchBarInNav = sectionId !== 0;
    
    // Pass the section change to MainSectionCarousel
    window.dispatchEvent(new CustomEvent('sectionNavigate', { detail: { sectionId } }));
  }

  // 이벤트 리스너 등록 (NavBar의 sectionChange만 처리)
  onMount(() => {
    const handleSectionChanged = (event: CustomEvent) => {
      const sectionId = event.detail.sectionId;
      currentSectionId = sectionId;
      
      // 검색바 위치 제어: 1번 섹션(캐릭터)이 아닐 때만 NavBar에 표시
      showSearchBarInNav = sectionId !== 0;
    };

    window.addEventListener('sectionChanged', handleSectionChanged as EventListener);

    return () => {
      window.removeEventListener('sectionChanged', handleSectionChanged as EventListener);
    };
  });
</script>

<!-- 메인 컨테이너 -->
<div class="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <!-- 네비게이션 바 (고정) -->
      <NavBar on:sectionChange={handleSectionChange} showSearchBar={showSearchBarInNav} />

  <!-- 메인 콘텐츠 (전체 화면 활용) -->
  <main class="flex-1 w-full relative mt-4 overflow-hidden">
    {#if !hasSearched}
      <!-- 섹션 캐러셀 (전체 화면) -->
      <div class="h-full w-full">
        <MainSectionCarousel on:search={(event) => handleSearch(event.detail)} />
      </div>
    {:else if isLoading}
      <!-- 로딩 상태 -->
      <div class="h-full flex items-center justify-center">
        <div class="text-center">
          <LoadingSpinner />
          <p class="text-gray-400 mt-4">검색 중...</p>
        </div>
      </div>
    {:else if searchResults.length === 0 || searchError}
      <!-- 검색 결과 없음 또는 에러 -->
      <div class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">
            {searchError ? '검색 오류' : '검색 결과가 없습니다'}
          </h3>
          <p class="text-gray-400 mb-6">
            {searchError || '다른 검색어로 시도해보세요'}
          </p>
          <button 
            on:click={() => { hasSearched = false; searchResults = []; userProfile = null; searchError = null; }}
            class="inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-colors duration-200 bg-primary-500 text-gray-900 hover:bg-primary-600"
          >
            다시 검색하기
          </button>
        </div>
      </div>
    {:else}
      <!-- 검색 결과 -->
      <div class="h-full overflow-y-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <!-- 유저 프로필 -->
          {#if userProfile}
            <ProfileCard user={userProfile} />
          {/if}
          
          <!-- 검색 결과 통계 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard value={searchResults.length} description="캐릭터" icon="👥" />
            <StatCard value={Math.round(searchResults.reduce((sum, char) => sum + char.itemLevel, 0) / searchResults.length)} description="평균 아이템 레벨" icon="⚔️" />
            <StatCard value={new Set(searchResults.map(char => char.server)).size} description="서버 수" icon="🌐" />
          </div>
          
          <!-- 캐릭터 리스트 -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-6">검색 결과</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each searchResults as character}
                <a href="/character/{character.name}">
                  <CharacterCard {character} />
                </a>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </main>

</div>

