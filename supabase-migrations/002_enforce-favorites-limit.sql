-- 즐겨찾기 최대 개수 제한 (6개) 트리거 함수
CREATE OR REPLACE FUNCTION check_favorites_limit()
RETURNS TRIGGER AS $$
DECLARE
  favorites_count INTEGER;
BEGIN
  -- 현재 사용자의 즐겨찾기 개수 확인
  SELECT COUNT(*) INTO favorites_count
  FROM favorites
  WHERE user_id = NEW.user_id;
  
  -- 6개 이상이면 에러 발생
  IF favorites_count >= 6 THEN
    RAISE EXCEPTION '즐겨찾기는 최대 6개까지 추가할 수 있습니다. (현재: %)', favorites_count;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- INSERT 전에 트리거 실행
CREATE TRIGGER enforce_favorites_limit
  BEFORE INSERT ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION check_favorites_limit();
