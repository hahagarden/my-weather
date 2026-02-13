import type { Metadata } from "next";

import WeatherPage from "@/views/WeatherPage.client";

export const metadata: Metadata = {
  title: "현재 위치 날씨",
  description:
    "현재 위치의 날씨를 한눈에 확인하세요. 즐겨찾기로 자주 보는 지역을 모아보세요.",
};

export default function Home() {
  return (
    <div>
      <WeatherPage id={null} />
    </div>
  );
}
