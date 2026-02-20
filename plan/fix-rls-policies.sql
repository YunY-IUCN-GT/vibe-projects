-- ============================================
-- RLS 정책 수정 (자기 참조 문제 해결)
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. is_admin() 헬퍼 함수 생성 (SECURITY DEFINER로 RLS 우회)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 기존 정책 삭제
DROP POLICY IF EXISTS "Admin can manage site_content" ON site_content;
DROP POLICY IF EXISTS "Admin can read contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin can update contact_inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON user_profiles;

-- 3. is_admin() 함수를 사용하는 새 정책 생성
CREATE POLICY "Admin can manage site_content"
  ON site_content FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admin can read contact_inquiries"
  ON contact_inquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can update contact_inquiries"
  ON contact_inquiries FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can manage all profiles"
  ON user_profiles FOR ALL
  USING (public.is_admin());
