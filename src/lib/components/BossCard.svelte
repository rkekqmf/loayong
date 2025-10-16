<!-- src/lib/components/BossCard.svelte -->
<script lang="ts">
  export let boss: {
    name: string;
    image: string;
    difficulty: string;
    itemLevel: number;
    gateCount: number;
    description: string;
  };
</script>

<div class="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
  <div class="text-center">
    <!-- 잔혈컷 이미지 -->
    <div class="w-20 h-20 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
      <span class="text-3xl">👹</span>
    </div>
    
    <!-- 잔혈컷 이름 -->
    <h3 class="text-xl font-bold text-white mb-2">{boss.name}</h3>
    
    <!-- 난이도 -->
    <div class="flex justify-center mb-3">
      <span class="bg-primary-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
        {boss.difficulty}
      </span>
    </div>
    
    <!-- 정보 -->
    <div class="space-y-2 text-sm text-gray-400">
      <div>입장 레벨: {boss.itemLevel}</div>
      <div>게이트 수: {boss.gateCount}개</div>
    </div>
    
    <!-- 설명 -->
    <p class="text-gray-300 text-sm mt-4 line-clamp-2">{boss.description}</p>
  </div>
</div>