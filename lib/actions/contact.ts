"use server";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

/**
 * Handles contact form submissions. Currently a stub — wire this up to an
 * email service or CRM/API once the backend integration is ready.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  // TODO: send to email provider / CRM / API once backend is wired up.
  console.log("New contact form submission:", { name, email, phone, message });

  return { status: "success", message: "Thanks! We'll be in touch shortly." };
}
