"use client";

import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    router.push((query ? `${pathname}?${query}` : pathname) as "/properties");
  }

  return (
    <form
      className="grid gap-4 border border-border bg-card p-4 md:grid-cols-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          if (String(value)) params.set(key, String(value));
        }
        const query = params.toString();
        router.push((query ? `${pathname}?${query}` : pathname) as "/properties");
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="type">{t("type")}</Label>
        <Select
          id="type"
          name="type"
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
      <div className="space-y-1">
        <Label htmlFor="minPrice">{t("price")} min</Label>
        <Input
          id="minPrice"
          name="minPrice"
          type="number"
          defaultValue={searchParams.get("minPrice") ?? ""}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="maxPrice">{t("price")} max</Label>
        <Input
          id="maxPrice"
          name="maxPrice"
          type="number"
          defaultValue={searchParams.get("maxPrice") ?? ""}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="bedrooms">{t("bedrooms")}</Label>
        <Select
          id="bedrooms"
          name="bedrooms"
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
      <div className="space-y-1">
        <Label htmlFor="sort">{t("sort")}</Label>
        <Select
          id="sort"
          name="sort"
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </Select>
      </div>
      <div className="md:col-span-5">
        <Button type="submit">{t("filters")}</Button>
      </div>
    </form>
  );
}
