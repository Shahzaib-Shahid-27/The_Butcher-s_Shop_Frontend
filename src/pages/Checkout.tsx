import { useState, type FormEvent } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjygrylp";

export default function Checkout() {
  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Message details
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "">("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = event.currentTarget;

  setIsSending(true);
  setStatus("");

  try {
    const formData = new FormData(form);

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Formspree error:", response.status, errorDetails);
      setStatus("error");
      return;
    }

    // Clear the form only after Formspree accepts the submission.
    form.reset();

    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerAddress("");
    setMessage("");
    setStatus("success");
  } catch (error) {
    console.error("Form submission failed:", error);
    setStatus("error");
  } finally {
    setIsSending(false);
  }
}

  const inputClassName =
    "w-full rounded-xl border border-slate-700 bg-[#070D1C] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0B101B] shadow-2xl shadow-cyan-950/20">
          <div className="border-b border-slate-800 bg-gradient-to-r from-blue-700/20 via-cyan-500/10 to-transparent px-6 py-7 sm:px-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              The Butcher&apos;s Shop
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Contact Us
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Fill in your details and message below. Your customer details will
              be included in the email we receive.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 px-6 py-7 sm:px-8">
            <input
              type="hidden"
              name="_subject"
              value="New Customer Message - The Butcher's Shop"
            />

            {/* Separate customer details section */}
            <section
              aria-labelledby="customer-details-heading"
              className="rounded-2xl border border-slate-800 bg-[#070D1C]/70 p-5 sm:p-6"
            >
              <div className="mb-5">
                <h3
                  id="customer-details-heading"
                  className="text-lg font-bold text-white sm:text-xl"
                >
                  Customer Details
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Please provide your contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Full Name *
                  </label>
                  <input
                    id="customer-name"
                    name="customer_name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Enter your full name"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-email"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Email Address *
                  </label>
                  <input
                    id="customer-email"
                    name="customer_email"
                    type="email"
                    autoComplete="email"
                    required
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-phone"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="customer-phone"
                    name="customer_phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Enter your phone number"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-address"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Delivery Address *
                  </label>
                  <input
                    id="customer-address"
                    name="customer_address"
                    type="text"
                    autoComplete="street-address"
                    required
                    value={customerAddress}
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    placeholder="Enter your full address"
                    className={inputClassName}
                  />
                </div>
              </div>
            </section>

            {/* Message section */}
            <section
              aria-labelledby="message-heading"
              className="rounded-2xl border border-slate-800 bg-[#070D1C]/70 p-5 sm:p-6"
            >
              <div className="mb-5">
                <h3
                  id="message-heading"
                  className="text-lg font-bold text-white sm:text-xl"
                >
                  Your Message
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Tell us how we can help you.
                </p>
              </div>

              <label
                htmlFor="customer-message"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Message *
              </label>
              <textarea
                id="customer-message"
                name="message"
                required
                minLength={5}
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your message here..."
                className={`${inputClassName} resize-y`}
              />
            </section>

            {status === "success" && (
              <p
                role="status"
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              >
                Message sent successfully! Your details and message have been
                submitted.
              </p>
            )}

            {status === "error" && (
              <p
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              >
                Sorry, your message could not be sent. Please check your
                connection and try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#0B101B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send Message"}
              {!isSending && <span aria-hidden="true">→</span>}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              Your details and message will be sent through our secure contact
              form.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
