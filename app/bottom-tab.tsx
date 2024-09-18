'use client'

import React, { useState } from "react"
import Link from "next/link"
import { House, SquarePlay, Settings as SettingsIcon, MoreHorizontal } from 'lucide-react';
import Settings from '@/app/SettingsDialogue';
import { useSettings } from '@/app/SettingsContext';
import RunningDialog from './RunningDialogue';

export function BottomTab() {
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();
  const [isRunningOpen, setIsRunningOpen] = useState(false);
  
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg md:hidden">
        <nav className="flex justify-around h-14 items-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <House className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <RunningDialog isOpen={isRunningOpen} onOpenChange={setIsRunningOpen}>
            <button
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
            >
              <SquarePlay className="w-5 h-5" />
              <span className="text-xs">Running</span>
            </button>
          </RunningDialog>
          <button
            onClick={handleSettingsClick}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
          <Link
            href="/more"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs">More</span>
          </Link>
        </nav>
      </div>
      <Settings />
    </>
  )
}