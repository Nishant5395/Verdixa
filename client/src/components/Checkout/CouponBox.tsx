import { useEffect, useState } from "react";
import { CheckIcon, Loader2Icon, TicketPercentIcon, XIcon } from "lucide-react";
import api from "../../config/api";
import type { AvailableCoupon } from "../../types";

interface CouponBoxProps {
  appliedCode: string | null;
  discount: number;
  currency: string;
  /** Tries to apply the code. Resolves to an error message, or null when it worked. */
  onApply: (code: string) => Promise<string | null>;
  onRemove: () => void;
}

const describe = (c: AvailableCoupon, currency: string) => {
  const base =
    c.discountType === "PERCENT"
      ? `${c.discountValue}% off${c.maxDiscount ? ` up to ${currency}${c.maxDiscount}` : ""}`
      : `${currency}${c.discountValue} off`;
  const rules = [
    c.minOrderValue > 0 ? `min order ${currency}${c.minOrderValue}` : "",
    c.firstOrderOnly ? "first order only" : "",
  ].filter(Boolean);
  return rules.length ? `${base} · ${rules.join(" · ")}` : base;
};

export default function CouponBox({ appliedCode, discount, currency, onApply, onRemove }: CouponBoxProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [offers, setOffers] = useState<AvailableCoupon[]>([]);

  useEffect(() => {
    api
      .get("/coupons/available")
      .then(({ data }) => setOffers(data.coupons || []))
      .catch(() => setOffers([])); // offers are a bonus, never block checkout
  }, [appliedCode]);

  const apply = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError("");
    const message = await onApply(trimmed);
    setBusy(false);
    if (message) setError(message);
    else setCode("");
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <CheckIcon className="size-4 text-green-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-green-800 truncate">"{appliedCode}" applied</p>
            <p className="text-xs text-green-700">
              You save {currency}
              {discount.toFixed(2)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove coupon"
          className="p-1.5 rounded-full text-green-700 hover:bg-green-100"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-zinc-800">
        <TicketPercentIcon className="size-4 text-app-orange" />
        Have a coupon?
      </div>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply(code);
            }
          }}
          placeholder="Enter code"
          maxLength={30}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-zinc-200 text-sm uppercase tracking-wide outline-none focus:border-green-500"
        />
        <button
          type="button"
          onClick={() => apply(code)}
          disabled={busy || !code.trim()}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold disabled:opacity-40 flex items-center gap-1.5"
        >
          {busy && <Loader2Icon className="size-3.5 animate-spin" />}
          Apply
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {offers.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Available offers</p>
          {offers.slice(0, 3).map((offer) => (
            <button
              key={offer.code}
              type="button"
              onClick={() => apply(offer.code)}
              className="w-full text-left rounded-xl border border-dashed border-app-orange/50 bg-orange-50/60 px-3 py-2 hover:bg-orange-50 transition-colors"
            >
              <span className="text-sm font-bold text-app-orange tracking-wide">{offer.code}</span>
              <span className="block text-xs text-zinc-600">{offer.description || describe(offer, currency)}</span>
              {offer.description && <span className="block text-[11px] text-zinc-400">{describe(offer, currency)}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
