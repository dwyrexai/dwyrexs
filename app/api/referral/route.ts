import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function generateCode(email: string): string {
  const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { action, referrer_email, referred_email, referral_code } = await req.json();

    if (action === 'create') {
      if (!referrer_email) return NextResponse.json({ error: 'Email zorunlu' }, { status: 400 });
      const code = generateCode(referrer_email);
      const { data, error } = await supabase
        .from('referrals')
        .insert({ referrer_email, referred_email: 'pending', referral_code: code })
        .select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, code: data.referral_code });
    }

    if (action === 'use') {
      if (!referred_email || !referral_code) {
        return NextResponse.json({ error: 'Email ve kod zorunlu' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('referrals')
        .update({ referred_email, status: 'used', commission_usd: 50 })
        .eq('referral_code', referral_code)
        .eq('status', 'pending')
        .select().single();
      if (error || !data) {
        return NextResponse.json({ error: 'Geçersiz veya kullanılmış kod' }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: '$50 komisyon kazandınız!' });
    }

    return NextResponse.json({ error: 'Geçersiz action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}