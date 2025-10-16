<!-- src/lib/components/sections/BossSection.svelte -->
<script lang="ts">
  import { scale, fly } from 'svelte/transition';
  import { elasticOut, bounceOut } from 'svelte/easing';
  import Footer from '../Footer.svelte';
  import { onMount } from 'svelte';

  // 보스 단계별 데이터 (서막 제거)
  const bossStages = [
    {
      id: 'gadian',
      name: '가디언',
      normalHp: 0, // 억 단위
      hardHp: 0, // 억 단위
      hasDifficulty: false,
      gates: [
        { id: 'gate1', name: '드렉탈라스', normalHp: 1500, hardHp: 0, normalGradeCut: { strong: 445, cruel: 590}, hardGradeCut: { strong: 0, cruel: 0 } },
        { id: 'gate2', name: '크라티오스스', normalHp: 2000, hardHp: 0, normalGradeCut: { strong: 590, cruel: 785 }, hardGradeCut: { strong: 0, cruel: 0 } }
      ]
    },
    {
      id: 'act1', 
      name: '1막',
      normalHp: 0.75, // 억 단위
      hardHp: 1.2, // 억 단위
      hasDifficulty: true,
      gates: [
        { id: 'gate1', name: '1관', normalHp: 1729.55, hardHp: 2890.23, normalGradeCut: { strong: 274, cruel: 365 }, hardGradeCut: { strong: 450, cruel: 600 } },
        { id: 'gate2', name: '2관', normalHp: 1989.62, hardHp: 3840.41, normalGradeCut: { strong: 340, cruel: 450 }, hardGradeCut: { strong: 600, cruel: 800 } }
      ]
    },
    {
      id: 'act2',
      name: '2막',
      normalHp: 1.0, // 억 단위
      hardHp: 1.6, // 억 단위
      hasDifficulty: true,
      gates: [
        { id: 'gate1', name: '1관', normalHp: 3220.71, hardHp: 5984.31, normalGradeCut: { strong: 450, cruel: 600 }, hardGradeCut: { strong: 610, cruel: 810 } },
        { id: 'gate2', name: '2관', normalHp: 3853.59, hardHp: 8377.30, normalGradeCut: { strong: 900, cruel: 1200 }, hardGradeCut: { strong: 1200, cruel: 1600 } }
      ]
    },
    {
      id: 'act3',
      name: '3막',
      normalHp: 1.5, // 억 단위
      hardHp: 2.4, // 억 단위
      hasDifficulty: true,
      gates: [
        { id: 'gate1', name: '1관', normalHp: 3515.64, hardHp: 6220.49, normalGradeCut: { strong: 510, cruel: 680 }, hardGradeCut: { strong: 920, cruel: 1220 } },
        { id: 'gate2', name: '2관', normalHp: 3235.35, hardHp: 6095.12, normalGradeCut: { strong: 480, cruel: 640 }, hardGradeCut: { strong: 980, cruel: 1300 } },
        { id: 'gate3', name: '3관', normalHp: 6770.75, hardHp: 14036.44, normalGradeCut: { strong: 1050, cruel: 1400 }, hardGradeCut: { strong: 2220, cruel: 2950 } }
      ]
    },
    {
      id: 'act4',
      name: '4막',
      normalHp: 2.0, // 억 단위
      hardHp: 3.2, // 억 단위
      hasDifficulty: true,
      gates: [
        { id: 'gate1', name: '1관', normalHp: 10000, hardHp: 10000, normalGradeCut: { strong: 740, cruel: 990 }, hardGradeCut: { strong: 1425, cruel: 1900 } },
        { id: 'gate2', name: '2관', normalHp: 10000, hardHp: 10000, normalGradeCut: { strong: 950, cruel: 1270 }, hardGradeCut: { strong: 1575, cruel: 2100 } }
      ]
    },
    {
      id: 'finale',
      name: '종막',
      normalHp: 3.0, // 억 단위
      hardHp: 4.8, // 억 단위
      thefirstHp: 5.0, // 억 단위
      hasDifficulty: true,
      hasTheFirst: true,
      gates: [
        { 
          id: 'gate1', 
          name: '1관', 
          normalHp: 10000, 
          hardHp: 20000, 
          thefirstHp: 50000, // 더퍼스트 전용 HP 추가
          normalGradeCut: { strong: 1190, cruel: 1590 }, 
          hardGradeCut: { strong: 2370, cruel: 3170 }, 
          thefirstGradeCut: { strong: 3660, cruel: 4900 } 
        },
        { 
          id: 'gate2', 
          name: '2관', 
          normalHp: 10000, 
          hardHp: 40000, 
          thefirstHp: 70000, // 더퍼스트 전용 HP 추가
          normalGradeCut: { strong: 1050, cruel: 1400 }, 
          hardGradeCut: { strong: 4200, cruel: 5625 }, 
          thefirstGradeCut: { strong: 5700, cruel: 7600 } 
        }
      ]
    }
  ];

  // 현재 선택된 보스 인덱스
  let selectedBossIndex = 0;

  // 현재 선택된 보스의 상태
  let currentGate = {
    ...bossStages[0].gates[0],
    difficulty: 'normal' as 'normal' | 'hard' | 'thefirst',
    damageInput: '',
    calculatedPercentage: 0
  };

  // 각 관문별 상태를 관리하는 객체
  let gateStates: { [key: string]: { damageInput: string; calculatedPercentage: number; maxReached: boolean } } = {};

  // 관문 상태 초기화
  function initializeGateStates() {
    gateStates = {};
    bossStages.forEach(boss => {
      boss.gates.forEach(gate => {
        gateStates[gate.id] = {
          damageInput: '',
          calculatedPercentage: 0,
          maxReached: false
        };
      });
    });
  }

  // 보스 선택 함수
  function selectBoss(index: number) {
    selectedBossIndex = index;
    currentGate = {
      ...bossStages[index].gates[0],
      difficulty: currentGate.difficulty,
      damageInput: '',
      calculatedPercentage: 0
    };
    // 모든 관문의 입력값 초기화
    initializeGateStates();
    // 모든 관문의 딜량을 다시 계산
    bossStages[index].gates.forEach(gate => {
      calculateGateDamagePercentage(gate.id, currentGate.difficulty);
    });
  }

  // 관문별 딜 비율 계산 함수
  function calculateGateDamagePercentage(gateId: string, difficulty: 'normal' | 'hard' | 'thefirst') {
    const gate = bossStages[selectedBossIndex].gates.find(g => g.id === gateId);
    if (!gate) return;

    const damage = parseFloat(gateStates[gateId].damageInput);
    
    if (isNaN(damage) || damage <= 0) {
      gateStates[gateId] = {
        ...gateStates[gateId],
        calculatedPercentage: 0
      };
      return;
    }

    // 입력값은 이미 억 단위
    const damageInEok = damage;

    let maxHp;
    if (difficulty === 'normal') {
      maxHp = gate.normalHp;
    } else if (difficulty === 'hard') {
      maxHp = gate.hardHp;
    } else {
      maxHp = gate.thefirstHp || gate.hardHp;
    }
    
    const percentage = (damageInEok / maxHp) * 100;
    const roundedPercentage = Math.min(Math.round(percentage * 100) / 100, 100); // 최대 100%로 제한
    
    gateStates[gateId] = {
      ...gateStates[gateId],
      calculatedPercentage: roundedPercentage
    };
  }

  // 관문별 딜 등급 계산 함수
  function getGateDamageGrade(gateId: string, percentage: number, difficulty: 'normal' | 'hard' | 'thefirst'): { grade: string; color: string } {
    const gate = bossStages[selectedBossIndex].gates.find(g => g.id === gateId);
    if (!gate) return { grade: '투사', color: 'text-gray-400' };

    let gradeCut;
    if (difficulty === 'normal') {
      gradeCut = gate.normalGradeCut;
    } else if (difficulty === 'hard') {
      gradeCut = gate.hardGradeCut;
    } else {
      gradeCut = gate.thefirstGradeCut || gate.hardGradeCut;
    }

    // 입력된 딜량을 억 단위로 변환
    const damageInput = parseFloat(gateStates[gateId]?.damageInput || '0');
    const damageInEok = damageInput; // 이미 억 단위로 입력받음

    if (damageInEok < gradeCut.strong) {
      return { grade: '투사', color: 'text-gray-400' };
    } else if (damageInEok < gradeCut.cruel) {
      return { grade: '강직한 투사', color: 'text-blue-400' };
    } else {
      return { grade: '잔혹한 혈투사', color: 'text-red-400' };
    }
  }

  // 관문 입력값 변경 핸들러
  function handleGateDamageInput(gateId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // 숫자와 소수점만 허용
    let cleanValue = value.replace(/[^0-9.]/g, '');
    
    // 소수점이 여러 개면 첫 번째만 허용
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // 소수점 이하 2자리로 제한
    if (parts.length === 2 && parts[1].length > 2) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    // 최대 체력으로 제한
    const gate = bossStages[selectedBossIndex].gates.find(g => g.id === gateId);
    if (gate) {
      let maxHp;
      if (currentGate.difficulty === 'normal') {
        maxHp = gate.normalHp;
      } else if (currentGate.difficulty === 'hard') {
        maxHp = gate.hardHp;
      } else {
        maxHp = gate.thefirstHp || gate.hardHp;
      }
      
      const inputValue = parseFloat(cleanValue);
      
      if (!isNaN(inputValue) && inputValue > maxHp) {
        cleanValue = maxHp.toFixed(2); // 소수점 2자리로 제한
        gateStates[gateId] = {
          ...gateStates[gateId],
          damageInput: cleanValue,
          maxReached: true
        };
        // 최대 체력 도달 알림
        setTimeout(() => {
          gateStates[gateId] = {
            ...gateStates[gateId],
            maxReached: false
          };
        }, 2000);
      } else {
        gateStates[gateId] = {
          ...gateStates[gateId],
          damageInput: cleanValue,
          maxReached: false
        };
      }
    } else {
      gateStates[gateId] = {
        ...gateStates[gateId],
        damageInput: cleanValue,
        maxReached: false
      };
    }
    
    calculateGateDamagePercentage(gateId, currentGate.difficulty);
  }

  // 난이도 변경 핸들러
  function handleDifficultyChange(difficulty: 'normal' | 'hard' | 'thefirst') {
    currentGate = {
      ...currentGate,
      difficulty: difficulty
    };
    bossStages[selectedBossIndex].gates.forEach(gate => {
      calculateGateDamagePercentage(gate.id, difficulty);
    });
  }

  // 숫자 포맷팅 함수 (억/조 단위로 표시)
  function formatNumber(num: number): string {
    if (num >= 10000) {
      // 10000억 이상이면 조 단위로 표시
      const jo = num / 10000;
      return jo % 1 === 0 ? `${jo}조` : `${jo.toFixed(2)}조`;
    } else if (num >= 1) {
      return num % 1 === 0 ? `${num}억` : `${num.toFixed(2)}억`;
    } else {
      const man = num * 10000;
      return man % 1 === 0 ? `${man}만` : `${man.toFixed(2)}만`;
    }
  }

  // 섹션 변경 감지하여 포커스 제거
  onMount(() => {
    // 관문 상태 초기화
    initializeGateStates();
    
    const handleSectionChanged = (event: CustomEvent) => {
      const sectionId = event.detail.sectionId;
      // 보스 섹션(1번)이 아닌 다른 섹션으로 이동할 때 포커스 제거
      if (sectionId !== 1) {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
          activeElement.blur();
        }
      }
    };

    window.addEventListener('sectionChanged', handleSectionChanged as EventListener);

    return () => {
      window.removeEventListener('sectionChanged', handleSectionChanged as EventListener);
    };
  });
