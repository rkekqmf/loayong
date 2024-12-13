// 레이드 목록 정의 (레벨별)
export const raidTiers = {
	abyssDungeon: [
		{ id: 'kayangel', name: '카양겔', minLevel: 1540, goldReward: 1500 },
		{ id: 'atop', name: '상아탑', minLevel: 1600, goldReward: 2500 }
	],
	epicRaid: [{ id: 'vehemoth', name: '베히모스', minLevel: 1640, goldReward: 3500 }],
	legionRaid: [
		{ id: 'valtan', name: '발탄', minLevel: 1415, goldReward: 1500 },
		{ id: 'vykas', name: '비아키스', minLevel: 1445, goldReward: 2500 },
		{ id: 'kukusaton', name: '쿠크세이튼', minLevel: 1475, goldReward: 3500 },
		{ id: 'abrelshud', name: '아브렐슈드', minLevel: 1490, goldReward: 4500 },
		{ id: 'illiakan', name: '일리아칸', minLevel: 1540, goldReward: 1500 },
		{ id: 'kamen', name: '카멘', minLevel: 1610, goldReward: 2500 }
	],
	khaosRaid: [
		{ id: 'ekidna', name: '에키드나', minLevel: 1620, goldReward: 1500 },
		{ id: 'aegir', name: '에기르', minLevel: 1660, goldReward: 2500 },
		{ id: 'khaos_abrel', name: '아브렐슈드', minLevel: 1670, goldReward: 3500 }
	]
};
