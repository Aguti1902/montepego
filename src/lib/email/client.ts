import { Resend } from "resend";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  const from =
    process.env.EMAIL_FROM ?? "MontePego Life <noreply@montepegolife.com>";

  if (!resend) {
    console.info("[email:mock]", input.to, input.subject);
    return { id: "mock-email", mocked: true as const };
  }

  const result = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  return { id: result.data?.id ?? "unknown", mocked: false as const };
}
