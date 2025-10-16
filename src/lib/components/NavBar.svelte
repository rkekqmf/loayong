<!-- components/NavBar.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import SearchBar from './SearchBar.svelte';
  import { createEventDispatcher } from 'svelte';
  import { scale } from 'svelte/transition';
  import { bounceOut } from 'svelte/easing';

  const dispatch = createEventDispatcher();
  let isMenuOpen = false;
  
  // 검색바 표시 상태 (1번 섹션이 아닐 때만 표시)
  export let showSearchBar = false;

  const sections = [
    { id: 0, name: '캐릭터', icon: '👥' },
    { id: 1, name: '잔혈컷', icon: '👹' },
    { id: 2, name: '직업', icon: '⚔️' },
    { id: 3, name: '도구', icon: '🛠️' },
    { id: 4, name: '랭킹', icon: '🏆' }
  ];

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleSearch(event: CustomEvent) {
    const query = event.detail.query;
    // 캐릭터 페이지로 이동
    window.location.href = `/character/${encodeURIComponent(query)}`;
  }

  function goToSection(sectionId: number) {
    dispatch('sectionChange', { sectionId });
  }
</script>

<nav>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-center h-16 relative px-4">
      <!-- Mobile Menu Button (Absolute positioned) -->
      <div class="md:hidden absolute right-4">
        <button
          on:click={toggleMenu}
          type="button"
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500"
          aria-controls="mobile-menu"
          aria-expanded="false"
          aria-label="메뉴 열기"
        >
          <span class="sr-only">Open main menu</span>
          {#if isMenuOpen}
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>

      <!-- Centered Content Container -->
      <div class="flex items-center justify-center w-full max-w-6xl">
        <!-- All Content Container (AB or ABC centered) -->
        <div class="flex items-center space-x-6 transition-all duration-500 ease-in-out">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="flex items-center">
              <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span class="text-gray-900 font-bold text-lg">L</span>
              </div>
              <span class="ml-2 text-xl font-bold text-white">모요</span>
            </a>
          </div>

          <!-- Desktop Menu Items -->
          <div class="hidden md:block">
            <div class="flex items-baseline space-x-1">
              {#each sections as section}
                <button
                  on:click={() => goToSection(section.id)}
                  class="flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-primary-500 hover:bg-gray-700"
                  aria-label="{section.name} 섹션으로 이동"
                >
                  <span class="text-base">{section.icon}</span>
                  <span class="hidden lg:inline">{section.name}</span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Search Bar Container (with animation) -->
          <div class="flex-shrink-0 transition-all duration-500 ease-in-out {showSearchBar ? 'opacity-100 scale-100 translate-x-0 w-64 md:w-72 lg:w-80' : 'opacity-0 scale-95 pointer-events-none translate-x-8 w-0 overflow-hidden'}">
            <div class="w-full">
              <SearchBar on:search={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="/" class="block text-gray-300 hover:text-primary-500 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200">메인</a>
      </div>
    </div>
  {/if}
</nav>
