<!-- src/lib/components/ToolCard.svelte -->
<script lang="ts">
  export let tool: {
    name: string;
    icon: string;
    description: string;
    category: string;
    url?: string;
  };
</script>

<div class="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer">
  <div class="text-center">
    <!-- 도구 아이콘 -->
    <div class="text-4xl mb-4">{tool.icon}</div>
    
    <!-- 도구 이름 -->
    <h3 class="text-xl font-bold text-white mb-2">{tool.name}</h3>
    
    <!-- 카테고리 -->
    <div class="flex justify-center mb-3">
      <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        {tool.category}
      </span>
    </div>
    
    <!-- 설명 -->
    <p class="text-gray-300 text-sm">{tool.description}</p>
  </div>
</div>