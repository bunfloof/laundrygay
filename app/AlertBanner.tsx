import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const AlertBanner: React.FC = () => {
  return (
    <Alert variant="destructive" className="mb-4 px-4 py-2 text-sm">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Typhoon Yagi may cause website instability. We apologize for any inconvenience.
      </AlertDescription>
    </Alert>
  );
};