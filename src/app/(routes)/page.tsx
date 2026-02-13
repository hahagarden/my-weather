import type { Metadata } from "next";

import WeatherPage from "@/views/WeatherPage.client";

export const metadata: Metadata = {
  title: "내 날씨 | 지역별 날씨 한눈에",
  description:
    "전국 지역별 현재 날씨와 예보를 한눈에 확인하세요. 즐겨찾기로 자주 보는 지역을 모아보세요.",
};

export default function Home() {
  return (
    <div>
      <WeatherPage id={null} />
    </div>
  );
}
