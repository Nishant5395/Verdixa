import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { PencilIcon, PlusIcon, TicketPercentIcon, Trash2Icon, XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../config/api";
import Loading from "../../components/Loading";
import type { Coupon } from "../../types";
import { errorMessage } from "../../utils/errorMessage";

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

const emptyForm = {
  code: "",
  description: "",
  discountType: "PERCENT" as "PERCENT" | "FLAT",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  usageLimit: "",
  perUserLimit: "1",
  firstOrderOnly: false,
  startsAt: "",
  expiresAt: "",
  isActive: true,
};
type FormState = typeof emptyForm;

const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const offerText = (c: Coupon) =>
  c.discountType === "PERCENT"
    ? `${c.discountValue}% off${c.maxDiscount ? ` (max ${currency}${c.maxDiscount})` : ""}`
    : `${currency}${c.discountValue} off`;

const statusOf = (c: Coupon) => {
  const now = Date.now();
  if (!c.isActive) return { label: "Inactive", cls: "bg-zinc-100 text-zinc-600" };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < now) return { label: "Expired", cls: "bg-red-50 text-red-600" };
  if (c.startsAt && new Date(c.startsAt).getTime() > now) return { label: "Scheduled", cls: "bg-blue-50 text-blue-600" };
  if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return { label: "Used up", cls: "bg-amber-50 text-amber-700" };
  return { label: "Active", cls: "bg-green-50 text-green-700" };
};

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:border-app-green focus:ring-1 focus:ring-app-green outline-none transition-all bg-white";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Reloads the list (used after every change)
  const fetchCoupons = useCallback(async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.coupons);
    } catch (error) {
      toast.error(errorMessage(error, "Failed to load coupons"));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/coupons")
      .then(({ data }) => {
        if (!cancelled) setCoupons(data.coupons);
      })
      .catch((error) => toast.error(errorMessage(error, "Failed to load coupons")))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description || "",
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderValue: c.minOrderValue ? String(c.minOrderValue) : "",
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : "",
      usageLimit: c.usageLimit ? String(c.usageLimit) : "",
      perUserLimit: String(c.perUserLimit),
      firstOrderOnly: c.firstOrderOnly,
      startsAt: toLocalInput(c.startsAt),
      expiresAt: toLocalInput(c.expiresAt),
      isActive: c.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Empty optional boxes mean "no limit" -> null
      const payload = {
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        maxDiscount: form.discountType === "PERCENT" && form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : 1,
        firstOrderOnly: form.firstOrderOnly,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        isActive: form.isActive,
      };
      if (editing) {
        await api.put(`/coupons/${editing.id}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created");
      }
      setShowForm(false);
      fetchCoupons();
    } catch (error) {
      toast.error(errorMessage(error, "Failed to save coupon"));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: Coupon) => {
    try {
      await api.put(`/coupons/${c.id}`, { isActive: !c.isActive });
      fetchCoupons();
    } catch (error) {
      toast.error(errorMessage(error, "Failed to update coupon"));
    }
  };

  const remove = async (c: Coupon) => {
    if (!window.confirm(`Delete coupon ${c.code}? Past orders keep their discount.`)) return;
    try {
      await api.delete(`/coupons/${c.id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      toast.error(errorMessage(error, "Failed to delete coupon"));
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <TicketPercentIcon className="size-6 text-app-orange" /> Coupons
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Discount codes customers can apply at checkout.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-app-green text-white rounded-xl text-sm font-semibold hover:opacity-90"
        >
          <PlusIcon className="size-4" /> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-zinc-400 border-b border-zinc-100">
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Offer</th>
              <th className="px-5 py-3">Rules</th>
              <th className="px-5 py-3">Used</th>
              <th className="px-5 py-3">Valid until</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => {
              const status = statusOf(c);
              return (
                <tr key={c.id} className="border-b border-zinc-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-bold tracking-wide text-zinc-900">{c.code}</p>
                    {c.description && <p className="text-xs text-zinc-400 max-w-48 truncate">{c.description}</p>}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">{offerText(c)}</td>
                  <td className="px-5 py-3 text-xs text-zinc-500 space-y-0.5">
                    {c.minOrderValue > 0 && <p>Min order {currency}{c.minOrderValue}</p>}
                    {c.firstOrderOnly && <p>First order only</p>}
                    <p>{c.perUserLimit}× per customer</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {c.usedCount}
                    {c.usageLimit !== null ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-zinc-500">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "No expiry"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(c)}
                      title="Click to enable / disable"
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}
                    >
                      {status.label}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} aria-label="Edit" className="p-2 rounded-lg hover:bg-zinc-100">
                        <PencilIcon className="size-4 text-zinc-600" />
                      </button>
                      <button onClick={() => remove(c)} aria-label="Delete" className="p-2 rounded-lg hover:bg-red-50">
                        <Trash2Icon className="size-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-zinc-400">
                  No coupons yet. Create your first one to run an offer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing ? `Edit ${editing.code}` : "New coupon"}</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close" className="p-1 rounded-lg hover:bg-zinc-100">
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Code</label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME10"
                  maxLength={20}
                  className={`${inputCls} uppercase tracking-wide`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as "PERCENT" | "FLAT" })}
                  className={inputCls}
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FLAT">Flat amount ({currency})</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description (shown to customers)</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="10% off your first order"
                maxLength={200}
                className={inputCls}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {form.discountType === "PERCENT" ? "Percent off" : `Amount off (${currency})`}
                </label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={form.discountType === "PERCENT" ? 100 : undefined}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Min order ({currency})</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              {form.discountType === "PERCENT" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Max discount ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="No cap"
                    className={inputCls}
                  />
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Total uses allowed</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="Unlimited"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Uses per customer</label>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.perUserLimit}
                  onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Starts (optional)</label>
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Expires (optional)</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.firstOrderOnly}
                  onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })}
                  className="size-4 accent-green-600"
                />
                First order only
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="size-4 accent-green-600"
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-app-green text-white text-sm font-semibold disabled:opacity-60"
              >
                {saving ? "Saving..." : editing ? "Save changes" : "Create coupon"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
