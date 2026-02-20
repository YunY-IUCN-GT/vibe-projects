# 배포 계획서

## 현재 상태
- **프레임워크:** Next.js 16.1.6 + React 19
- **백엔드:** Supabase (인증 + DB)
- **GitHub:** https://github.com/YunY-IUCN-GT/vibe-projects.git
- **빌드:** `npm run build` 정상 통과

---

## 배포 전 필수 작업

### 1. 환경변수 분리 (보안 필수) ✅ 완료
Supabase 키를 소스코드에서 환경변수로 분리 완료.

**변경된 파일:**
- `.env.local` — 실제 키 값 저장 (`.gitignore`에 의해 커밋 안 됨)
- `.env.example` — 필요한 환경변수 템플릿 (커밋 가능, 키 값 없음)
- `src/lib/supabase.ts` — `process.env.NEXT_PUBLIC_*`로 변경 완료

```typescript
// src/lib/supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

### 2. Supabase Anon Key 재생성 (추천)
이미 커밋된 키가 git 히스토리에 남아 있으므로 프로덕션 배포 전 Supabase에서 키를 재생성해야 함.

**절차:**
1. Supabase Dashboard → Settings → API
2. anon key 재생성
3. `.env.local`과 배포 플랫폼 환경변수를 새 키로 업데이트

> `git filter-branch`로 히스토리를 정리하는 방법도 있으나, 키 재생성이 훨씬 간단하고 확실함.

### 3. 포트 설정 변경
현재 `package.json`에 포트 3001 하드코딩됨. 배포 플랫폼은 자체 포트를 사용하므로:
```json
{
  "start": "next start"  // 포트 지정 제거 (Vercel은 자동 관리)
}
```

---

## 배포 옵션 비교

### Option A: Vercel (추천)
| 항목 | 내용 |
|---|---|
| 비용 | 무료 (Hobby), $20/월 (Pro) |
| 장점 | Next.js 공식 플랫폼, 자동 배포, CDN, HTTPS, 프리뷰 URL |
| 단점 | 무료 플랜 제약 (대역폭, 빌드 시간) |
| 설정 난이도 | 매우 쉬움 |
| 커스텀 도메인 | 무료 지원 |

**배포 절차:**
1. vercel.com 가입 (GitHub 연동)
2. Import Git Repository → `vibe-projects` 선택
3. Environment Variables 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy 클릭 → 자동 빌드 & 배포
5. `https://프로젝트명.vercel.app` 으로 접속 가능
6. 이후 `git push` 할 때마다 자동 재배포

### Option B: AWS (EC2 + 직접 관리)
| 항목 | 내용 |
|---|---|
| 비용 | t3.micro 무료 (1년), 이후 ~$10/월 |
| 장점 | 완전한 서버 제어, 다른 서비스 연동 유연 |
| 단점 | 직접 관리 (SSL, Nginx, PM2, 업데이트) |
| 설정 난이도 | 중간~높음 |
| 커스텀 도메인 | Route53 또는 외부 DNS |

**배포 절차:**
1. EC2 인스턴스 생성 (Ubuntu, t3.micro)
2. 보안 그룹: 80, 443, 22 포트 오픈
3. Node.js 18+ 설치
4. 프로젝트 클론 → `npm install && npm run build`
5. PM2로 프로세스 관리: `pm2 start npm -- start`
6. Nginx 리버스 프록시 설정 (80 → 3000)
7. Certbot으로 SSL 인증서 발급
8. 수동 배포 또는 GitHub Actions CI/CD 구성

### Option C: GCP (Cloud Run)
| 항목 | 내용 |
|---|---|
| 비용 | 무료 (소규모), 사용량 기반 과금 |
| 장점 | 서버리스 컨테이너, 자동 스케일링 |
| 단점 | Dockerfile 필요, Cold start 지연 |
| 설정 난이도 | 중간 |
| 커스텀 도메인 | Cloud Run 도메인 매핑 |

**배포 절차:**
1. Dockerfile 작성 (Node.js 기반)
2. `gcloud run deploy` 또는 Cloud Build 연동
3. 환경변수 Cloud Run에 설정
4. 자동 HTTPS + 커스텀 도메인 매핑

---

## 추천 전략

```
                    개발/데모용          프로덕션
                    ─────────          ─────────
추천 플랫폼:        Vercel (무료)       Vercel (Pro $20/월)
자동 배포:          ✅ git push         ✅ git push
HTTPS:             ✅ 자동              ✅ 자동
커스텀 도메인:      ✅ 무료              ✅ 무료
CDN:               ✅ 글로벌            ✅ 글로벌
서버 관리:          없음                 없음
```

**결론:** 현재 프로젝트 규모와 기술 스택(Next.js + Supabase)에는 **Vercel**이 가장 적합합니다. AWS/GCP는 서버 관리 오버헤드가 불필요하게 큼.

---

## Supabase 프로덕션 설정

배포 후 Supabase Dashboard에서 추가 설정 필요:

1. **Authentication → URL Configuration:**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/**`

2. **Authentication → Rate Limits:**
   - 프로덕션에 맞게 조정

3. **Database → Backups:**
   - 자동 백업 활성화 (Pro 플랜)

---

## 배포 체크리스트

- [x] 환경변수 분리 (`src/lib/supabase.ts` → `process.env` 사용)
- [x] `.env.local` 생성 (로컬 개발용)
- [x] `.env.example` 생성 (환경변수 템플릿)
- [ ] Supabase anon key 재생성 (git 히스토리 노출 대응)
- [ ] `package.json` start 스크립트 포트 제거
- [ ] Vercel 가입 + GitHub 연동
- [ ] Vercel에 환경변수 설정 (새 키 사용)
- [ ] 배포 후 Supabase URL Configuration 업데이트
- [ ] 커스텀 도메인 연결 (선택)
- [ ] 프로덕션 동작 테스트
