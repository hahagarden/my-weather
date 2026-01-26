import 'server-only';

import type { Region } from '../model';
import raw from './regions-full.generated.json';

// JSON import는 기본적으로 unknown 취급이 안전
const regions = raw as Region[];

// ---- 인덱스 (성능) ----
const byId = new Map<number, Region>();

for (const r of regions) {
  byId.set(r.id, r);
}

export const regionRepo = {
  findAll(): Region[] {
    return regions;
  },

  findById(id: number): Region | undefined {
    const region = byId.get(id);
    return region;
  },

  /**
   * 아주 단순 검색: 마지막 토큰 우선 후보군 좁히고,
   * 최종은 regionName/parts 포함으로 필터링
   */
  searchByText(query: string): Region[] {
    const q = query.trim();
    if (!q) return [];

    return regions.filter((r) => r.regionName.includes(q));
  },
};
