// TYPES
export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

// ICONS (type-safe)
const COMMON_ICONS = {
  dashboard: "heroicons-outline:home",
  examCategory: "heroicons-outline:academic-cap",
  questionType: "heroicons-outline:question-mark-circle",
  coupon: "heroicons-outline:ticket",
  exams: "heroicons-outline:clipboard-document-list",
  users: "heroicons-outline:users",
  results: "heroicons-outline:chart-bar",
} as const;

type IconKey = keyof typeof COMMON_ICONS;

// ACTIVE HELPER (safe)
const isActive = (pathname: string, route: string) => {
  return pathname === route || pathname.startsWith(route + "/");
};

// CONFIG (single source of truth 🚀)
const MENU_CONFIG: {
  id: string;
  href: string;
  label: string;
  icon: IconKey;
  submenus?: {
    id?: string;
    href: string;
    label: string;
    icon: IconKey;
  }[];
}[] = [
  {
    id: "overview",
    href: "/dashboard",
    label: "overview",
    icon: "dashboard",
  },
  {
    id: "exam-category",
    href: "/exam-category",
    label: "examCategory",
    icon: "examCategory",
  },
  {
    id: "question-type",
    href: "/question-type",
    label: "questionType",
    icon: "questionType",
  },
  {
    id: "coupon",
    href: "/coupon",
    label: "coupon",
    icon: "coupon",
  },
  {
    id: "exams",
    href: "/exams",
    label: "exams",
    icon: "exams",
  },
  {
    id: "users",
    href: "/users",
    label: "users",
    icon: "users",
  },
  {
    id: "results",
    href: "/results",
    label: "results",
    icon: "results",
  },
];

export function buildMenuList(
  pathname: string,
  t: any,
): Group[] {
  return [
    {
      groupLabel: "",
      id: "main",

      menus: MENU_CONFIG.map(
        (menu) => ({
          id: menu.id,

          href: menu.href,

          label: t(menu.label),

          active: isActive(
            pathname,
            menu.href
          ),

          icon:
            COMMON_ICONS[
            menu.icon
            ],

          submenus:
            menu.submenus?.map(
              (sub) => ({
                href: sub.href,

                label: t(
                  sub.label
                ),

                active: isActive(
                  pathname,
                  sub.href
                ),

                icon:
                  COMMON_ICONS[
                  sub.icon
                  ],

                children: [],
              })
            ) || [],
        })
      ),
    },
  ];
}

export const getMenuList =
  buildMenuList;

export const getHorizontalMenuList =
  buildMenuList;

