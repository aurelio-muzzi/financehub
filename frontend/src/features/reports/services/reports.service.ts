import { apiClient } from '@/lib/api/client';
import type { AnalyticsReport } from '../types/reports.types';

export const reportsService = {
  async getAnalytics(startDate: string, endDate: string): Promise<AnalyticsReport> {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    const response = await apiClient.get<{ data: AnalyticsReport }>(
      `/v1/reports/analytics?${params.toString()}`
    );
    return response.data.data;
  },

  async downloadCsv(startDate: string, endDate: string): Promise<void> {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    const response = await apiClient.get(`/v1/reports/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `extrato-financehub-${startDate}-a-${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async downloadPdf(startDate: string, endDate: string): Promise<void> {
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    const response = await apiClient.get(`/v1/reports/export/pdf?${params.toString()}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-financehub-${startDate}-a-${endDate}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
