-- ============================================
-- Admin Dashboard Supabase Schema
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. site_content 테이블 - 랜딩페이지 콘텐츠 관리
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section, content_key)
);

-- 2. contact_inquiries 테이블 - 문의 관리
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. user_profiles 테이블 - 유저 프로필
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 트리거: 신규 유저 가입 시 user_profiles 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. is_admin() 헬퍼 함수 (SECURITY DEFINER로 RLS 우회)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC 함수: admin에서 유저 목록 조회 (auth.users + user_profiles 조인)
CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  display_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    au.id,
    au.email::TEXT,
    up.display_name,
    COALESCE(up.role, 'user') AS role,
    au.created_at,
    au.last_sign_in_at
  FROM auth.users au
  LEFT JOIN public.user_profiles up ON au.id = up.id
  ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RLS 정책

-- site_content: 누구나 읽기 가능, admin만 수정
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_content"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage site_content"
  ON site_content FOR ALL
  USING (public.is_admin());

-- contact_inquiries: 누구나 INSERT, admin만 SELECT/UPDATE
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact_inquiries"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read contact_inquiries"
  ON contact_inquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can update contact_inquiries"
  ON contact_inquiries FOR UPDATE
  USING (public.is_admin());

-- user_profiles: 본인 읽기 + admin 전체 관리
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage all profiles"
  ON user_profiles FOR ALL
  USING (public.is_admin());
