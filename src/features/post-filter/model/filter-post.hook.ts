import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface PostSearchParams {
  skip: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  tag?: string;
}

export const usePostSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const value: PostSearchParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      skip: Number.parseInt(params.get("skip") || "0") || 0,
      limit: Number.parseInt(params.get("limit") || "10") || 10,
      search: params.get("search") || undefined,
      sortBy: params.get("sortBy") || "id",
      sortOrder: params.get("sortOrder") || "asc",
      tag: params.get("tag") || undefined,
    };
  }, [location.search]);

  const update = useCallback(
    (next: Partial<PostSearchParams>) => {
      const merged: PostSearchParams = { ...value, sortBy: "id", sortOrder: "asc", ...next } as PostSearchParams;
      const current = new URLSearchParams(location.search);
      current.set("skip", String(merged.skip ?? 0));
      current.set("limit", String(merged.limit ?? 10));
      const setOrDelete = (key: string, v?: string) => {
        if (v && v.length) current.set(key, v);
        else current.delete(key);
      };
      setOrDelete("search", merged.search);
      current.set("sortBy", merged.sortBy || "id");
      current.set("sortOrder", merged.sortOrder || "asc");
      setOrDelete("tag", merged.tag);
      navigate({ search: `?${current.toString()}` }, { replace: false });
    },
    [location.search, navigate, value],
  );

  return { params: value, setParams: update } as const;
};
