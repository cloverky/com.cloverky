export type HeaderNavLink = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export type HeaderNavMenu = {
  label: string;
  href: string;
  items: HeaderNavLink[];
};

export const HEADER_NAV_MENUS: HeaderNavMenu[] = [
  {
    label: "기능",
    href: "/#features",
    items: [
      { label: "주요 기능 모아보기", href: "/#features" },
      {
        label: "실시간 재고 관리",
        href: "/features/inventory",
        description: "식재료 재고·유통기한 추적",
      },
      {
        label: "맞춤형 레시피 추천",
        href: "/features/recipes",
        description: "보유 재료로 요리 추천",
      },
      {
        label: "스마트 알림",
        href: "/features/alerts",
        description: "유통기한·재고 부족 알림",
      },
      {
        label: "소비 패턴 분석",
        href: "/features/analytics",
        description: "장보기·소비 한눈에",
      },
      {
        label: "AI가 함께 도와주기",
        href: "/features/agents",
        description: "여러 AI가 맞춰 일하는 방식",
      },
      {
        label: "내 취향 기억하기",
        href: "/features/personalization",
        description: "쓸수록 나에게 맞춰짐",
      },
    ],
  },
  {
    label: "AI 도우미",
    href: "/#agents",
    items: [
      { label: "AI 도우미 소개", href: "/#agents" },
      {
        label: "재고 담당 AI",
        href: "/features/inventory",
        description: "인식·수량·유통기한",
      },
      {
        label: "레시피 담당 AI",
        href: "/features/recipes",
        description: "요리 추천·난이도",
      },
      {
        label: "장보기·소비 담당 AI",
        href: "/features/analytics",
        description: "리포트·장보기 제안",
      },
      {
        label: "알림 담당 AI",
        href: "/features/alerts",
        description: "임박·부족 알림",
      },
      {
        label: "함께 쓰는 예시",
        href: "/features/agents",
        description: "알림부터 레시피까지 한 번에",
      },
    ],
  },
  {
    label: "서비스 구성",
    href: "/#architecture",
    items: [
      { label: "서비스 한눈에 보기", href: "/#architecture" },
      {
        label: "AI 총괄·조율",
        href: "/features/agents",
        description: "질문을 맞는 AI에게 연결",
      },
      {
        label: "접속·보안",
        href: "/#architecture",
        description: "안전하게 서비스 이용",
      },
      {
        label: "데이터 저장",
        href: "/#architecture",
        description: "재고·레시피 정보 보관",
      },
      { label: "사용 기술", href: "/#architecture" },
    ],
  },
  {
    label: "문의",
    href: "/#contact",
    items: [
      { label: "문의하기", href: "/#contact" },
      {
        label: "contact@fridgeai.dev",
        href: "mailto:contact@fridgeai.dev",
        description: "이메일 문의",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com",
        description: "소스·이슈",
        external: true,
      },
      {
        label: "Discord",
        href: "#",
        description: "커뮤니티 (준비 중)",
      },
    ],
  },
];
