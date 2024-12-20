// 공통으로 사용되는 이미지 번호들
export const commonRevolutionImages = [1, 2, 3, 4, 5, 6, 12, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 27, 29, 32, 33, 34, 35, 38];
export const commonFolder01Images: number[] = []; // 01 폴더의 공통 이미지 번호
export const commonFolder02Images: number[] = []; // 02 폴더의 공통 이미지 번호

interface BasicClassInfo {
	code: string;
	name: string;
}

interface ContinentClasses {
	슈샤이어: Record<string, BasicClassInfo>;
	애니츠: Record<string, BasicClassInfo>;
	실린: Record<string, BasicClassInfo>;
	아르데타인: Record<string, BasicClassInfo>;
	데런: Record<string, BasicClassInfo>;
	요즈: Record<string, BasicClassInfo>;
}

export const classEngravings: Record<string, string[]> = {
	// 슈샤이어
	워로드: ['전투 태세', '고독한 기사'],
	디스트로이어: ['분노의 망치', '중력 수련'],
	버서커: ['광기', '광전사의 비기'],
	홀리나이트: ['심판자', '축복의 오라'],
	슬레이어: ['처단자', '포식자'],

	// 애니츠
	스트라이커: ['오의 강화', '일격필살'],
	브레이커: ['초심', '체술'],
	배틀마스터: ['오의 강화', '응급처치'],
	인파이터: ['충격 단련', '극의: 체술'],
	기공사: ['역천지체', '세맥타통'],
	창술사: ['절정', '절제'],

	// 실린
	소서리스: ['점화', '환류'],
	서머너: ['상급 소환사', '넘치는 교감'],
	아르카나: ['황후의 은총', '황제의 칙령'],
	바드: ['진실된 용맹', '절제'],

	// 아르데타인
	데빌헌터: ['강화 무기', '핸드거너'],
	호크아이: ['죽음의 습격', '매의 눈'],
	블래스터: ['화력 강화', '포격 강화'],
	스카우터: ['아르티팩트', '진화의 유산'],
	건슬링어: ['피스메이커', '타임 투 헌트'],

	// 데런
	블레이드: ['잔재된 기운', '버스트'],
	리퍼: ['갈증', '달의 소리'],
	데모닉: ['완벽한 억제', '충동'],
	소울이터: ['만월의 집행자', '그믐의 경계'],

	// 요즈
	도화가: ['만개', '회귀'],
	기상술사: ['질풍노도', '이슬비'],
	환수사: ['황혼의 경계', '만월의 집행자']
};

export const continentClasses: ContinentClasses = {
	슈샤이어: {
		워로드: { code: 'gl', name: '워로드' },
		디스트로이어: { code: 'dt', name: '디스트로이어' },
		버서커: { code: 'bk', name: '버서커' },
		홀리나이트: { code: 'he', name: '홀리나이트' },
		슬레이어: { code: 'bkf', name: '슬레이어' }
	},
	애니츠: {
		스트라이커: { code: 'bmm', name: '스트라이커' },
		브레이커: { code: 'ifm', name: '브레이커' },
		배틀마스터: { code: 'bm', name: '배틀마스터' },
		인파이터: { code: 'if', name: '인파이터' },
		기공사: { code: 'so', name: '기공사' },
		창술사: { code: 'lm', name: '창술사' }
	},
	실린: {
		소서리스: { code: 'scs', name: '소서리스' },
		서머너: { code: 'sm', name: '서머너' },
		아르카나: { code: 'ac', name: '아르카나' },
		바드: { code: 'bd', name: '바드' }
	},
	아르데타인: {
		데빌헌터: { code: 'dh', name: '데빌헌터' },
		호크아이: { code: 'hk', name: '호크아이' },
		블래스터: { code: 'bs', name: '블래스터' },
		스카우터: { code: 'sc', name: '스카우터' },
		건슬링어: { code: 'dhf', name: '건슬링어' }
	},
	데런: {
		블레이드: { code: 'bl', name: '블레이드' },
		리퍼: { code: 'rp', name: '리퍼' },
		데모닉: { code: 'dm', name: '데모닉' },
		소울이터: { code: 'se', name: '소울이터' }
	},
	요즈: {
		도화가: { code: 'yy', name: '도화가' },
		기상술사: { code: 'wa', name: '기상술사' },
		환수사: { code: 'sw', name: '환수사' }
	}
};

interface ClassData {
	code: string;
	name: string;
	revolution: number[];
	ggadal: {
		folder01: number[];
		folder02: number[];
		class: number[];
	};
	jump: {
		folder01: number[];
		folder02: number[];
		class: number[];
	};
}

export const classData = {
	워로드: {
		code: 'gl',
		name: '워로드',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	디스트로이어: {
		code: 'dt',
		name: '디스트로이어',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	버서커: {
		code: 'bk',
		name: '버서커',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	홀리나이트: {
		code: 'he',
		name: '홀리나이트',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	슬레이어: {
		code: 'bkf',
		name: '슬레이어',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	스트라이커: {
		code: 'bmm',
		name: '스트라이커',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	브레이커: {
		code: 'ifm',
		name: '브레이커',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	배틀마스터: {
		code: 'bm',
		name: '배틀마스터',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	인파이터: {
		code: 'if',
		name: '인파이터',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5, 7, 8, 9, 10]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	기공사: {
		code: 'so',
		name: '기공사',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	창술사: {
		code: 'lm',
		name: '창술사',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	소서리스: {
		code: 'scs',
		name: '소서리스',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	서머너: {
		code: 'sm',
		name: '서머너',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	아르카나: {
		code: 'ac',
		name: '아르카나',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [9, 10, 11, 12]
		}
	},
	바드: {
		code: 'bd',
		name: '바드',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	데빌헌터: {
		code: 'dh',
		name: '데빌헌터',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	호크아이: {
		code: 'hk',
		name: '호크아이',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	블래스터: {
		code: 'bs',
		name: '블래스터',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	스카우터: {
		code: 'sc',
		name: '스카우터',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	건슬링어: {
		code: 'dhf',
		name: '건슬링어',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	블레이드: {
		code: 'bl',
		name: '블레이드',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	리퍼: {
		code: 'rp',
		name: '리퍼',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	데모닉: {
		code: 'dm',
		name: '데모닉',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	소울이터: {
		code: 'se',
		name: '소울이터',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	도화가: {
		code: 'yy',
		name: '도화가',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	기상술사: {
		code: 'wa',
		name: '기상술사',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	},
	환수사: {
		code: 'sw',
		name: '환수사',
		revolution: commonRevolutionImages,
		ggadal: {
			folder01: [],
			folder02: [],
			class: []
		},
		jump: {
			folder01: [],
			folder02: [],
			class: [1, 2, 3, 5]
		}
	}
};

export const classes = Object.values(classData).map(({ code, name }) => ({
	code,
	name
}));
