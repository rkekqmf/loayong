<!-- components/CharacterCard.svelte -->
<script lang="ts">
  export let character: {
    name: string;
    class: string;
    level: number;
    itemLevel: number;
    characterImage: string;
    server: string;
  };
</script>

<div class="group bg-gray-800 rounded-lg border border-gray-700 p-4 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10">
  <div class="flex items-center space-x-4">
    <!-- 캐릭터 이미지 -->
    <div class="relative">
      <div class="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600 group-hover:border-primary-500 transition-colors duration-300">
        <img 
          src={character.characterImage} 
          alt={character.class}
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
        <span class="text-gray-900 font-bold text-xs">
          {character.level}
        </span>
      </div>
    </div>

    <!-- 캐릭터 정보 -->
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-semibold text-white truncate transition-colors duration-300 group-hover:text-primary-500">
        {character.name}
      </h3>
      <div class="flex items-center space-x-2 text-sm text-gray-400">
        <span class="bg-gray-700 px-2 py-1 rounded text-xs font-medium">
          {character.class}
        </span>
        <span>•</span>
        <span>{character.server}</span>
      </div>
      <div class="mt-1">
        <span class="font-semibold text-sm text-primary-500">
          아이템 레벨 {character.itemLevel}
        </span>
      </div>
    </div>

    <!-- 화살표 아이콘 -->
    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </div>
</div>