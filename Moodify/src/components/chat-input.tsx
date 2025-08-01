"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  Figma,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  CloudRain,
  Book,
  Dumbbell,
  Car,
  Smile,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      // Temporarily shrink to get the right scrollHeight
      textarea.style.height = `${minHeight}px`;

      // Calculate new height
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export interface VercelV0ChatProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  numTracks: string;
  setNumTracks: (v: string) => void;
  disabled?: boolean;
}

export function VercelV0Chat({
  value,
  onChange,
  onSubmit,
  numTracks,
  setNumTracks,
  disabled = false,
}: VercelV0ChatProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  // Action button suggestions
  const suggestions = [
    {
      icon: <CloudRain className="w-4 h-4" />, // Rainy day
      label: "Make me a playlist for a rainy day",
    },
    {
      icon: <Book className="w-4 h-4" />, // Study/focus
      label: "Give me songs to focus and study",
    },
    {
      icon: <Dumbbell className="w-4 h-4" />, // Workout
      label: "Suggest upbeat tracks for a workout",
    },
    {
      icon: <Car className="w-4 h-4" />, // Night drive
      label: "Chill tracks for a late night drive",
    },
    {
      icon: <Smile className="w-4 h-4" />, // Mood boost
      label: "Songs to boost my mood",
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any as React.FormEvent);
    }
  };

  const handleSuggestionClick = (label: string) => {
    onChange({
      target: { value: label },
    } as any as React.ChangeEvent<HTMLTextAreaElement>);
    adjustHeight();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="w-full">
        <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe your playlist mood, genre, or activity..."
              disabled={disabled}
              className={cn(
                "w-full px-4 py-3",
                "resize-none",
                "bg-transparent",
                "border-none",
                "text-white text-sm",
                "focus:outline-none",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-neutral-500 placeholder:text-sm",
                "min-h-[60px]",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                overflow: "hidden",
              }}
            />
          </div>

          <div className="flex items-center justify-between p-3">
            <div className="flex items-center justify-between gap-2 w-full">
              <Select
                value={numTracks}
                onValueChange={setNumTracks}
                disabled={disabled}
              >
                <SelectTrigger className="w-[120px] flex items-center bg-neutral-900 hover:bg-neutral-800 border border-neutral-900 text-neutral-400 hover:text-white transition-colors rounded-xl px-3 py-2">
                  <SelectValue placeholder="# of Tracks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Tracks</SelectItem>
                  <SelectItem value="20">20 Tracks</SelectItem>
                  <SelectItem value="30">30 Tracks</SelectItem>
                  <SelectItem value="40">40 Tracks</SelectItem>
                  <SelectItem value="50">50 Tracks</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                variant={value.trim() ? "default" : "outline"}
                disabled={!value.trim() || disabled}
              >
                <ArrowUpIcon
                  className={cn(
                    "w-4 h-4",
                    value.trim() ? "text-black" : "text-zinc-400"
                  )}
                />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestion buttons in two rows, 3 max per row */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center justify-center gap-3">
            {suggestions.slice(0, 3).map((s) => (
              <ActionButton
                key={s.label}
                icon={s.icon}
                label={s.label}
                onClick={
                  disabled ? undefined : () => handleSuggestionClick(s.label)
                }
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            {suggestions.slice(3).map((s) => (
              <ActionButton
                key={s.label}
                icon={s.icon}
                label={s.label}
                onClick={
                  disabled ? undefined : () => handleSuggestionClick(s.label)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={!onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}
