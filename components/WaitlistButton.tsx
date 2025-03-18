'use client';

import { Button } from '@/components/ui/button';
import RightCaret from '@/components/icons/RightCaret';
import { WaitlistDialog } from '@/components/WaitlistDialog';

interface WaitlistButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  buttonText?: string;
}

export function WaitlistButton({
  size = 'lg',
  variant = 'default',
  className = 'button-with-gradient',
  buttonText = 'Join the Waitlist'
}: WaitlistButtonProps) {
  return (
    <WaitlistDialog
      buttonText={buttonText}
      trigger={
        <Button size={size} variant={variant} className={className}>
          {buttonText} <RightCaret />
        </Button>
      }
    />
  );
}
