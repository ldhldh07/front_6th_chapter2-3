import { ChangeEventHandler, useCallback } from "react";

import { PostFilter } from "@/entities/post/ui/post-filter";
import { useLoadPost } from "@/features/post-load/model/post-load.hook";

import { SortBy, SortOrder } from "../model/filter-post.atoms";
import { usePostFilter } from "../model/filter-post.hook";

export function PostFilterContainer() {
  const {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    tags,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    updateURL,
  } = usePostFilter();

  const { getPosts, searchPosts } = useLoadPost();

  const handleSearchQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => setSearchQuery(event.target.value);

  const handleEnter = useCallback(() => {
    const query = searchQuery?.trim();
    if (query) {
      searchPosts({ query, limit, skip });
    } else {
      getPosts({ limit, skip });
    }
  }, [searchQuery, limit, skip, getPosts, searchPosts]);

  const handleChangeTag = useCallback(
    (value: string) => {
      setSelectedTag(value);
      updateURL();
    },
    [setSelectedTag, updateURL],
  );

  const handleChangeSortBy = useCallback(
    (value: string) => {
      setSortBy(value as SortBy);
      updateURL();
    },
    [setSortBy, updateURL],
  );

  const handleChangeSortOrder = useCallback(
    (value: string) => {
      setSortOrder(value as SortOrder);
      updateURL();
    },
    [setSortOrder, updateURL],
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
