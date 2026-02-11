import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export function MarkdownRenderer({
  children,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert", className)}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
