'use client';

import React from 'react';
import { Cafe, AppLanguage } from '@/types/database';
import { MenuManagerModal } from '@/components/menu/MenuManagerModal';

interface TenantMenuModalProps {
  cafe: Cafe | null;
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export function TenantMenuModal({
  cafe,
  isOpen,
  onClose,
  lang,
}: TenantMenuModalProps) {
  return (
    <MenuManagerModal
      cafe={cafe}
      isOpen={isOpen}
      onClose={onClose}
      lang={lang}
      isCashier={false}
    />
  );
}
