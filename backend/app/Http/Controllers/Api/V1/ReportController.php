<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReportController extends Controller
{
    public function __construct(
        protected ReportService $reportService
    ) {}

    /**
     * Relatório financeiro detalhado por categorias e totais no período.
     */
    public function analytics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $now = Carbon::now();
        $startDate = is_string($request->input('start_date'))
            ? $request->input('start_date')
            : $now->copy()->startOfMonth()->format('Y-m-d');
        $endDate = is_string($request->input('end_date'))
            ? $request->input('end_date')
            : $now->copy()->endOfMonth()->format('Y-m-d');

        $report = $this->reportService->getAnalyticsReport($user, $startDate, $endDate);

        return response()->json(['data' => $report]);
    }

    /**
     * Exportação do extrato em formato CSV.
     */
    public function exportCsv(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $now = Carbon::now();
        $startDate = is_string($request->input('start_date'))
            ? $request->input('start_date')
            : $now->copy()->startOfMonth()->format('Y-m-d');
        $endDate = is_string($request->input('end_date'))
            ? $request->input('end_date')
            : $now->copy()->endOfMonth()->format('Y-m-d');

        $csv = $this->reportService->generateCsv($user, $startDate, $endDate);
        $filename = 'extrato-financehub-'.date('Ymd-His').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Exportação do extrato consolidado em formato PDF.
     */
    public function exportPdf(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $now = Carbon::now();
        $startDate = is_string($request->input('start_date'))
            ? $request->input('start_date')
            : $now->copy()->startOfMonth()->format('Y-m-d');
        $endDate = is_string($request->input('end_date'))
            ? $request->input('end_date')
            : $now->copy()->endOfMonth()->format('Y-m-d');

        $pdf = $this->reportService->generatePdf($user, $startDate, $endDate);
        $filename = 'relatorio-financehub-'.date('Ymd-His').'.pdf';

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
