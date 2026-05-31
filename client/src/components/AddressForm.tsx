// import { XIcon } from "lucide-react";


// const AddressForm = ({resetForm,handleSubmit,form,setForm,editingId}:any) => {
//   return (
//     <>
//       {/* Overlay */}
//       <div  className="fixed inset-0 bg-black/40 z-50">
//       {/* form container */}
//       <div onClick={resetForm} className="fixed inset-0 z-50 flex-center p-4">
//         <form onClick={e=>e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in">

//           {/* form header */}
//           <div className="flex items-center justify-between mb-5">
//             <h2 className="text-lg font-semibold text-app-green">
//               {editingId ? "Edit Address" : "Add New Address"}
//             </h2>
//             <button type="button" onClick={resetForm} className="p-2 hover:bg-app-cream rounded-lg">
//               <XIcon className="size-5"/>
//             </button>
//           </div>
//           {/* form input fields */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-app-green mb-1.5">Label</label>
//               <input type="text" placeholder="Home,work,etc." required className="w-full px-4 p-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.label} onChange={(e)=>setForm({...form,label:e.target})}/>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-app-green mb-1.5">Street Address</label>
//               <input type="text"  required className="w-full px-4 p-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//               <label className="block text-sm font-medium text-app-green mb-1.5">City</label>
//               <input type="text"  required className="w-full px-4 p-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})}/>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-app-green mb-1.5">State</label>
//               <input type="text"  required className="w-full px-4 p-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.state} onChange={(e)=>setForm({...form,state:e.target.value})}/>
//             </div>
//             </div>
//            <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-app-green mb-1.5">ZIP Code</label>
//               <input type="text"  required className="w-full px-4 p-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.zip} onChange={(e)=>setForm({...form,zip:e.target.value})}/>
//             </div>
//             <div className="flex items-end pb-1">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input type="checkbox" checked={form.isDefault} onChange={(e)=>setForm({...form,isDefault:e.target.checked})}/>
//                 <span className="text-sm text-app-text">Set as default</span></label>
              
//             </div>
            
//             </div>
//           </div>

//           {/* submit button */}
//           <button type="submit" className="mt-6 w-full py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors">{editingId ? "Update Address" : "Save Address"}</button>


//         </form>
//       </div>
//       </div>
//     </>
//   )
// }

// export default AddressForm

import { XIcon, MapPinIcon } from "lucide-react";

interface AddressFormProps {
  resetForm: () => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;
  form: any;
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;
  editingId: string | null;
}

const AddressForm = ({
  resetForm,
  handleSubmit,
  form,
  setForm,
  editingId,
}: AddressFormProps) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        onClick={resetForm}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative h-full overflow-y-auto flex items-center justify-center p-4">
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white rounded-[30px] shadow-2xl border border-zinc-200 animate-fade-in overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-app-green/10 flex items-center justify-center">
                <MapPinIcon className="size-5 text-app-green" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  {editingId
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="text-sm text-zinc-500">
                  Save delivery details securely
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="size-10 rounded-xl hover:bg-zinc-100 flex items-center justify-center transition-colors"
            >
              <XIcon className="size-5 text-zinc-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Address Label
              </label>

              <input
                type="text"
                placeholder="Home, Work, Apartment"
                required
                value={form.label}
                onChange={(e) =>
                  setForm({
                    ...form,
                    label: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-app-green outline-none transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Street Address
              </label>

              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
                placeholder="Enter your full address"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 resize-none focus:bg-white focus:border-app-green outline-none transition-all"
              />
            </div>

            {/* City + State */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  City
                </label>

                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      city: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-app-green outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  State
                </label>

                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      state: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-app-green outline-none transition-all"
                />
              </div>
            </div>

            {/* ZIP */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                ZIP Code
              </label>

              <input
                type="text"
                required
                value={form.zip}
                onChange={(e) =>
                  setForm({
                    ...form,
                    zip: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-app-green outline-none transition-all"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isDefault: e.target.checked,
                  })
                }
                className="size-4 accent-app-green"
              />

              <span className="text-sm text-zinc-700">
                Set as default delivery address
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-zinc-100 bg-zinc-50 flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-2xl border border-zinc-200 font-medium hover:bg-zinc-100 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-app-green text-white rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-green-500/20"
            >
              {editingId
                ? "Update Address"
                : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;