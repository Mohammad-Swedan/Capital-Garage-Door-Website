"use server";

export interface QuoteFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

/**
 * Handles "Request Help" / quote submissions from problem, service, and
 * suburb landing pages. Currently a stub — wire this up to an email
 * service/CRM once the backend integration is ready.
 */
export async function submitQuote(
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const problem = formData.get("problem")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim();
  const attachment = formData.get("attachment");
  const urgency = formData.get("urgency")?.toString();
  const preferredContactMethod = formData.get("preferredContactMethod")?.toString();

  if (!name || !phone) {
    return { status: "error", message: "Please fill in your name and phone number." };
  }

  const tracking = {
    landingPage: formData.get("landingPage")?.toString(),
    pageType: formData.get("pageType")?.toString(),
    service: formData.get("service")?.toString(),
    suburb: formData.get("suburb")?.toString(),
    source: formData.get("source")?.toString(),
    medium: formData.get("medium")?.toString(),
    referrer: formData.get("referrer")?.toString(),
    utmSource: formData.get("utmSource")?.toString(),
    utmMedium: formData.get("utmMedium")?.toString(),
    utmCampaign: formData.get("utmCampaign")?.toString(),
    // Google Ads attribution (set by the landing-page lead form).
    campaign: formData.get("campaign")?.toString(),
    adGroup: formData.get("adGroup")?.toString(),
    keyword: formData.get("keyword")?.toString(),
    gclid: formData.get("gclid")?.toString(),
  };

  // TODO: send to email provider / CRM / API once backend is wired up.
  console.log("New quote request:", {
    name,
    phone,
    email,
    problem,
    notes,
    urgency,
    preferredContactMethod,
    attachmentName: attachment instanceof File ? attachment.name : undefined,
    ...tracking,
  });

  return { status: "success", message: "Thanks! We'll be in touch shortly to help with your garage door." };
}
