import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import { Button } from "@/shared/ui/button";

export interface PostPaginationProps {
  total: number;
  skip: number;
  limit: number;
  onChangeLimit: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PostPagination({ total, skip, limit, onChangeLimit, onPrev, onNext }: Readonly<PostPaginationProps>) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={String(limit)} onValueChange={(value) => onChangeLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={onPrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
