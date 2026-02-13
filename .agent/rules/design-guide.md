---
trigger: always_on
glob: "{src/app,src/components}/**/*.{ts,tsx,css}"
description: 디자인 시스템 및 UI 개발 가이드라인 (Shadcn UI, Tailwind v4)
---

# 디자인 및 UI 개발 가이드라인

이 프로젝트는 **Shadcn UI**와 **Tailwind CSS v4**를 기반으로 구축되었습니다. 일관성 있는 디자인과 유지보수 가능한 코드베이스를 위해 아래 규칙을 반드시 준수하십시오.

## 1. Shadcn UI 활용 원칙 (Primary UI Library)
모든 기본 UI 컴포넌트(버튼, 입력 필드, 카드, 모달 등)는 **Shadcn UI**를 최우선으로 사용합니다.

### 1.1 컴포넌트 추가: CLI 필수 사용
컴포넌트를 추가할 때는 **반드시 터미널 명령어(CLI)를 사용**해야 합니다. 공식 문서의 코드를 수동으로 복사/붙여넣기 하지 마십시오.
- **명령어**: `npx shadcn@latest add [component-name]`
- **이유**:
    - 필요한 의존성(Radix UI 등) 자동 설치
    - `registry` 기반의 최신 안정 버전 코드 보장
    - `tw-merge`, `clsx` 등 유틸리티 설정 자동 연동
- **예시**:
  ```bash
  # 올바른 예
  npx shadcn@latest add card
  npx shadcn@latest add dialog
  ```

### 1.2 커스터마이징
Shadcn UI는 라이브러리가 아닌 **코드베이스**입니다. `src/components/ui` 내에 생성된 컴포넌트는 프로젝트 디자인 요구사항에 맞춰 자유롭게 수정할 수 있습니다. 단, 핵심 기능(접근성, 키보드 네비게이션)을 해치지 않도록 주의하십시오.

## 2. 스타일링 가이드 (Tailwind CSS v4)

### 2.1 시맨틱 색상 변수 사용 (Theming)
색상 값을 하드코딩하지 말고, `globals.css`에 정의된 **CSS 변수(Semantic Variables)**를 사용하십시오. 이는 다크 모드 지원과 테마 일관성을 위해 필수적입니다.
- **지양 (Anti-pattern)**: `bg-white`, `text-black`, `border-gray-200`
- **권장 (Best Practice)**: `bg-background`, `text-foreground`, `border-border`, `bg-card`

### 2.2 클래스 병합 (cn 유틸리티)
컴포넌트의 `className` props를 처리할 때는 반드시 `src/lib/utils.ts`의 `cn` 함수를 사용하여 스타일 충돌을 방지하고 조건부 스타일을 적용하십시오.
```tsx
import { cn } from "@/lib/utils"

export function MyComponent({ className, ...props }) {
  return (
    <div className={cn("flex items-center p-4 bg-card", className)} {...props}>
      ...
    </div>
  )
}
```

### 2.3 반응형 및 상태 스타일
- Tailwind의 modifier(`hover:`, `focus:`, `sm:`, `dark:`)를 적극 활용하십시오.
- 복잡한 변형(variant)이 필요한 경우 `class-variance-authority (cva)` 사용을 권장합니다.

## 3. 폴더 구조 및 명명 규칙
- **`src/components/ui`**: `shadcn add` 명령어로 설치된 기본 컴포넌트 전용 공간입니다. 임의로 파일을 이동하지 마십시오.
- **`src/components`**: 도메인 특화 컴포넌트나 비즈니스 로직이 포함된 컴포넌트를 위치시킵니다.
    - 예: `src/components/LoginForm.tsx`, `src/components/DashboardLayout.tsx`
- **파일명**: PascalCase를 사용합니다. (예: `Button.tsx`, `PageHeader.tsx`)

## 4. 접근성 (Accessibility)
Shadcn UI(Radix UI 기반)가 제공하는 기본 접근성 기능(ARIA 속성, 포커스 관리)을 제거하지 마십시오. 사용자 경험을 위해 웹 접근성 표준을 준수해야 합니다.
