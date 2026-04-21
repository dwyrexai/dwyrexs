import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    const subjects: Record<string, string> = {
      contact: '📧 Yeni İletişim Formu — DWYREX',
      facility: '🏭 Yeni Tesis Başvurusu — DWYREX',
      gpu_renter: '🖥️ Yeni GPU Kiralama Talebi — DWYREX',
      subscriber: '📮 Yeni Abone — DWYREX',
    };

    const bodies: Record<string, string> = {
      contact: `
        <h2 style="color:#d4af37">Yeni İletişim Formu</h2>
        <p><strong>İsim:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefon:</strong> ${data.phone || '—'}</p>
        <p><strong>Tür:</strong> ${data.type || '—'}</p>
        <p><strong>Mesaj:</strong> ${data.message || '—'}</p>
      `,
      facility: `
        <h2 style="color:#d4af37">Yeni Tesis Başvurusu</h2>
        <p><strong>Sahip:</strong> ${data.owner_name}</p>
        <p><strong>Email:</strong> ${data.owner_email}</p>
        <p><strong>Konum:</strong> ${data.city}, ${data.country}</p>
        <p><strong>GPU Tipi:</strong> ${data.gpu_type || '—'}</p>
        <p><strong>GPU Adet:</strong> ${data.gpu_count}</p>
        <p><strong>Elektrik:</strong> ${data.electricity_cost || '—'}</p>
        <p><strong>Beklenen Kira:</strong> ${data.monthly_rent_expectation || '—'}</p>
        <p><strong>Notlar:</strong> ${data.notes || '—'}</p>
      `,
      gpu_renter: `
        <h2 style="color:#d4af37">Yeni GPU Kiralama Talebi</h2>
        <p><strong>Şirket:</strong> ${data.company_name || '—'}</p>
        <p><strong>Kişi:</strong> ${data.contact_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>GPU İhtiyacı:</strong> ${data.gpu_type_needed || '—'}</p>
        <p><strong>Adet:</strong> ${data.gpu_count_needed}</p>
        <p><strong>Bütçe:</strong> ${data.budget || '—'}</p>
        <p><strong>Süre:</strong> ${data.duration || '—'}</p>
        <p><strong>Kullanım:</strong> ${data.usage_type || '—'}</p>
      `,
      subscriber: `
        <h2 style="color:#d4af37">Yeni Abone</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Kaynak:</strong> ${data.source || '—'}</p>
      `,
    };

    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL || 'hakan167003077@gmail.com';

    if (!resendKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY eksik' }, { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DWYREX <onboarding@resend.dev>',
        to: adminEmail,
        subject: subjects[type] || '📬 Yeni Bildirim — DWYREX',
        html: `
          <div style="background:#050508;padding:32px;font-family:Georgia,serif;color:#fff;border-radius:12px;">
            ${bodies[type] || JSON.stringify(data)}
            <hr style="border-color:#d4af3733;margin:24px 0"/>
            <p style="color:#555;font-size:12px">DWYREX Admin Paneli: https://dwyrex.vercel.app/admin</p>
          </div>
        `,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: result }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}