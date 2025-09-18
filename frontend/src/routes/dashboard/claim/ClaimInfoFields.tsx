// src/components/claim/ClaimInfoFields.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { ClaimInfoFormData } from "@/types/claim";

export default function ClaimInfoFields({
  value,
  onChange,
}: {
  value: ClaimInfoFormData;
  onChange: (next: ClaimInfoFormData) => void;
}) {
  const set = (k: keyof ClaimInfoFormData) => (v: string) =>
    onChange({ ...value, [k]: v });

  // "yyyy-MM-dd" -> Date (UTC 파싱 이슈 피하려고 parse 사용)
  const parsedDate = value.incidentDate
    ? parse(value.incidentDate, "yyyy-MM-dd", new Date())
    : undefined;

  const handleDateSelect = (d?: Date) => {
    // Date -> "yyyy-MM-dd"
    set("incidentDate")(d ? format(d, "yyyy-MM-dd") : "");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>보험 종류</Label>
        <Input
          value={value.claimType}
          onChange={(e) => set("claimType")(e.target.value)}
          placeholder="e.g. Dental emergency"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>사고 일자</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !parsedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {parsedDate && isValid(parsedDate) ? (
                format(parsedDate, "yyyy-MM-dd", { locale: ko })
              ) : (
                <span>날짜 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="start">
            <Calendar
              mode="single"
              locale={ko}
              selected={parsedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2">
        <Label>사고 유형</Label>
        <Input
          value={value.incidentKind}
          onChange={(e) => set("incidentKind")(e.target.value)}
          placeholder="e.g. Delay, illness, damage..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>상세 내용</Label>
        <Textarea
          rows={4}
          value={value.details}
          onChange={(e) => set("details")(e.target.value)}
          placeholder="Please describe what happened."
        />
      </div>
    </div>
  );
}
