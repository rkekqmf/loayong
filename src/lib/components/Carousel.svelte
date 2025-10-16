<!-- src/lib/components/Carousel.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  export let items: any[] = [];
  export let itemsPerView = 3;
  export let showDots = true;
  export let showArrows = true;
  export let autoplay = true;
  export let autoplayInterval = 3000;
  
  let currentIndex = 0;
  let container: HTMLDivElement;
  let autoplayTimer: number;
  
  // 반응형 아이템 수 계산
  let responsiveItemsPerView = itemsPerView;
  
  function updateItemsPerView() {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) {
        responsiveItemsPerView = 1;
      } else if (width < 1024) {
        responsiveItemsPerView = 2;
      } else {
        responsiveItemsPerView = itemsPerView;
      }
    }
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % Math.ceil(items.length / responsiveItemsPerView);
  }
  
  function prevSlide() {
    currentIndex = currentIndex === 0 
      ? Math.ceil(items.length / responsiveItemsPerView) - 1 
      : currentIndex - 1;
  }
  
  function goToSlide(index: number) {
    currentIndex = index;
  }
  
  function startAutoplay() {
    if (autoplay) {
      autoplayTimer = setInterval(nextSlide, autoplayInterval) as unknown as number;
    }
  }
  
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  }
  
  onMount(() => {
    updateItemsPerView();
    startAutoplay();
    
    const handleResize = () => {
      updateItemsPerView();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stopAutoplay();
    };
  });
  
  // 반응형 변경 시 currentIndex 조정
  $: if (currentIndex >= Math.ceil(items.length / responsiveItemsPerView)) {
    currentIndex = Math.ceil(items.length / responsiveItemsPerView) - 1;
  }
</script>

<div class="relative w-full">
  <!-- 캐러셀 컨테이너 -->
  <div class="relative overflow-hidden rounded-lg">
    <div 
      bind:this={container}
      class="flex transition-transform duration-500 ease-in-out"
      style="transform: translateX(-${currentIndex * 100}%)"
      role="region"
      aria-label="캐러셀"
      on:mouseenter={stopAutoplay}
      on:mouseleave={startAutoplay}
    >
      {#each Array(Math.ceil(items.length / responsiveItemsPerView)) as _, slideIndex}
        <div class="w-full flex-shrink-0">
          <div class="grid gap-6 {responsiveItemsPerView === 1 ? 'grid-cols-1' : responsiveItemsPerView === 2 ? 'grid-cols-2' : 'grid-cols-3'}">
            {#each items.slice(slideIndex * responsiveItemsPerView, (slideIndex + 1) * responsiveItemsPerView) as item, itemIndex}
              <div class="px-2">
                <slot {item} {itemIndex} />
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- 네비게이션 화살표 -->
  {#if showArrows && items.length > responsiveItemsPerView}
    <button
      on:click={prevSlide}
      class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
      aria-label="이전 슬라이드"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <button
      on:click={nextSlide}
      class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/80 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
      aria-label="다음 슬라이드"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  {/if}
  
  <!-- 인디케이터 도트 -->
  {#if showDots && items.length > responsiveItemsPerView}
    <div class="flex justify-center mt-6 space-x-2">
      {#each Array(Math.ceil(items.length / responsiveItemsPerView)) as _, dotIndex}
        <button
          on:click={() => goToSlide(dotIndex)}
          class="w-3 h-3 rounded-full transition-all duration-200 {dotIndex === currentIndex 
            ? 'bg-primary-500 scale-125' 
            : 'bg-gray-600 hover:bg-gray-500'}"
          aria-label="슬라이드 {dotIndex + 1}로 이동"
        ></button>
      {/each}
    </div>
  {/if}
</div>
