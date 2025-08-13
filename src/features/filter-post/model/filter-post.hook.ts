// src/features/post-fllter/model/use-post-filter.ts
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  limitAtom,
  searchQueryAtom,
  selectedTagAtom,
  skipAtom,
  SortBy,
  sortByAtom,
  SortOrder,
  sortOrderAtom,
} from "./filter-post.atoms";

export const usePostFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [skip, setSkip] = useAtom(skipAtom);
  const [limit, setLimit] = useAtom(limitAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (skip) params.set("skip", String(skip));
    if (limit) params.set("limit", String(limit));
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    if (selectedTag) params.set("tag", selectedTag);
    navigate(`?${params.toString()}`);
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate]);

  useEffect(() => {
    setSkip(Number.parseInt(queryParams.get("skip") || "0") || 0);
    setLimit(Number.parseInt(queryParams.get("limit") || "10") || 10);
    setSearchQuery(queryParams.get("search") || "");
    setSortBy((queryParams.get("sortBy") as SortBy) || "none");
    setSortOrder((queryParams.get("sortOrder") as SortOrder) || "asc");
    setSelectedTag(queryParams.get("tag") || "");
  }, [location.search, queryParams, setLimit, setSearchQuery, setSelectedTag, setSkip, setSortBy, setSortOrder]);

  return {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,

    setSkip,
    setLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,

    updateURL,
  };
};
