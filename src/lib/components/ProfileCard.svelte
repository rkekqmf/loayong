<!-- components/ProfileCard.svelte -->
<script lang="ts">
  export let user: {
    nickname: string;
    server: string;
    class: string;
    itemLevel: number;
    characterImage: string;
    guild: string;
    pvpRank: string;
  };
</script>

<div class="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-xl">
  <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
    <!-- 캐릭터 이미지 -->
    <div class="relative">
      <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg">
        <img 
          src={user.characterImage} 
          alt={user.class}
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
        <span class="text-gray-900 font-bold text-sm">★</span>
      </div>
    </div>

    <!-- 유저 정보 -->
    <div class="flex-1 text-center md:text-left">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">{user.nickname}</h1>
          <div class="flex items-center space-x-2 text-gray-400 text-sm">
            <span>{user.server}</span>
            <span>•</span>
            <span>{user.class}</span>
          </div>
        </div>
        <div class="mt-2 md:mt-0">
          <div class="inline-flex items-center px-3 py-1 bg-primary-500/20 text-primary-500 rounded-full text-sm font-semibold">
            아이템 레벨 {user.itemLevel}
          </div>
        </div>
      </div>

      <!-- 추가 정보 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <span class="text-gray-300">길드: <span class="text-white">{user.guild}</span></span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
          </svg>
          <span class="text-gray-300">PVP: <span class="text-primary-500 font-semibold">{user.pvpRank}</span></span>
        </div>
      </div>
    </div>
  </div>
</div>