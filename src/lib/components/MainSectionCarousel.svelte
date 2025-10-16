<!-- src/lib/components/MainSectionCarousel.svelte -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import CharacterSection from './sections/CharacterSection.svelte';
  import BossSection from './sections/BossSection.svelte';
  import ClassSection from './sections/ClassSection.svelte';
  import ToolsSection from './sections/ToolsSection.svelte';
  import RankingSection from './sections/RankingSection.svelte';
  
  const dispatch = createEventDispatcher();
  
  let currentSection = 0;
  let container: HTMLDivElement;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let translateX = 0;
  
  const sections = [
    { id: 0, name: '캐릭터', icon: '👥' },
    { id: 1, name: '잔혈컷', icon: '👹' },
    { id: 2, name: '직업', icon: '⚔️' },
    { id: 3, name: '도구', icon: '🛠️' },
    { id: 4, name: '랭킹', icon: '🏆' }
  ];
  
  // 검색 이벤트 처리
  function handleSearch(event: CustomEvent) {
    console.log('MainSectionCarousel에서 검색 이벤트 받음:', event.detail);
    // event.detail을 전달해야 함 (전체 event 객체가 아닌)
    dispatch('search', event.detail);
  }
  
      function goToSection(index: number) {
        if (index >= 0 && index < sections.length) {
          currentSection = index;
          updateTransform();
          
          // 검색바 위치 제어를 위한 이벤트 전달
          window.dispatchEvent(new CustomEvent('sectionChanged', { detail: { sectionId: index } }));
        }
      }
  
      function nextSection() {
        if (currentSection < sections.length - 1) {
          currentSection++;
          updateTransform();
          
          // 검색바 위치 제어를 위한 이벤트 전달
          window.dispatchEvent(new CustomEvent('sectionChanged', { detail: { sectionId: currentSection } }));
        }
      }

      function prevSection() {
        if (currentSection > 0) {
          currentSection--;
          updateTransform();
          
          // 검색바 위치 제어를 위한 이벤트 전달
          window.dispatchEvent(new CustomEvent('sectionChanged', { detail: { sectionId: currentSection } }));
        }
      }
  
  function updateTransform() {
    if (container) {
      container.style.transform = `translateY(-${currentSection * 100}%)`;
    }
  }
  
  // 드래그 기능
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.clientY;
    currentX = e.clientY;
    e.preventDefault();
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    currentX = e.clientY;
    const deltaY = startX - currentX;
    
    // 드래그 임계값
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentSection < sections.length - 1) {
        nextSection();
        isDragging = false;
      } else if (deltaY < 0 && currentSection > 0) {
        prevSection();
        isDragging = false;
      }
    }
  }
  
  function handleMouseUp() {
    isDragging = false;
  }
  
  // 터치 이벤트
  function handleTouchStart(e: TouchEvent) {
    isDragging = true;
    startX = e.touches[0].clientY;
    currentX = e.touches[0].clientY;
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isDragging) return;
    currentX = e.touches[0].clientY;
    const deltaY = startX - currentX;
    
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentSection < sections.length - 1) {
        nextSection();
        isDragging = false;
      } else if (deltaY < 0 && currentSection > 0) {
        prevSection();
        isDragging = false;
      }
    }
  }
  
  function handleTouchEnd() {
    isDragging = false;
  }
  
  onMount(() => {
    updateTransform();
    
    // 키보드 네비게이션
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        prevSection();
      } else if (e.key === 'ArrowDown') {
        nextSection();
      }
    };
    
    // 섹션 네비게이션 이벤트
    const handleSectionNavigate = (e: CustomEvent) => {
      const sectionId = e.detail.sectionId;
      goToSection(sectionId);
    };
    
    // 스크롤 이벤트 (섹션 단위 이동)
    let isScrolling = false;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      
      isScrolling = true;
      if (e.deltaY > 0) {
        // 아래로 스크롤 - 다음 섹션
        nextSection();
      } else {
        // 위로 스크롤 - 이전 섹션
        prevSection();
      }
      
      // 스크롤 쿨다운
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };
    
    // 마우스/터치 이벤트를 컨테이너에 직접 추가
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseUp);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleTouchEnd);
    }
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('sectionNavigate', handleSectionNavigate as EventListener);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseUp);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('sectionNavigate', handleSectionNavigate as EventListener);
      window.removeEventListener('wheel', handleWheel);
    };
  });
</script>

<div class="relative w-full h-full">

  <!-- 메인 캐러셀 컨테이너 (전체 화면) -->
  <div class="relative overflow-hidden h-full w-full">
    <div 
      bind:this={container}
      class="flex flex-col transition-transform duration-700 ease-in-out h-full w-full cursor-grab active:cursor-grabbing"
    >
          <div class="h-full flex-shrink-0 w-full">
            <CharacterSection on:search={handleSearch} />
          </div>
      <div class="h-full flex-shrink-0 w-full">
        <BossSection />
      </div>
      <div class="h-full flex-shrink-0 w-full">
        <ClassSection />
      </div>
      <div class="h-full flex-shrink-0 w-full">
        <ToolsSection />
      </div>
      <div class="h-full flex-shrink-0 w-full">
        <RankingSection />
      </div>
    </div>
  </div>
</div>
