"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { HeaderNavMenu } from "@/lib/header-nav";
import { cn } from "@/lib/utils";

type HeaderNavDropdownProps = {
  menu: HeaderNavMenu;
};

export function HeaderNavDropdown({ menu }: HeaderNavDropdownProps) {
  return (
    <div className="group relative">
      <Link
        href={menu.href}
        className={cn(
          "inline-flex items-center gap-1 py-1 text-sm text-muted-foreground transition-colors",
          "hover:text-foreground",
          "group-hover:text-foreground",
        )}
      >
        {menu.label}
        <ChevronDown
          className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
          aria-hidden
        />
      </Link>

      {/* 호버 브릿지: 트리거 ↔ 패널 사이 공백에서 메뉴가 닫히지 않게 */}
      <div
        className="absolute left-1/2 top-full z-50 h-3 w-[min(100%,16rem)] -translate-x-1/2"
        aria-hidden
      />

      <div
        className={cn(
          "absolute left-1/2 top-[calc(100%+0.5rem)] z-50 min-w-[15rem] -translate-x-1/2",
          "rounded-xl border border-border bg-popover p-1.5 shadow-lg",
          "origin-top",
          "pointer-events-none opacity-0 -translate-y-2 scale-[0.98]",
          "transition-all duration-200 ease-out",
          "group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100",
        )}
        role="menu"
        aria-label={`${menu.label} 하위 메뉴`}
      >
        <ul className="max-h-[min(70vh,24rem)] overflow-y-auto">
          {menu.items.map((item) => (
            <li key={`${menu.label}-${item.href}-${item.label}`} role="none">
              <Link
                href={item.href}
                role="menuitem"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2.5 transition-colors",
                  "hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-none",
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                {item.description ? (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
