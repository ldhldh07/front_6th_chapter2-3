import { Card } from "@/shared/ui";
import { PostsBodyWidget } from "@/widgets/posts-manager/ui/posts-body-widget";
import { PostsDialogsWidget } from "@/widgets/posts-manager/ui/posts-dialogs-widget";
import { PostsHeaderWidget } from "@/widgets/posts-manager/ui/posts-header-widget";

const PostsManager = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostsHeaderWidget />
      <PostsBodyWidget />
      <PostsDialogsWidget />
    </Card>
  );
};

export default PostsManager;
