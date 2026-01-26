import "server-only";

import Fuse, { type IFuseOptions } from "fuse.js";

import { REGION_ERRORS } from "@/shared/constants";

import type { Region, RegionSearchItem } from "../model";
import { regionRepo } from "./repo";

function normalizeQuery(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return "";
  return trimmed;
}

export const regionService = {
  search({ q, limit }: { q: string; limit: number }): RegionSearchItem[] {
    const query = normalizeQuery(q ?? "");
    if (!query) return [];

    const regions = regionRepo.findAll();

    // fuse.js 옵션 설정
    const fuseOptions: IFuseOptions<Region> = {
      keys: [
        {
          name: "regionName",
          weight: 0.3,
        },
        {
          name: "regionParts",
          weight: 0.7,
        },
      ],
      threshold: 0.2, // 유사도 임계값 (0 = 완전 일치, 1 = 모든 것 매칭)
      includeScore: true,
      minMatchCharLength: 1,
      findAllMatches: false,
    };

    const fuse = new Fuse(regions, fuseOptions);
    const results = fuse.search(query);

    const scored: Array<{ id: number; name: string; score: number }> = [];

    for (const result of results) {
      const region = result.item;
      const fuseScore = result.score ?? 1; // fuse.js 점수 (낮을수록 좋음, 0 = 완전 일치)

      // fuse.js 점수를 역변환하여 높을수록 좋게 만들기 (0~1 -> 1000~0)
      const baseScore = (1 - fuseScore) * 1000;

      // 검색어가 regionParts의 어느 위치에 있는지 확인하여 점수 조정
      // 예: "세종" 검색 시 "서울특별시 세종로", "여수시 세종대왕면"도 상위에 표시
      const partsCount = region.regionParts.length;
      let foundPartIndex = -1;

      if (partsCount > 0) {
        for (let i = 0; i < partsCount; i++) {
          const part = region.regionParts[i];

          // 검색어가 정확히 포함되어 있는지 확인
          if (part.includes(query)) {
            foundPartIndex = i;
            break;
          }
        }
      }

      // 검색어가 포함된 part의 위치에 따라 점수 조정
      const lastIndex = partsCount - 1;
      let score: number;
      if (foundPartIndex === lastIndex) {
        // 마지막 part에 있으면 최고 점수
        score = Math.max(baseScore, 1000);
      } else {
        // 끝에서 가까울수록 높은 점수
        // 마지막에서 두 번째: 900, 세 번째: 800 등
        const distanceFromEnd = lastIndex - foundPartIndex;
        const positionBonus = 900 - distanceFromEnd * 100;
        score = Math.max(baseScore, positionBonus);
      }

      scored.push({
        id: region.id,
        name: region.regionName,
        score,
      });
    }

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(({ id, name }) => ({ id, name }));
  },

  getById(id: number): Region {
    const region = regionRepo.findById(id);
    if (!region) throw new Error(REGION_ERRORS.NOT_FOUND(id));
    return region;
  },
};
