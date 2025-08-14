import { ChangeEventHandler, useCallback } from "react";

import { PostFilter } from "@entities/post/ui/post-filter";

import { SortBy, SortOrder, usePostSearchParams, useTagsQuery } from "@features/post-filter";

export function PostFilterContainer() {
  const { params, setParams } = usePostSearchParams();
  const searchQuery = params.search ?? "";
  const selectedTag = params.tag ?? "";
  const sortBy = (params.sortBy as SortBy) ?? "id";
  const sortOrder = (params.sortOrder as SortOrder) ?? "asc";
  const { data: tags = [] } = useTagsQuery();

  const handleSearchQueryChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setParams({ search: event.target.value, skip: 0 });

  const handleEnter = useCallback(() => {
    setParams({ search: searchQuery?.trim() || undefined, skip: 0 });
  }, [searchQuery, setParams]);

  const handleChangeTag = useCallback(
    (value: string) => {
      setParams({ tag: value || undefined, skip: 0 });
    },
    [setParams],
  );

  const handleChangeSortBy = useCallback(
    (value: string) => {
      setParams({ sortBy: value as SortBy, skip: 0 });
    },
    [setParams],
  );

  const handleChangeSortOrder = useCallback(
    (value: string) => {
      setParams({ sortOrder: value as SortOrder, skip: 0 });
    },
    [setParams],
  );

  return (
    <PostFilter
      searchQuery={searchQuery}
      onChange={handleSearchQueryChange}
      onEnter={handleEnter}
      tags={tags}
      selectedTag={selectedTag}
      onChangeTag={handleChangeTag}
      sortBy={sortBy}
      onChangeSortBy={handleChangeSortBy}
      sortOrder={sortOrder}
      onChangeSortOrder={handleChangeSortOrder}
    />
  );
}
