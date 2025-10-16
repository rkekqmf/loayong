// 로스트아크 API 호출 유틸리티
const BASE_URL = 'https://developer-lostark.game.onstove.com';

// API 키는 환경변수에서 가져오기
const API_KEY = import.meta.env.VITE_LOSTARK_API_KEY;

export interface CharacterProfile {
  CharacterName: string;
  CharacterClassName: string;
  CharacterLevel: number;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
  ServerName: string;
  CharacterImage: string;
  ExpeditionLevel: number;
  PvpGradeName: string;
  TownLevel: number;
  TownName: string;
  Title: string;
  GuildName: string;
  GuildMemberGrade: string;
  UsingSkillPoint: number;
  TotalSkillPoint: number;
  Stats: Array<{
    Type: string;
    Value: string;
    Tooltip: string[];
  }>;
  Tendencies: Array<{
    Type: string;
    Point: number;
    MaxPoint: number;
  }>;
}

export interface CharacterEquipment {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: string;
}

export interface CharacterEngraving {
  Name: string;
  Icon: string;
  Description: string;
}

export interface CharacterGem {
  Name: string;
  Icon: string;
  Level: number;
  Grade: string;
  Tooltip: string;
}

export interface CharacterCard {
  Name: string;
  Icon: string;
  AwakeCount: number;
  AwakeTotal: number;
  Grade: string;
  Tooltip: string;
}

export interface CharacterSkill {
  Name: string;
  Icon: string;
  Level: number;
  Type: string;
  IsAwakening: boolean;
  Tripods: Array<{
    Tier: number;
    Slot: number;
    Name: string;
    Icon: string;
    Level: number;
    IsSelected: boolean;
    Tooltip: string;
  }>;
  Rune: {
    Name: string;
    Icon: string;
    Grade: string;
    Tooltip: string;
  } | null;
}

export interface CharacterCollectible {
  Type: string;
  Icon: string;
  Point: number;
  MaxPoint: number;
  CollectiblePoints: Array<{
    PointName: string;
    Point: number;
    MaxPoint: number;
  }>;
}

export interface CharacterData {
  profile: CharacterProfile;
  equipment: CharacterEquipment[];
  engravings: CharacterEngraving[];
  gems: CharacterGem[];
  cards: CharacterCard[];
  skills: CharacterSkill[];
  collectibles: CharacterCollectible[];
}

// API 호출 함수들
export async function fetchCharacterProfile(characterName: string): Promise<CharacterProfile | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/profiles`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 프로필 조회 실패:', error);
    return null;
  }
}

export async function fetchCharacterEquipment(characterName: string): Promise<CharacterEquipment[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/equipment`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 장비 조회 실패:', error);
    return null;
  }
}

export async function fetchCharacterEngravings(characterName: string): Promise<CharacterEngraving[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/engravings`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 각인 조회 실패:', error);
    return null;
  }
}

export async function fetchCharacterGems(characterName: string): Promise<CharacterGem[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/gems`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 보석 조회 실패:', error);
    return null;
  }
}

export async function fetchCharacterCards(characterName: string): Promise<CharacterCard[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/cards`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 카드 조회 실패:', error);
    return null;
  }
}

export async function fetchCharacterSkills(characterName: string): Promise<CharacterSkill[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/skills`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 스킬 조회 실패:', error);
    return null;
  }
}

export async function fetchCharacterCollectibles(characterName: string): Promise<CharacterCollectible[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/armories/characters/${encodeURIComponent(characterName)}/collectibles`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'authorization': `bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('캐릭터 수집품 조회 실패:', error);
    return null;
  }
}

// 모든 캐릭터 데이터를 한번에 가져오는 함수
export async function fetchAllCharacterData(characterName: string): Promise<CharacterData | null> {
  try {
    const [profile, equipment, engravings, gems, cards, skills, collectibles] = await Promise.all([
      fetchCharacterProfile(characterName),
      fetchCharacterEquipment(characterName),
      fetchCharacterEngravings(characterName),
      fetchCharacterGems(characterName),
      fetchCharacterCards(characterName),
      fetchCharacterSkills(characterName),
      fetchCharacterCollectibles(characterName)
    ]);

    if (!profile) {
      return null;
    }

    return {
      profile,
      equipment: equipment || [],
      engravings: engravings || [],
      gems: gems || [],
      cards: cards || [],
      skills: skills || [],
      collectibles: collectibles || []
    };
  } catch (error) {
    console.error('캐릭터 데이터 조회 실패:', error);
    return null;
  }
}

// 캐릭터 검색 함수 (캐릭터명으로 검색)
export async function searchCharacter(characterName: string): Promise<CharacterProfile | null> {
  try {
    const result = await fetchCharacterProfile(characterName);
    return result;
  } catch (error) {
    console.error('캐릭터 검색 오류:', error);
    return null;
  }
}
