<!-- src/lib/components/sections/CharacterSection.svelte -->
<script lang="ts">
  import SearchBar from '../SearchBar.svelte';
  import Footer from '../Footer.svelte';
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  let searchBarRef: HTMLDivElement;
  
  function handleSearch(event: CustomEvent) {
    const query = event.detail.query;
    // 캐릭터 페이지로 이동
    window.location.href = `/character/${encodeURIComponent(query)}`;
  }

  // 섹션 변경 감지하여 포커스 제거
  onMount(() => {
    const handleSectionChanged = (event: CustomEvent) => {
      const sectionId = event.detail.sectionId;
      // 캐릭터 섹션(0번)이 아닌 다른 섹션으로 이동할 때 포커스 제거
      if (sectionId !== 0) {
        // 캐릭터 섹션 내부의 SearchBar input만 포커스 제거 (nav의 SearchBar는 제외)
        if (searchBarRef) {
          const input = searchBarRef.querySelector('input');
          if (input && document.activeElement === input) {
            input.blur();
          }
        }
      }
    };

    window.addEventListener('sectionChanged', handleSectionChanged as EventListener);

    return () => {
      window.removeEventListener('sectionChanged', handleSectionChanged as EventListener);
    };
  });
  
</script>

<div class="h-full flex flex-col">
  <div class="flex-1 flex flex-col justify-center px-8 py-4">
    <div class="text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">캐릭터 검색</h2>
      <p class="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
        캐릭터 이름을 검색하여 상세 정보를 확인해보세요
      </p>
    </div>

    <!-- 검색바 (1번 섹션 내부) -->
    <div class="flex justify-center mb-8">
      <div class="w-full max-w-2xl" bind:this={searchBarRef}>
        <SearchBar on:search={handleSearch} large={true} />
      </div>
    </div>
  </div>
  <div class="flex-shrink-0 mt-auto">
    <Footer />
  </div>
</div>
