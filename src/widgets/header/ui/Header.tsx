import RegionSearch from "@/features/region/search-region/ui/RegionSearch";

export default function Header() {
  return (
    <div className="flex items-center gap-4">
      <h1>My Weather</h1>
      <RegionSearch />
    </div>
  );
}