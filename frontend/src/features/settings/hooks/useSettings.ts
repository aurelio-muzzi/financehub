import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import type { ProfileUpdatePayload, PreferencesPayload } from '../types/settings.types';

export const SETTINGS_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => settingsService.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => settingsService.updateProfile(payload),
    onSuccess: updatedUser => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, updatedUser);
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PreferencesPayload) => settingsService.updatePreferences(payload),
    onSuccess: updatedUser => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, updatedUser);
    },
  });
}
