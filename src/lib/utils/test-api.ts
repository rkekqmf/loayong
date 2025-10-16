// API 테스트용 함수
export async function testLostArkAPI() {
  const API_KEY = import.meta.env.VITE_LOSTARK_API_KEY;
  
  console.log('API Key 존재 여부:', !!API_KEY);
  console.log('API Key 길이:', API_KEY ? API_KEY.length : 0);
  
  if (!API_KEY) {
    console.error('❌ API 키가 설정되지 않았습니다!');
    console.log('📝 .env.local 파일에 VITE_LOSTARK_API_KEY=your_api_key_here 를 추가하세요');
    return { success: false, message: 'API 키가 설정되지 않았습니다' };
  }
  
  try {
    // 간단한 API 호출 테스트 (캐릭터 검색)
    const testCharacterName = '홍길동'; // 테스트용 캐릭터명
    const response = await fetch(`https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(testCharacterName)}/profiles`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });
    
    console.log('API 응답 상태:', response.status);
    console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API 호출 성공!', data);
      return { success: true, message: 'API 연결 성공!' };
    } else {
      const errorText = await response.text();
      console.error('❌ API 호출 실패:', response.status, errorText);
      return { success: false, message: `API 호출 실패: ${response.status}` };
    }
  } catch (error) {
    console.error('❌ 네트워크 오류:', error);
    return { success: false, message: `네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}` };
  }
}

// 브라우저 콘솔에서 테스트할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  (window as any).testLostArkAPI = testLostArkAPI;
}
