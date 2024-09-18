import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RunningPage from '@/app/running/page';

interface RunningDialogueProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RunningDialogue: React.FC<RunningDialogueProps> = ({ children, isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="py-5">
            <RunningPage />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RunningDialogue;