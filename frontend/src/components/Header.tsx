import React from 'react';
import { Navbar } from './Navbar';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact?: () => void;
  onOpenLab: () => void;
  onTriggerInstall?: () => void;
  canInstall?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenLab,
  onTriggerInstall = () => {},
  canInstall = false,
}) => {
  return (
    <Navbar
      onNavigate={onNavigate}
      onOpenLab={onOpenLab}
      onTriggerInstall={onTriggerInstall}
      canInstall={canInstall}
    />
  );
};
