import { ChecklistStatus } from '@/types/checklist';

export const getStatusEmoji = (status: ChecklistStatus | null): string => {
  if (status === null) return '❓';
  switch (status) {
    case 'ok':
      return '✅';
    case 'regular':
      return '⚠️';
    case 'ruim':
      return '❌';
    default:
      return '❓';
  }
};

export const getStatusColor = (status: ChecklistStatus | null): string => {
  if (status === null) return '#999999';
  switch (status) {
    case 'ok':
      return '#10b981';
    case 'regular':
      return '#f59e0b';
    case 'ruim':
      return '#ef4444';
    default:
      return '#999999';
  }
};
