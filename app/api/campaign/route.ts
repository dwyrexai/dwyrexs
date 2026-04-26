import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { subject, message, adminKey } = await req.json();

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email');

    if (error) throw error;
    if (!subscribers?.length) {
      return NextResponse.json({ error: 'Abone bulunamadı' }, { status: 404 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) throw new Error('RESEND_API_KEY eksik');

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'DWYREX <onboarding@resend.dev>',
          to: sub.email,
          subject,
          html: `
            <div style="background:#050508;padding:40px;font-family:Georgia,serif;color:#fff;max-width:600px;margin:0 auto;">
              <div style="text-align:center;margin-bottom:32px;">
                <h1 style="color:#d4af37;letter-spacing:8px;font-size:28px;">DWYREX</h1>
                <p style="color:#555;font-size:10px;letter-spacing:4px;">THE KING OF COMPUTE</p>
              </div>
              <div style="background:#0a0a10;border:1px solid rgba(212,175,55,0.15);border-radius:16px;padding:32px;">
                ${message}
              </div>
              <div style="text-align:center;margin-top:32px;">
                <a href="https://dwyrex.vercel.app" style="background:linear-gradient(135deg,#d4af37,#b8860b);color:#050508;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:14px;text-decoration:none;letter-spacing:2px;">
                  SİTEYİ ZİYARET ET
                </a>
              </div>
              <p style="text-align:center;color:#333;font-size:11px;margin-top:24px;">
                Bu emaili almak istemiyorsanız <a href="https://dwyrex.vercel.app" style="color:#555;">buradan</a> çıkabilirsiniz.
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) sent++;
      else failed++;
    }

    return NextResponse.json({
      success: true,
      total: subscribers.length,
      sent,
      failed,
    });

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}