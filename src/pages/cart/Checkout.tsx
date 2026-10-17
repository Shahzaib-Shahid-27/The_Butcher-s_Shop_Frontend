import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjygrylp";

export default function Checkout() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

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
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-1 focus:ring-neutral-900";

  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8 bg-white min-h-screen font-sans text-neutral-900">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-100">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-7 sm:px-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                The Butcher&apos;s Shop
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={15} /> Secure Checkout Portal
              </span>
            </div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight sm:text-3xl mt-2">
              Customer Checkout / Inquiry
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Fill in your contact details and order delivery specifications below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7 sm:px-8">
            <input
              type="hidden"
              name="_subject"
              value="New Customer Message - The Butcher's Shop"
            />

            {/* Customer Details Section */}
            <section
              aria-labelledby="customer-details-heading"
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 sm:p-6"
            >
              <div className="mb-4">
                <h3
                  id="customer-details-heading"
                  className="text-base font-bold text-neutral-900"
                >
                  Customer Details
                </h3>
                <p className="text-xs text-neutral-500">
                  Please provide your accurate contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="mb-1.5 block text-xs font-semibold text-neutral-700"
                  >
                    Full Name <span className="text-red-500">*</span>
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
                    className="mb-1.5 block text-xs font-semibold text-neutral-700"
                  >
                    Email Address <span className="text-red-500">*</span>
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
                    className="mb-1.5 block text-xs font-semibold text-neutral-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-phone"
                    name="customer_phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Enter phone number"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-address"
                    className="mb-1.5 block text-xs font-semibold text-neutral-700"
                  >
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-address"
                    name="customer_address"
                    type="text"
                    autoComplete="street-address"
                    required
                    value={customerAddress}
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    placeholder="Enter full address"
                    className={inputClassName}
                  />
                </div>
              </div>
            </section>

            {/* Message Section */}
            <section
              aria-labelledby="message-heading"
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 sm:p-6"
            >
              <div className="mb-4">
                <h3
                  id="message-heading"
                  className="text-base font-bold text-neutral-900"
                >
                  Order Notes / Message
                </h3>
                <p className="text-xs text-neutral-500">
                  Include any special delivery requests or inquiries.
                </p>
              </div>

              <label
                htmlFor="customer-message"
                className="mb-1.5 block text-xs font-semibold text-neutral-700"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="customer-message"
                name="message"
                required
                minLength={5}
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your note here..."
                className={`${inputClassName} resize-y`}
              />
            </section>

            {status === "success" && (
              <p
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700"
              >
                Order submitted successfully! Your details have been received.
              </p>
            )}

            {status === "error" && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
              >
                Sorry, your submission could not be sent. Please check your connection and try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? "Submitting Order..." : "Confirm & Submit Order"}
              {!isSending && <span aria-hidden="true">→</span>}
            </button>

            <p className="text-center text-[11px] text-neutral-400">
              Your details and order notes are processed through our secure portal.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}