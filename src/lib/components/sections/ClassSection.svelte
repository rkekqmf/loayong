<!-- src/lib/components/sections/ClassSection.svelte -->
<script lang="ts">
  import Carousel from '../Carousel.svelte';
  import ClassCard from '../ClassCard.svelte';
  import Footer from '../Footer.svelte';
  import { scale } from 'svelte/transition';
  import { elasticOut, bounceOut } from 'svelte/easing';
  
  const mockClasses = [
    { name: "데빌헌터", class: "DH", image: "/class/dh.png", role: "원거리 DPS", difficulty: "쉬움", description: "원거리에서 안정적인 딜링을 제공하는 직업" },
    { name: "버서커", class: "Berserker", image: "/class/bs.png", role: "근거리 DPS", difficulty: "보통", description: "강력한 근거리 딜링과 생존력을 갖춘 직업" },
    { name: "소서리스", class: "Sorceress", image: "/class/sc.png", role: "원거리 DPS", difficulty: "어려움", description: "강력한 마법 공격을 사용하는 원거리 딜러" },
    { name: "블레이드", class: "Blade", image: "/class/bl.png", role: "근거리 DPS", difficulty: "어려움", description: "빠른 공격속도와 높은 딜링을 자랑하는 직업" },
    { name: "바드", class: "Bard", image: "/class/bd.png", role: "서포터", difficulty: "쉬움", description: "팀원을 치유하고 버프를 제공하는 서포터" },
    { name: "팔라딘", class: "Paladin", image: "/class/pd.png", role: "서포터", difficulty: "보통", description: "강력한 방어력과 서포팅 능력을 갖춘 직업" }
  ];
</script>

<div 
  class="h-full flex flex-col"
  in:scale={{ duration: 600, start: 0.8, easing: elasticOut }}
  out:scale={{ duration: 400, start: 1, easing: bounceOut }}
>
  <div class="flex-1 flex flex-col justify-center px-8 py-4">
    <div class="text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">직업 정보</h2>
      <p class="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
        각 직업의 특징과 난이도를 알아보세요
      </p>
    </div>
    
    <div class="flex-1 flex items-center">
      <Carousel 
        items={mockClasses} 
        itemsPerView={3}
        autoplay={false}
        showArrows={false}
        showDots={false}
      >
        <svelte:fragment let:item let:itemIndex>
          <ClassCard classInfo={item} />
        </svelte:fragment>
      </Carousel>
    </div>
  </div>
  <div class="flex-shrink-0 mt-auto">
    <Footer />
  </div>
</div>
