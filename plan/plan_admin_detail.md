# Admin Dashboard 구현 계획

## Context
현재 Admin 페이지는 기본 stat 카드 3개만 있는 상태. 랜딩페이지 콘텐츠 관리, 사용자 관리, 문의 관리, 대시보드 통계 4개 섹션을 구현해야 함.

## 1. Supabase 테이블 생성 (MCP SQL)
- `site_content` - 랜딩페이지 콘텐츠 (section, content_key, content_value JSONB)
- `contact_inquiries` - 문의 (name, email, subject, message, status)
- `user_profiles` - 유저 프로필 (display_name, role) + auth.users 트리거
- `get_admin_users()` RPC 함수 - auth.users + user_profiles 조인
- RLS 정책 설정

## 2. Admin 레이아웃 + 사이드바
**수정:** `src/components/layout/header.tsx` - admin 경로에서 숨기기
**생성:** `src/app/admin/layout.tsx` - 사이드바 + 인증 가드
**생성:** `src/components/admin/admin-sidebar.tsx` - 좌측 네비게이션

사이드바 메뉴:
- Dashboard (`/admin`)
- Content (`/admin/content`)
- Users (`/admin/users`)
- Inquiries (`/admin/inquiries`)

## 3. Dashboard 통계 (`/admin/page.tsx` 수정)
- 총 사용자 수, 문의 수, 미읽은 문의, 마지막 로그인
- 최근 문의 5개 테이블

## 4. 문의 관리 (`/admin/inquiries/page.tsx` 생성)
- 문의 목록 테이블 (이름, 이메일, 제목, 날짜, 상태 뱃지)
- 상태 필터 (전체/미읽음/읽음/답변완료)
- 상세보기 (Sheet 컴포넌트) + 관리자 메모 + 상태 변경

## 5. Contact 폼 (`src/components/layout/contact.tsx` 생성)
- 랜딩페이지 Contact 섹션을 실제 폼으로 교체
- name, email, subject, message → contact_inquiries INSERT

## 6. 사용자 관리 (`/admin/users/page.tsx` 생성)
- `supabase.rpc('get_admin_users')` 호출
- 유저 테이블 (이름, 이메일, 역할, 가입일)
- 역할 변경 기능

## 7. 콘텐츠 관리 (`/admin/content/page.tsx` 생성)
- 탭 UI: Hero / Features / Testimonials / Pricing
- 각 탭별 편집 폼 → site_content 테이블 upsert
- Hero: 제목, 설명, CTA 텍스트, 이미지 URL
- Features: 6개 카드 편집 (제목, 설명, 아이콘)
- Testimonials: 리뷰 편집 (이름, 직함, 리뷰 내용)
- Pricing: 3개 플랜 편집 (가격, 기능 목록)

## 8. 랜딩페이지 Supabase 연동
- hero.tsx, features.tsx, testimonials.tsx, pricing.tsx에서 site_content 테이블 조회
- 데이터 없으면 기존 하드코딩 기본값 사용

## 구현 순서
1. DB 테이블/RLS/트리거 → 2. 레이아웃+사이드바 → 3. 대시보드 → 4. 문의관리 → 5. Contact 폼 → 6. 사용자관리 → 7. 콘텐츠관리 → 8. 랜딩페이지 연동

## 주요 수정 파일
- `src/app/admin/layout.tsx` (신규)
- `src/app/admin/page.tsx` (수정)
- `src/app/admin/content/page.tsx` (신규)
- `src/app/admin/users/page.tsx` (신규)
- `src/app/admin/inquiries/page.tsx` (신규)
- `src/components/admin/admin-sidebar.tsx` (신규)
- `src/components/layout/header.tsx` (수정 - admin 경로 숨김)
- `src/components/layout/contact.tsx` (신규)
- `src/app/page.tsx` (수정 - Contact 컴포넌트 연결)

## 디자인 규칙
- 배경: `#f6f6f7`, 사이드바: `#1a1a2e`
- 카드: `bg-white rounded-xl border border-slate-200 p-6`
- Lucide 아이콘, shadcn/ui 컴포넌트 활용
- 기존 패턴 유지 (inline style로 primary color 적용)

## 검증
- 각 admin 페이지 라우트 접근 확인
- Supabase 테이블 CRUD 동작 확인
- 랜딩페이지 Contact 폼 → 문의 관리 페이지 연동 확인
