"use client";

import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fieldClass =
  "min-w-[7.5rem] flex-1 space-y-1.5 sm:min-w-[8.5rem] lg:min-w-0";

const controlClass = "h-11 w-full min-w-0";

export function PropertyFilters() {
  const t = useTranslations("Properties");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    params.delete("page");
    const query = params.toString();
    router.push((query ? `${pathname}?${query}` : pathname) as "/" | "/properties");
  }

  return (
    <form
      className="flex flex-wrap items-end gap-3 rounded-[1.25rem] border border-border/80 bg-white/80 p-3 shadow-sm md:flex-nowrap md:gap-2.5 md:p-4 lg:gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          if (String(value)) params.set(key, String(value));
        }
        const query = params.toString();
        router.push((query ? `${pathname}?${query}` : pathname) as "/" | "/properties");
      }}
    >
      <div className={fieldClass}>
        <Label htmlFor="type" className="text-xs text-muted-foreground">
          {t("type")}
        </Label>
        <Select
          id="type"
          name="type"
          className={controlClass}
          defaultValue={searchParams.get("type") ?? ""}
          onChange={(e) => update("type", e.target.value)}
        >
          <option value="">—</option>
          <option value="villa">Villa</option>
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
          <option value="plot">Plot</option>
        </Select>
      </div>
      <div className={fieldClass}>
        <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
          {t("price")} min
        </Label>
        <Input
          id="minPrice"
          name="minPrice"
          type="number"
          className={controlClass}
          defaultValue={searchParams.get("minPrice") ?? ""}
        />
      </div>
      <div className={fieldClass}>
        <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
          {t("price")} max
        </Label>
        <Input
          id="maxPrice"
          name="maxPrice"
          type="number"
          className={controlClass}
          defaultValue={searchParams.get("maxPrice") ?? ""}
        />
      </div>
      <div className={fieldClass}>
        <Label htmlFor="bedrooms" className="text-xs text-muted-foreground">
          {t("bedrooms")}
        </Label>
        <Select
          id="bedrooms"
          name="bedrooms"
          className={controlClass}
          defaultValue={searchParams.get("bedrooms") ?? ""}
          onChange={(e) => update("bedrooms", e.target.value)}
        >
          <option value="">—</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </Select>
      </div>
      <div className={fieldClass}>
        <Label htmlFor="sort" className="text-xs text-muted-foreground">
          {t("sort")}
        </Label>
        <Select
          id="sort"
          name="sort"
          className={controlClass}
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </Select>
      </div>
      <Button type="submit" className="h-11 shrink-0 px-6 md:ml-1">
        {t("filters")}
      </Button>
    </form>
  );
}
