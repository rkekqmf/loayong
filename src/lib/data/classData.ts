// 공통으로 사용되는 이미지 번호들
export const commonRevolutionImages = [1, 2, 3, 4, 5, 6, 12, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 27, 29, 32, 33, 34, 35, 38];
export const commonFolder01Images: number[] = []; // 01 폴더의 공통 이미지 번호
export const commonFolder02Images: number[] = []; // 02 폴더의 공통 이미지 번호

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

export const classData: Record<string, ClassData> = {
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
	버서커: {
		code: 'bk',
		name: '버서커',
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
	}
};
