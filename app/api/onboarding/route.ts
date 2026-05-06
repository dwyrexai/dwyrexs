import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function generateToken(email: string): string {
  const base = Buffer.from(email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${base}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { name, email, company, type } = await req.json();

    if (!name || !email || !type) {
      return NextResponse.json({ error: 'name, email ve type zorunlu' }, { status: 400 });
    }

    const token = generateToken(email);

    // Müşteri oluştur veya güncelle
    const { data: customer, error } = await supabase
      .from('customers')
      .upsert({ name, email, company, type, dashboard_token: token, status: 'onboarding' }, { onConflict: 'email' })
      .select().single();

    if (error) throw error;

    // Hoş geldin emaili gönder
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dwyrex.vercel.app'}/dashboard?token=${token}`;

    const isFacility = type === 'facility';
    const emailHtml = `
      <div style="background:#050508;padding:40px;font-family:Georgia,serif;color:#fff;max-width:600px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#d4af37;letter-spacing:8px;font-size:28px;">DWYREX</h1>
          <p style="color:#555;font-size:10px;letter-spacing:4px;">THE KING OF COMPUTE</p>
        </div>
        <div style="background:#0a0a10;border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:32px;margin-bottom:24px;">
          <h2 style="color:#d4af37;font-size:22px;margin-bottom:16px;">Hoş Geldiniz, ${name}! 👑</h2>
          <p style="color:#aaa;line-height:1.8;margin-bottom:20px;">
            ${isFacility
              ? 'GPU tesislerinizi DWYREX ağına bağlamak için başvurunuzu aldık. Ekibimiz 48 saat içinde sizinle iletişime geçecek.'
              : 'GPU kiralama talebinizi aldık. Ekibimiz size en uygun GPU\'ları 24 saat içinde sunacak.'
            }
          </p>
          <div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.15);border-radius:12px;padding:20px;margin-bottom:20px;">
            <h3 style="color:#fff;font-size:15px;margin-bottom:12px;">📋 Sonraki Adımlar:</h3>
            ${isFacility ? `
              <p style="color:#aaa;margin:6px 0;">1. ✅ Başvurunuz alındı</p>
              <p style="color:#aaa;margin:6px 0;">2. ⏳ Ekibimiz GPU tesisi değerlendirmesi yapacak</p>
              <p style="color:#aaa;margin:6px 0;">3. 📞 48 saat içinde WhatsApp/telefon görüşmesi</p>
              <p style="color:#aaa;margin:6px 0;">4. 📝 Sözleşme imzalama</p>
              <p style="color:#aaa;margin:6px 0;">5. 💰 İlk ödeme ve kurulum</p>
            ` : `
              <p style="color:#aaa;margin:6px 0;">1. ✅ Talebiniz alındı</p>
              <p style="color:#aaa;margin:6px 0;">2. ⏳ GPU eşleştirmesi yapılıyor</p>
              <p style="color:#aaa;margin:6px 0;">3. 📞 24 saat içinde teklif sunulacak</p>
              <p style="color:#aaa;margin:6px 0;">4. 📝 Sözleşme ve erişim bilgileri</p>
              <p style="color:#aaa;margin:6px 0;">5. 🚀 GPU erişimi aktif</p>
            `}
          </div>
          <div style="text-align:center;">
            <a href="${dashboardUrl}" style="background:linear-gradient(135deg,#d4af37,#b8860b);color:#050508;padding:16px 32px;border-radius:8px;font-weight:bold;font-size:14px;text-decoration:none;letter-spacing:2px;display:inline-block;">
              DASHBOARDIMA GIT →
            </a>
          </div>
        </div>
        <div style="text-align:center;">
          <p style="color:#555;font-size:12px;">Sorularınız için: <a href="https://wa.me/905458701196" style="color:#d4af37;">WhatsApp: +90 545 870 1196</a></p>
          <p style="color:#333;font-size:10px;margin-top:8px;">DWYREX — THE KING OF COMPUTE</p>
        </div>
      </div>
    `;

    // Resend ile email gönder
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'DWYREX <onboarding@resend.dev>',
          to: email,
          subject: `Hoş Geldiniz DWYREX'e, ${name}! 👑`,
          html: emailHtml,
        }),
      });

      // Admin bildirimi
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'DWYREX <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL || 'hakan167003077@gmail.com',
          subject: `🆕 Yeni Müşteri: ${name} (${type})`,
          html: `<p>Yeni müşteri kaydı: <strong>${name}</strong> — ${email} — ${type}</p><p>Dashboard: ${dashboardUrl}</p>`,
        }),
      });
    }

    return NextResponse.json({ success: true, token, customer });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}