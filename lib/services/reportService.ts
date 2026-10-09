import { supabase } from '@/lib/supabaseClient';
import { Report, TimelineEvent } from '@/lib/types';
import { INITIAL_REPORTS } from '@/lib/mockData';

// Helper pemetaan dari snake_case (database PostgreSQL) ke camelCase (TypeScript Frontend)
export function mapSupabaseToReport(row: any, timelineRows: any[] = []): Report {
  const timeline: TimelineEvent[] = (timelineRows || []).map((tl) => ({
    id: tl.id,
    date: new Date(tl.created_at).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: tl.status,
    title: tl.title,
    note: tl.note,
    actor: tl.actor || 'Sistem TRACE',
    evidenceUrl: tl.evidence_url || undefined,
  }));

  return {
    id: row.id,
    trackingCode: row.tracking_code,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    urgency: row.urgency,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    address: row.address,
    district: row.district,
    village: row.village,
    imageUrl: row.image_url,
    resolvedImageUrl: row.resolved_image_url || undefined,
    reporterAlias: row.reporter_alias || 'Warga',
    reporterPhoneMasked: row.reporter_phone_masked || undefined,
    reporterNikMasked: row.reporter_nik_masked || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    upvotes: row.upvotes || 0,
    assignedAgency: row.assigned_agency || undefined,
    adminNote: row.admin_note || undefined,
    timeline,
  };
}

/**
 * Mengambil seluruh laporan dari Supabase secara real-time
 */
export async function getReports(): Promise<Report[]> {
  try {
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (reportsError || !reportsData || reportsData.length === 0) {
      console.warn('Gagal / belum ada data Supabase, menggunakan cadangan lokal:', reportsError?.message);
      return INITIAL_REPORTS;
    }

    // Ambil timeline sekaligus
    const { data: timelineData } = await supabase
      .from('report_timeline')
      .select('*')
      .order('created_at', { ascending: true });

    return reportsData.map((row) => {
      const relatedTimelines = (timelineData || []).filter((tl) => tl.report_id === row.id);
      return mapSupabaseToReport(row, relatedTimelines);
    });
  } catch (err) {
    console.error('Error getReports from Supabase:', err);
    return INITIAL_REPORTS;
  }
}

/**
 * Mengirim laporan baru warga ke Supabase
 */
export async function submitReportToSupabase(newReport: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'timeline'>): Promise<{ success: boolean; data?: Report; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        tracking_code: newReport.trackingCode,
        title: newReport.title,
        description: newReport.description,
        category: newReport.category,
        status: newReport.status || 'pending',
        urgency: newReport.urgency,
        latitude: newReport.latitude,
        longitude: newReport.longitude,
        address: newReport.address,
        district: newReport.district,
        village: newReport.village,
        image_url: newReport.imageUrl,
        reporter_alias: newReport.reporterAlias,
        reporter_phone_masked: newReport.reporterPhoneMasked,
        reporter_nik_masked: newReport.reporterNikMasked,
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Gagal menyimpan laporan' };
    }

    // Buat timeline awal
    const { data: tlData } = await supabase
      .from('report_timeline')
      .insert({
        report_id: data.id,
        status: 'pending',
        title: 'Laporan Diterima Sistem',
        note: 'Laporan masuk dari warga Kota Bengkulu dan siap ditinjau petugas teknis.',
        actor: 'Sistem TRACE',
      })
      .select();

    return {
      success: true,
      data: mapSupabaseToReport(data, tlData || []),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Terjadi kesalahan sistem' };
  }
}

/**
 * Menambahkan dukungan (upvote) untuk laporan tertentu
 */
export async function upvoteReport(reportId: string, citizenId?: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('report_upvotes').insert({
      report_id: reportId,
      citizen_id: citizenId || null,
    });

    if (error) {
      console.warn('Upvote info:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Error upvoting report:', err);
    return false;
  }
}
