<!-- src/lib/components/sections/ToolsSection.svelte -->
<script lang="ts">
  import Carousel from '../Carousel.svelte';
  import ToolCard from '../ToolCard.svelte';
  import Footer from '../Footer.svelte';
  import { scale } from 'svelte/transition';
  import { elasticOut, bounceOut } from 'svelte/easing';
  
  const mockTools = [
    { name: "스킬 시뮬레이터", icon: "⚡", description: "스킬 포인트 배분을 미리 확인해보세요", category: "계산기" },
    { name: "장비 최적화", icon: "⚔️", description: "최적의 장비 조합을 찾아보세요", category: "최적화" },
    { name: "길드 관리", icon: "🏰", description: "길드원 관리와 활동 현황을 확인하세요", category: "관리" },
    { name: "레이드 일정", icon: "📅", description: "레이드 일정을 관리하고 알림을 받으세요", category: "일정" },
    { name: "경매장 가격", icon: "💰", description: "아이템 시세를 실시간으로 확인하세요", category: "경제" },
    { name: "PVP 랭킹", icon: "🏆", description: "PVP 랭킹과 전적을 확인하세요", category: "PVP" }
  ];
</script>

<div 
  class="h-full flex flex-col"
  in:scale={{ duration: 600, start: 0.8, easing: elasticOut }}
  out:scale={{ duration: 400, start: 1, easing: bounceOut }}
>
  <div class="flex-1 flex flex-col justify-center px-8 py-4">
    <div class="text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">유용한 도구</h2>
      <p class="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
        게임을 더욱 편리하게 즐길 수 있는 다양한 도구들
      </p>
    </div>
    
    <div class="flex-1 flex items-center">
      <Carousel 
        items={mockTools} 
        itemsPerView={3}
        autoplay={false}
        showArrows={false}
        showDots={false}
      >
        <svelte:fragment let:item let:itemIndex>
          <ToolCard tool={item} />
        </svelte:fragment>
      </Carousel>
    </div>
  </div>
  <div class="flex-shrink-0 mt-auto">
    <Footer />
  </div>
</div>
