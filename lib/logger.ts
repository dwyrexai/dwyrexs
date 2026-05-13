import { createClient } from '@supabase/supabase-js';

interface LogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  admin_email?: string;
  ip_address?: string;
  details?: Record<string, unknown>;
}

export async function auditLog(entry: LogEntry) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await supabase.from('audit_logs').insert(entry);
  } catch (err) {
    console.error('[AuditLog Error]', err);
  }
}

export async function trackError(error: unknown, context: string, req?: Request) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[${context}]`, message);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await supabase.from('audit_logs').insert({
      action: 'ERROR',
      table_name: context,
      details: {
        message,
        stack,
        url: req?.url,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (logErr) {
    console.error('[Logger Error]', logErr);
  }
}

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests = 10,
  windowMinutes = 1
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const { data } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart)
      .single();

    if (!data) {
      await supabase.from('rate_limits').insert({ ip_address: ip, endpoint });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (data.request_count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    await supabase
      .from('rate_limits')
      .update({ request_count: data.request_count + 1 })
      .eq('id', data.id);

    return { allowed: true, remaining: maxRequests - data.request_count - 1 };
  } catch {
    return { allowed: true, remaining: maxRequests };
  }
}