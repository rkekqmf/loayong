import { classData } from '$lib/data/classData';

export function getClassCode(className?: string): string {
	if (!className) return '';
	return className in classData ? classData[className as keyof typeof classData].code : '';
}

// export * from './class';
// export * from './other-utils';
// ... 다른 유틸리티 파일들

const BASE_URL = 'https://developer-lostark.game.onstove.com/armories/characters';

export async function fetchArmoriesData<T>(characterId: string, endpoint: string): Promise<string | null> {
	try {
		const encodedId = encodeURIComponent(characterId);
		const url = `${BASE_URL}/${encodedId}/${endpoint}`;

		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				authorization: `bearer ${import.meta.env.VITE_LOSTARK_API_KEY}`
			}
		};

		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`API 호출 실패: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error('데이터 가져오기 실패:', error);
		return null;
	}
}
