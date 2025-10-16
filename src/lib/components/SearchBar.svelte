<!-- components/SearchBar.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  let searchQuery = '';
  let isSearching = false;
  
  // 검색바 크기 조절
  export let large = false;
  
  const handleSearch = async () => {
    if (searchQuery.trim() && !isSearching) {
      isSearching = true;
      
      console.log('SearchBar에서 검색 이벤트 전달:', searchQuery.trim());
      
      // 부모 컴포넌트로 검색 이벤트 전달
      dispatch('search', { query: searchQuery.trim() });
      
      // 애니메이션을 위한 약간의 지연
      setTimeout(() => {
        isSearching = false;
      }, 300);
    }
  };
  
  // 입력 필드 포커스 복원 함수
  function restoreFocus() {
    const input = document.querySelector('input[placeholder="캐릭터명을 입력하세요"]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }
  
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
</script>

       <div class="relative">
         <div class="flex border border-gray-700 rounded-lg overflow-hidden transition-all duration-200 focus-within:border-primary-500 focus-within:border-transparent {large ? 'text-xl' : ''}">
           <input
             type="text"
             bind:value={searchQuery}
             on:keydown={handleKeyPress}
             placeholder="캐릭터명을 입력하세요"
             class="flex-1 bg-gray-700 text-white placeholder-gray-400 focus:outline-none {large ? 'px-6 py-4 text-lg' : 'px-4 py-2'}"
             autocomplete="off"
             spellcheck="false"
             on:mousedown|stopPropagation
             on:touchstart|stopPropagation
           />
           <button
             on:click={handleSearch}
             class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 border-l border-gray-700 transform active:scale-95 hover:scale-105 {large ? 'px-6 py-4' : 'px-4 py-2'}"
             class:animate-pulse={isSearching}
             aria-label="검색"
           >
             <svg class="{large ? 'w-6 h-6' : 'w-5 h-5'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
             </svg>
           </button>
         </div>
       </div>
