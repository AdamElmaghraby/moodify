import React from "react";

interface FilePreviewProps {
  file?: File | { name: string; size: number; type: string };
  className?: string;
}

export function FilePreview({ file, className }: FilePreviewProps) {
  if (!file) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 p-2 bg-muted rounded">
        <span className="text-sm truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          {(file.size / 1024).toFixed(2)} KB
        </span>
      </div>
    </div>
  );
}
