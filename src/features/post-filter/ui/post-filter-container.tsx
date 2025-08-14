import { ChangeEventHandler, useCallback, useEffect } from "react";

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
    loadTags,
  } = usePostFilter();

  const { getPosts, getPostsByTag, searchPosts } = useLoadPost();

  const handleSearchQueryChange: ChangeEventHandler<HTMLInputElement> = (event) => setSearchQuery(event.target.value);

  const handleEnter = useCallback(() => {
    const query = searchQuery?.trim();
    if (query) {
      searchPosts({ query, limit, skip });
    } else {
      getPosts({ limit, skip });
    }
    updateURL();
  }, [searchQuery, limit, skip, getPosts, searchPosts, updateURL]);

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

  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  useEffect(() => {
    void (async () => {
      if (selectedTag) {
        await getPostsByTag(selectedTag);
      } else {
        await getPosts({ limit, skip });
      }
    })();
  }, [selectedTag, limit, skip, sortBy, sortOrder, getPosts, getPostsByTag]);

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
