"use client";

import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      className="grid grid-cols-2 gap-3 rounded-[1.25rem] border border-border/80 bg-white/80 p-3 shadow-sm sm:grid-cols-3 lg:flex lg:flex-nowrap lg:items-end lg:gap-2.5 lg:p-4"
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
      <div className="col-span-2 space-y-1.5 sm:col-span-1 lg:min-w-0 lg:flex-1">
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
      <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
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
      <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
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
      <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
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
      <div className="space-y-1.5 lg:min-w-0 lg:flex-1">
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
      <Button
        type="submit"
        className="col-span-2 h-11 w-full shrink-0 px-6 sm:col-span-3 lg:col-span-1 lg:w-auto"
      >
        {t("filters")}
      </Button>
    </form>
  );
}
