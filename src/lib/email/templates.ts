export function leadConfirmationEmail(name: string) {
  return {
    subject: "We received your message — MontePego Life",
    html: `<p>Hello ${escapeHtml(name)},</p>
<p>Thanks for contacting MontePego Life. Our team will reply shortly.</p>
<p>MontePego Life<br/>Edificio Rosario, Monte Pego</p>`,
  };
}

export function propertyAlertEmail(input: {
  name: string;
  title: string;
  reference: string;
  url: string;
  priceLabel: string;
}) {
  return {
    subject: `New match: ${input.title}`,
    html: `<p>Hello ${escapeHtml(input.name)},</p>
<p>A new home matches your preferences:</p>
<p><strong>${escapeHtml(input.title)}</strong> (Ref. ${escapeHtml(input.reference)}) — ${escapeHtml(input.priceLabel)}</p>
<p><a href="${escapeHtml(input.url)}">View the home</a></p>`,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
