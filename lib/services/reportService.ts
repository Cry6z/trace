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
    customCategory: row.custom_category || undefined,
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

// Daftar kode tracking dummy bawaan yang harus diabaikan/dibersihkan dari tampilan
export const DUMMY_TRACKING_CODES = new Set([
  'TRC-2026-0812',
  'TRC-2026-0795',
  'TRC-2026-0780',
  'TRC-2026-0750',
  'TRC-2026-0689',
  'TRC-2026-0640',
  'TRC-2026-0830',
  'TRC-TEST-1327',
  'rep-001',
  'rep-002',
  'rep-003',
  'rep-004',
  'rep-005',
  'rep-006',
  'rep-007',
]);

/**
 * Mengambil seluruh laporan dari Supabase secara real-time (hanya laporan riil)
 */
export async function getReports(): Promise<Report[]> {
  try {
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (reportsError || !reportsData || reportsData.length === 0) {
      return [];
    }

    // Bersihkan dari rekaman dummy bawaan sistem
    const realReportsData = reportsData.filter(
      (row) => !DUMMY_TRACKING_CODES.has(row.tracking_code) && !DUMMY_TRACKING_CODES.has(row.id)
    );

    if (realReportsData.length === 0) {
      return [];
    }

    // Ambil timeline sekaligus
    const { data: timelineData } = await supabase
      .from('report_timeline')
      .select('*')
      .order('created_at', { ascending: true });

    return realReportsData.map((row) => {
      const relatedTimelines = (timelineData || []).filter((tl) => tl.report_id === row.id);
      return mapSupabaseToReport(row, relatedTimelines);
    });
  } catch (err) {
    console.error('Error getReports from Supabase:', err);
    return [];
  }
}

/**
 * Mengirim laporan baru warga ke Supabase
 */
export async function submitReportToSupabase(newReport: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'timeline'>): Promise<{ success: boolean; data?: Report; error?: string }> {
  try {
    const insertPayload: any = {
      tracking_code: newReport.trackingCode,
      title: newReport.title,
      description: newReport.description,
      category: newReport.category,
      custom_category: newReport.customCategory || null,
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
    };

    let { data, error } = await supabase
      .from('reports')
      .insert(insertPayload)
      .select()
      .single();

    // Fallback jika database Supabase belum menjalankan migrasi kolom custom_category atau enum lainnya
    if (error && (error.message.includes('custom_category') || error.message.includes('enum') || error.message.includes('column'))) {
      const fallbackPayload = { ...insertPayload };
      delete fallbackPayload.custom_category;
      if (fallbackPayload.category === 'lainnya') {
        fallbackPayload.category = 'fasilitas';
        if (newReport.customCategory) {
          fallbackPayload.title = `[${newReport.customCategory}] ${fallbackPayload.title}`;
        }
      }
      const retry = await supabase.from('reports').insert(fallbackPayload).select().single();
      data = retry.data;
      error = retry.error;
    }

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

/**
 * Mengambil satu laporan berdasarkan ID atau Tracking Code
 */
export async function getReportById(idOrCode: string): Promise<Report | null> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    const query = supabase.from('reports').select('*');
    const { data, error } = isUuid 
      ? await query.eq('id', idOrCode).maybeSingle() 
      : await query.ilike('tracking_code', idOrCode).maybeSingle();

    if (error || !data || DUMMY_TRACKING_CODES.has(data.tracking_code) || DUMMY_TRACKING_CODES.has(data.id)) {
      return null;
    }

    const { data: timelineData } = await supabase
      .from('report_timeline')
      .select('*')
      .eq('report_id', data.id)
      .order('created_at', { ascending: true });

    return mapSupabaseToReport(data, timelineData || []);
  } catch (err) {
    console.error('Error getReportById:', err);
    return null;
  }
}

/**
 * Memperbarui status penanganan laporan di Supabase & menambahkan riwayat timeline
 */
export async function updateReportStatusInSupabase(
  reportId: string,
  newStatus: string,
  agency?: string,
  note?: string,
  resolvedImageUrl?: string,
  timelineEvent?: { title: string; note: string; actor: string; evidenceUrl?: string }
): Promise<boolean> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId);
    const updatePayload: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (agency) updatePayload.assigned_agency = agency;
    if (note) updatePayload.admin_note = note;
    if (resolvedImageUrl) updatePayload.resolved_image_url = resolvedImageUrl;

    const query = supabase.from('reports').update(updatePayload);
    const { data: updatedReport, error } = isUuid
      ? await query.eq('id', reportId).select().maybeSingle()
      : await query.eq('tracking_code', reportId).select().maybeSingle();

    if (error) {
      console.warn('Update report status warning di Supabase:', error.message);
    }

    if (timelineEvent && updatedReport) {
      await supabase.from('report_timeline').insert({
        report_id: updatedReport.id,
        status: newStatus,
        title: timelineEvent.title,
        note: timelineEvent.note,
        actor: timelineEvent.actor,
        evidence_url: timelineEvent.evidenceUrl || null,
      });
    }

    return true;
  } catch (err) {
    console.error('Error updateReportStatusInSupabase:', err);
    return false;
  }
}
