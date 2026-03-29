import { Resend } from "resend";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "RESEND_API_KEY tanımlı değil" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { name, email, message } = await req.json();

  try {
    await resend.emails.send({
      from: "Dwyrex <onboarding@resend.dev>",
      to: "seninmailin@example.com",
      subject: "Yeni iletişim formu",
      text: `${name} (${email}) yazdı:\n\n${message}`,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Mail gönderilemedi" }, { status: 500 });
  }
}