// src/components/claim/ClaimFileField.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ClaimFileField({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>파일 첨부</Label>
        <Input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="cursor-pointer text-sm"
        />
        <p className="text-xs text-muted-foreground">
          pdf, jpeg, jpg, png 형식의 파일 첨부
        </p>
      </div>

      <Separator />

      {file && (
        <div className="flex flex-col gap-2">
          <Label>첨부된 파일</Label>
          <div className="flex items-center justify-between px-3 py-2 rounded-md border text-sm">
            <span className="truncate">{file.name}</span>
            <Button
              size="sm"
              className="pr-1"
              variant="ghost"
              onClick={() => onChange(null)}
            >
              제거
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
