<!-- src/lib/components/ClassCard.svelte -->
<script lang="ts">
  
  export let classInfo: {
    name: string;
    class: string;
    image: string;
    role: string;
    difficulty: string;
    description: string;
  };
</script>

<div class="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
  <div class="text-center">
    <!-- 직업 이미지 -->
    <div class="w-20 h-20 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
      <img src={classInfo.image} alt={classInfo.name} class="w-16 h-16 rounded-lg" />
    </div>
    
    <!-- 직업 이름 -->
    <h3 class="text-xl font-bold text-white mb-2">{classInfo.name}</h3>
    
    <!-- 역할과 난이도 -->
    <div class="flex justify-center gap-2 mb-3">
      <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
        {classInfo.role}
      </span>
      <span class="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold">
        {classInfo.difficulty}
      </span>
    </div>
    
    <!-- 설명 -->
    <p class="text-gray-300 text-sm line-clamp-3">{classInfo.description}</p>
  </div>
</div>