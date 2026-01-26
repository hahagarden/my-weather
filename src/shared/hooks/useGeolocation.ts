"use client";

import { useEffect, useRef, useState } from "react";

import { GENERAL_ERRORS } from "@/shared/constants";

type GeoState =
  | { status: "idle"; coords: null; error: null }
  | { status: "loading"; coords: null; error: null }
  | { status: "success"; coords: { lat: number; lon: number }; error: null }
  | { status: "error"; coords: null; error: GeolocationPositionError | Error };

type Options = {
  enabled: boolean;
  highAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
};

export function useGeolocation({
  enabled,
  highAccuracy = true,
  timeoutMs = 10_000,
  maximumAgeMs = 0,
}: Options) {
  const [state, setState] = useState<GeoState>({
    status: "idle",
    coords: null,
    error: null,
  });

  // enabled가 true가 된 “최초 1회만” 실행하고 싶을 때 사용
  const didRunRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      // 비활성화되면 초기화(원하면 유지로 바꿔도 됨)
      didRunRef.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "idle", coords: null, error: null });
      return;
    }

    if (didRunRef.current) return;
    didRunRef.current = true;

    if (!("geolocation" in navigator)) {
      setState({
        status: "error",
        coords: null,
        error: new Error(GENERAL_ERRORS.GEOLOCATION_NOT_SUPPORTED),
      });
      return;
    }

    setState({ status: "loading", coords: null, error: null });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "success",
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          error: null,
        });
      },
      (err) => {
        setState({ status: "error", coords: null, error: err });
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: maximumAgeMs,
      },
    );
  }, [enabled, highAccuracy, timeoutMs, maximumAgeMs]);

  return state;
}
