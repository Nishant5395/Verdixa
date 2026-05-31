// import { ChevronRightIcon, CreditCardIcon } from "lucide-react";
// import type { Dispatch, SetStateAction } from "react";

// interface CheckoutPaymentProps {
//   paymentMethod: string;
//   setPaymentMethod: React.Dispatch<
//     React.SetStateAction<string>
//   >;

//   setStep: React.Dispatch<
//     React.SetStateAction<
//       "address" | "payment" | "review"
//     >
//   >;
// }

// export default function CheckoutPayment({ setStep, paymentMethod, setPaymentMethod }: CheckoutPaymentProps) {
//     return (
//         <div className="bg-white rounded-2xl p-6 animate-fade-in">
//             <h2 className="text-lg font-semibold text-app-green mb-5 flex items-center gap-2">
//                 <CreditCardIcon className="size-5" /> Payment Method
//             </h2>
//             <div className="space-y-3">
//                 {[
//                     { value: "card", label: "Credit / Debit Card", desc: "Pay securely with your card" },
//                     { value: "cash", label: "Cash on Delivery", desc: "Pay when you receive" },
//                 ].map((method) => (
//                     <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.value ? "border-app-green bg-app-cream" : "border-app-border hover:border-app-green-lighter"}`}>
//                         <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={(e) => setPaymentMethod(e.target.value)} className="size-4 text-app-green" />
//                         <div>
//                             <p className="text-sm font-semibold text-app-green">{method.label}</p>
//                             <p className="text-xs text-app-text-light">{method.desc}</p>
//                         </div>
//                     </label>
//                 ))}
//             </div>
//             <button onClick={() => { setStep("review"); scrollTo(0, 0) }} className="mt-6 px-6 py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2">
//                 Review Order <ChevronRightIcon className="size-4" />
//             </button>
//         </div>
//     )
// }

import {
  ChevronRightIcon,
  CreditCardIcon,
  WalletIcon,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type CheckoutStep =
  | "address"
  | "payment"
  | "review";

interface CheckoutPaymentProps {
  paymentMethod: string;

  setPaymentMethod: Dispatch<
    SetStateAction<string>
  >;

  setStep: Dispatch<
    SetStateAction<CheckoutStep>
  >;
}

const paymentMethods = [
  {
    value: "card",
    label: "Credit / Debit Card",
    desc: "Visa, Mastercard, RuPay & more",
    icon: CreditCardIcon,
  },
  {
    value: "cash",
    label: "Cash on Delivery",
    desc: "Pay after receiving your order",
    icon: WalletIcon,
  },
];

export default function CheckoutPayment({
  setStep,
  paymentMethod,
  setPaymentMethod,
}: CheckoutPaymentProps) {
  return (
    <div className="bg-white rounded-3xl border border-app-border p-6 sm:p-7 shadow-sm animate-fade-in">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-app-green flex items-center gap-2">
          <CreditCardIcon className="size-5" />
          Payment Method
        </h2>

        <p className="text-sm text-app-text-light mt-1">
          Choose your preferred payment option
        </p>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;

          return (
            <label
              key={method.value}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                paymentMethod === method.value
                  ? "border-app-green bg-app-cream shadow-sm"
                  : "border-app-border hover:border-app-green/40 hover:bg-zinc-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={
                  paymentMethod === method.value
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="size-4 accent-app-green"
              />

              <div className="size-11 rounded-xl bg-app-cream flex items-center justify-center shrink-0">
                <Icon className="size-5 text-app-green" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-app-green">
                  {method.label}
                </p>

                <p className="text-xs text-app-text-light mt-0.5">
                  {method.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Security Note */}
      <div className="mt-5 rounded-2xl bg-zinc-50 border border-app-border p-4">
        <p className="text-xs text-app-text-light leading-relaxed">
          Your payment information is encrypted and
          processed securely.
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => {
          setStep("review");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        className="mt-6 w-full sm:w-auto px-6 py-3 bg-app-green text-white font-semibold rounded-2xl hover:bg-app-green-light transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        Review Order
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  );
}