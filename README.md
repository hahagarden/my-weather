# My Weather

배포 주소: https://my-weather-red.vercel.app/ (Vercel)

현재 위치 또는 검색한 지역의 날씨를 확인하고, 즐겨찾기 목록으로 관리할 수 있는 웹 앱입니다.  
지역 검색은 한국 행정구역 데이터를 기반으로 빠르게 동작하며, 로그인 시 즐겨찾기 기능이 활성화됩니다.

## 프로젝트 실행 방법

### 1) 설치
```bash
pnpm install
```
설치가 끝나면 `scripts/generate-regions.mjs`가 자동 실행되어 지역 데이터가 생성됩니다.

### 2) 환경 변수 설정
`.env.local` 파일을 생성하고 아래 값을 입력합니다.
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
WEATHER_API_KEY=your_openweather_api_key
```

### 3) Supabase 테이블 구성
Supabase SQL Editor에 `supabase-migrations`의 SQL을 순서대로 실행합니다.
```
supabase-migrations/001_create-favorites-table.sql
supabase-migrations/002_enforce-favorites-limit.sql
```

### 4) 개발 서버 실행
```bash
pnpm dev
```
브라우저에서 `http://localhost:3000` 접속

### (선택) 지역 데이터 수동 생성
```bash
pnpm setup
```

### 5) 프로덕션 빌드/실행
```bash
pnpm build
pnpm start
```
`build` 과정에서 `scripts/generate-regions.mjs`가 실행되어 지역 데이터가 갱신됩니다.

## 구현한 기능

- 현재 위치 기반 날씨 조회 (브라우저 Geolocation 사용)
- 지역 검색 자동완성 (퍼지 검색) 및 지역 상세 날씨 페이지
- 로그인/회원가입 (Supabase Auth)
- 즐겨찾기 추가/삭제/이름 변경
- 즐겨찾기 페이지에서 여러 지역의 날씨 카드 표시
- 즐겨찾기 최대 6개 제한 (클라이언트 + DB 트리거)
- 모바일/데스크탑 반응형 UI 구성
- 다크 모드 토글 및 시스템 테마 연동

## 기술적 의사결정 및 이유

- **지역 데이터 사전 생성 + 서버 메모리 캐시**: 한국 행정구역 CSV를 스크립트로 전처리해 JSON으로 생성하여 런타임 파싱 비용을 줄이고 검색 응답성을 확보했습니다. 지역 JSON이 약 6MB로 커서 클라이언트 정적 로딩 대신 서버에서 처리하고, 서버에서 JSON을 모듈로 로드해 메모리에 유지해 요청마다 재파싱하지 않도록 구성했습니다.
- **Fuse.js + 검색 결과 다양화 점수 로직**: 퍼지 검색은 라이브러리로 1차 수행하되, 사용자 경험을 위해 지나치게 관대한 결과는 제외하고(임계값 조정, 정확한 검색어 포함), 가중치를 적용했습니다. '세종' 검색 시 단순 정렬하면 *세종특별자치시 산하 주소*가 상위를 모두 차지하는 경우가 발생하여 이를 피하고 '서울특별시 세종로', '세종대왕면'처럼 다양한 결과가 먼저 보이도록, 검색어가 포함된 part가 **끝 인덱스에 가까울수록** 높은 점수를 부여했습니다.
- **좌표 기반 날씨 조회**: OpenWeather One Call API는 좌표 기반이므로, 지역 ID → 좌표 매핑을 사전에 준비해 호출을 단순화했습니다.
- **서버 서비스 / 클라이언트 API 분리**: 프리패치를 위해 서버 컴포넌트에서 `service` 계층을 직접 호출하고, 클라이언트에서는 HTTP/SDK API로 통신하도록 분리해 실행 환경과 책임을 명확히 했습니다.
- **Tanstack Query + SSR Hydration**: 즐겨찾기/지역 상세 페이지에서 서버 프리패치 후 하이드레이션하여 초기 렌더 UX와 캐시 활용도를 높였습니다.
- **Promise.all로 병렬 프리패치**: 즐겨찾기가 많을 때 지역/날씨 조회 요청이 누적되므로, 서버에서 병렬로 프리패치해 응답 시간을 줄였습니다.
- **즐겨찾기 저장 방식 결정**: 브라우저별 로컬 저장과 유저별 저장을 비교한 뒤, 기기 간 동기화/로그인 경험을 고려해 DB 저장을 선택했습니다. Auth와 DB 연동이 편리한 Supabase를 사용했고, Firebase보다 관계형 스키마에 적합하다는 점도 고려했습니다.
- **Supabase RLS + 트리거**: 사용자별 데이터 접근을 RLS로 제한하고, 즐겨찾기 최대 개수는 DB 트리거로 2중 방어했습니다.
- **기능 분리 구조(FSD)**: `app / views / widgets / features / entities / shared`로 나누고, 역할별 폴더 분리로 의존 방향을 단순화하고 변경 범위를 줄였습니다. Next.js 프리렌더링을 피하기 위해 pages 대신 `views`를 사용했습니다. 

## 사용한 기술 스택

- **Framework**: Next.js(App Router), React, TypeScript
- **State/Data**: TanStack Query, Zustand
- **Auth/DB**: Supabase(Auth + Postgres)
- **UI**: Tailwind CSS, Lucide Icons, Sonner(Toast)
- **Search**: Fuse.js
- **Weather API**: OpenWeather One Call 3.0

## 특이사항

- **지역 데이터**: 공공데이터포털에서 법정동코드와 시도/시군구/읍면동 법정구역경계 파일(.shp)을 이용했습니다.
- **디자인**: Google AI Studio로 UI 컨셉과 컴포넌트 구성을 참고했습니다.
- **Auth**: Supabase 무료플랜으로 1시간에 2개의 계정까지 회원가입 이메일 인증 가능합니다. 
- **Weather API**: OpenWeather 무료플랜으로 하루에 1000번까지 호출 가능합니다.

<details>
<summary> 2026. 01. 27. 수정</summary>
<div markdown="1">
  
- 회원가입 후 로그인 모달 상태 초기화
- 즐겨찾기 createdAt 내림차순으로 정렬
- `/`페이지 초기 진입 시 깜빡임 수정
- css 수정(모달 autoFocus, 다크모드)
- UI 개선(온도 정수 표현, 즐겨찾기 별칭 수정 placeholder)

</div>
</details>
