
import { useState, type FormEvent } from "react";
import { ShieldCheck, ShoppingBag, CheckCircle2 } from "lucide-react";

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
    "w-full rounded-xl border border-[#E8DED3] bg-[#FBF8F3] px-4 py-3 text-sm text-[#351D1D] outline-none transition placeholder:text-[#A89588] focus:border-[#8B2635] focus:bg-white focus:ring-2 focus:ring-[#8B2635]/10";

  return (
    <section className="min-h-screen w-full bg-[#FBF8F3] px-4 py-12 font-sans text-[#351D1D] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-[#E8DED3] bg-[#F4EEE6] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B2635]">
            Butcher Shop
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#351D1D] sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#927D70]">
            Enter your delivery details to complete your online order.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E8DED3] bg-white shadow-xl shadow-[#351D1D]/5">
          <div className="border-b border-[#E8DED3] bg-[#F4EEE6] px-6 py-7 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2635] text-white shadow-sm">
                  <ShoppingBag size={19} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#351D1D]">
                    Customer Checkout
                  </h2>
                  <p className="mt-0.5 text-xs text-[#927D70]">
                    Delivery Information
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C8B8] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8B2635]">
                <ShieldCheck size={14} />
                Secure Checkout
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7 sm:px-8">
            <input
              type="hidden"
              name="_subject"
              value="New Customer Order - Butcher Shop"
            />

            <section
              aria-labelledby="customer-details-heading"
              className="rounded-2xl border border-[#E8DED3] bg-[#FBF8F3]/70 p-5 sm:p-6"
            >
              <div className="mb-5">
                <h3
                  id="customer-details-heading"
                  className="text-lg font-bold text-[#351D1D]"
                >
                  Customer Details
                </h3>

                <p className="mt-1 text-xs text-[#927D70]">
                  Please provide your accurate contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="mb-2 block text-xs font-semibold text-[#6D5B52]"
                  >
                    Full Name <span className="text-[#8B2635]">*</span>
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
                    className="mb-2 block text-xs font-semibold text-[#6D5B52]"
                  >
                    Email Address <span className="text-[#8B2635]">*</span>
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
                    className="mb-2 block text-xs font-semibold text-[#6D5B52]"
                  >
                    Phone Number <span className="text-[#8B2635]">*</span>
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
                    className="mb-2 block text-xs font-semibold text-[#6D5B52]"
                  >
                    Delivery Address <span className="text-[#8B2635]">*</span>
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

            <section
              aria-labelledby="message-heading"
              className="rounded-2xl border border-[#E8DED3] bg-[#FBF8F3]/70 p-5 sm:p-6"
            >
              <div className="mb-5">
                <h3
                  id="message-heading"
                  className="text-lg font-bold text-[#351D1D]"
                >
                  Order Notes / Message
                </h3>

                <p className="mt-1 text-xs text-[#927D70]">
                  Include any special delivery requests or instructions.
                </p>
              </div>

              <label
                htmlFor="customer-message"
                className="mb-2 block text-xs font-semibold text-[#6D5B52]"
              >
                Message <span className="text-[#8B2635]">*</span>
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
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700"
              >
                <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                <p>
                  Order submitted successfully! Your details have been received.
                </p>
              </div>
            )}

            {status === "error" && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-700"
              >
                Sorry, your submission could not be sent. Please check your
                connection and try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B2635] px-5 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#8B2635]/20 transition hover:bg-[#6F1E2B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={16} />
              {isSending ? "Submitting Order..." : "Confirm & Submit Order"}
              {!isSending && <span aria-hidden="true">→</span>}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#A89588]">
              <ShieldCheck size={13} />
              Your details and order notes are processed securely.
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-[#927D70]">
          Butcher Shop — Quality You Can Taste.
        </p>
      </div>
    </section>
  );
}