</script>

<div 
  class="h-full flex flex-col"
  in:scale={{ duration: 600, start: 0.8, easing: elasticOut }}
  out:scale={{ duration: 400, start: 1, easing: bounceOut }}
>
  <div class="flex-1 flex flex-col justify-center px-8 py-4">
    <!-- 헤더 -->
    <div class="text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">보스 딜 비율 계산기</h2>
      <p class="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
        각 보스 단계별로 딜량을 입력하여 체력 대비 비율을 확인하세요
      </p>
    </div>
    
    <!-- 메인 컨텐츠 영역 -->
    <div class="flex-1 flex items-center">
      <div class="flex max-w-6xl mx-auto w-full">
        <!-- 왼쪽 버튼 메뉴 -->
        <div class="w-28 flex-shrink-0">
          <div class="space-y-2">
            {#each bossStages as boss, index}
              <button
                class="w-full py-4 px-6 text-left rounded-l-lg font-medium transition-all duration-300
                       {selectedBossIndex === index 
                         ? 'bg-blue-600 text-white shadow-lg' 
                         : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'}"
                on:click={() => selectBoss(index)}
                in:fly={{ x: -20, duration: 300, delay: index * 50 }}
              >
                {boss.name}
              </button>
            {/each}
          </div>
        </div>

        <!-- 오른쪽 카드 영역 -->
        <div class="flex-1">
          <div 
            class="bg-white/10 rounded-r-xl p-6 transition-all duration-300"
            in:fly={{ x: 20, duration: 400 }}
          >
            <!-- 막 이름과 난이도 선택 -->
            <div class="flex items-center justify-center mb-6 gap-4">
              <h3 class="text-2xl font-bold text-white">
                {bossStages[selectedBossIndex].name}
              </h3>
              
              <!-- 난이도 선택 -->
              <div class="flex bg-gray-800/50 rounded-lg p-1 max-w-sm">
                <button
                  class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200
                         {currentGate.difficulty === 'normal' 
                           ? 'bg-blue-600 text-white shadow-lg' 
                           : 'text-gray-300 hover:text-white'}"
                  on:click={() => handleDifficultyChange('normal')}
                >
                  노말
                </button>
                <button
                  class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200
                         {currentGate.difficulty === 'hard' 
                           ? 'bg-red-600 text-white shadow-lg' 
                           : 'text-gray-300 hover:text-white'}"
                  on:click={() => handleDifficultyChange('hard')}
                >
                  하드
                </button>
                {#if bossStages[selectedBossIndex].id === 'finale'}
                  <button
                    class="flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200
                           {currentGate.difficulty === 'thefirst' 
                             ? 'bg-purple-600 text-white shadow-lg' 
                             : 'text-gray-300 hover:text-white'}"
                    on:click={() => handleDifficultyChange('thefirst')}
                  >
                    더퍼
                  </button>
                {/if}
              </div>
            </div>

            <!-- 관문별 딜 계산기 -->
            <div class="space-y-4">
              {#each bossStages[selectedBossIndex].gates as gate}
                <div class="bg-gray-800/30 rounded-lg p-4">
                  <!-- 관문 이름과 체력 -->
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-lg font-semibold text-white">{gate.name}</h4>
                    <p class="text-sm text-gray-300">
                      ( {formatNumber(
                        currentGate.difficulty === 'normal' 
                          ? gate.normalHp 
                          : currentGate.difficulty === 'hard' 
                            ? gate.hardHp 
                            : gate.thefirstHp || gate.hardHp
                      )} )
                    </p>
                  </div>
                  
                  <!-- 딜량 입력과 결과를 가로로 배치 -->
                  <div class="flex items-center gap-4">
                    <!-- 딜량 입력 -->
                    <div class="flex-1">
                      <input
                        type="text"
                        class="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-sm"
                        placeholder="딜량 (억 단위)"
                        value={gateStates[gate.id]?.damageInput || ''}
                        on:input={(e) => handleGateDamageInput(gate.id, e)}
                        on:mousedown|stopPropagation
                        on:touchstart|stopPropagation
                      />
                      <!-- 최대 체력 알림 -->
                      {#if gateStates[gate.id]?.maxReached}
                        <p class="text-xs text-red-400 mt-1 text-center">최대 체력입니다!</p>
                      {/if}
                    </div>
                    
                    <!-- 딜 비율과 등급 -->
                    <div class="flex items-center gap-3">
                      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-md px-3 py-2 text-center min-w-[80px]">
                        <p class="text-sm font-bold text-white">
                          {gateStates[gate.id]?.calculatedPercentage || 0}%
                        </p>
                      </div>
                      <div class="min-w-[100px]">
                        <p class="text-sm font-medium {getGateDamageGrade(gate.id, gateStates[gate.id]?.calculatedPercentage || 0, currentGate.difficulty).color}">
                          {getGateDamageGrade(gate.id, gateStates[gate.id]?.calculatedPercentage || 0, currentGate.difficulty).grade}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>

            <!-- 오차 안내 -->
            <div class="text-center mt-6">
              <p class="text-xs text-yellow-400 bg-yellow-400/10 rounded-lg p-2 max-w-md mx-auto">
                ⚠️ 약 ±20% 오차가 있을 수 있음
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="flex-shrink-0 mt-auto">
    <Footer />
  </div>
</div>
