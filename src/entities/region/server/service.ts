import 'server-only';
import type { Region, RegionSearchItem } from '../model/types';
import { regionRepo } from './repo';

function normalizeQuery(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return '';
  return trimmed;
}

export const regionService = {
  search({ q, limit }: { q: string; limit: number }): RegionSearchItem[] {
    const query = normalizeQuery(q ?? '');
    if (!query) return [];

    const found = regionRepo.searchByText(query);
    return found.map((r) => ({ id: r.id, name: r.regionName })).slice(0, limit);
  },

  getById(id: number): Region {
    const region = regionRepo.findById(id);
    if (!region) throw new Error(`Region not found: ${id}`);
    return region;
  },
};
