<!-- src/lib/components/sections/RankingSection.svelte -->
<script lang="ts">
  import Footer from '../Footer.svelte';
  import { scale } from 'svelte/transition';
  import { elasticOut, bounceOut } from 'svelte/easing';
</script>

<div 
  class="h-full flex flex-col"
  in:scale={{ duration: 600, start: 0.8, easing: elasticOut }}
  out:scale={{ duration: 400, start: 1, easing: bounceOut }}
>
  <div class="flex-1 flex flex-col justify-center px-8 py-4">
    <div class="text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">서버 랭킹</h2>
      <p class="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
        각 서버별 길드 랭킹을 확인해보세요
      </p>
    </div>
    
    <div class="flex-1 flex items-center">
      <div class="w-full bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-500 mb-4">루페온</div>
            <div class="text-gray-400 text-lg mb-4">서버 1위</div>
            <div class="text-white text-xl mb-2">전설의길드</div>
            <div class="text-gray-300 text-sm">길드원: 120명 | 레벨: 85</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-500 mb-4">아만</div>
            <div class="text-gray-400 text-lg mb-4">서버 2위</div>
            <div class="text-white text-xl mb-2">강자의길드</div>
            <div class="text-gray-300 text-sm">길드원: 115명 | 레벨: 84</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-500 mb-4">카단</div>
            <div class="text-gray-400 text-lg mb-4">서버 3위</div>
            <div class="text-white text-xl mb-2">마법의길드</div>
            <div class="text-gray-300 text-sm">길드원: 110명 | 레벨: 83</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-shrink-0 mt-auto">
    <Footer />
  </div>
</div>
