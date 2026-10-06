import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';

export function useReports(startDate: string, endDate: string) {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const analyticsQuery = useQuery({
    queryKey: ['reports-analytics', startDate, endDate],
    queryFn: () => reportsService.getAnalytics(startDate, endDate),
  });

  const exportCsv = async () => {
    try {
      setIsExportingCsv(true);
      await reportsService.downloadCsv(startDate, endDate);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const exportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await reportsService.downloadPdf(startDate, endDate);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return {
    report: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    refetch: analyticsQuery.refetch,
    exportCsv,
    exportPdf,
    isExportingCsv,
    isExportingPdf,
  };
}
