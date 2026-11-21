'use client';

import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { useConfirmRequestStore } from './confirmRequestStore';

/**
 * Renders the dialog requested through `requestConfirm()`. Mount it once in the
 * app shell so stores can ask for confirmation without rendering React.
 */
export const ConfirmDialogHost: React.FC = () => {
  const request = useConfirmRequestStore(state => state.request);
  const settle = useConfirmRequestStore(state => state.settle);

  if (!request) return null;

  return (
    <ConfirmDialog
      isOpen
      title={request.title}
      description={request.description}
      confirmLabel={request.confirmLabel}
      cancelLabel={request.cancelLabel}
      tone={request.tone}
      icon={request.icon}
      requireTypedConfirmation={request.requireTypedConfirmation}
      alternativeAction={request.alternativeAction
        ? { label: request.alternativeAction.label, onClick: () => settle('alternative') }
        : undefined}
      onCancel={() => settle('cancel')}
      onConfirm={() => settle('confirm')}
    />
  );
};
