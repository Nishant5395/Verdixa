// import { CheckIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
// import type { Address } from "../types";

// interface AddressCardProps {
//     addr:Address;
//     onEditHandler:(addr:Address)=>void
//     setAddresses:(addresses:Address[])=>void
// }

// const AddressCard = ({addr,onEditHandler,setAddresses}:AddressCardProps) => {
//     const handleDelete=async(id:string)=>{
//         console.log(id)
//     }
//   return (
//     <div key={addr.id} className='max-w-3xl bg-white rounded-2xl p-6 items-start justify-between'>
//         {/* left */}
//         <div className="flex gap-4">
//             <div className="size-10 rounded-xl bg-app-cream flex-center shrink-0">
//                 <MapPinIcon className="size-5 text-app-green"/>
//             </div>
//             <div>
//                 <div className="flex items-center gap-2 mb-1">
//                     <p className="text-sm font-semibold text-app-green">{addr.label}</p>
//                     {addr.isDefault && (
//                         <span className="flex-center gap-1 px-2.5 py-0.5 text-[10px] font-medium bg-app-green text-white rounded-full">
//                             <CheckIcon className="size-2.5"/>
//                             Default
//                         </span>
//                     )}
//                 </div>
//                 <p> {addr.address},{addr.city},<br/>{addr.state},{addr.zip}</p>
//             </div>




//         </div>
//         <div className="flex items-center gap-1">
//             <button onClick={()=>onEditHandler(addr)}
//                 className="p-2 text-app-text-light hover:text-app-green hover:bg-app-cream rounded-lg transition-colors">
//                     <PencilIcon className="size-4"/>
//                 </button>
//             <button onClick={()=>handleDelete(addr.id)}
//                 className="p-2 text-app-text-light hover:text-app-error hover:bg-red-50 rounded-lg transition-colors">
//                     <Trash2Icon className="size-4"/>
//                 </button>

//         </div>
      
//     </div>
//   )
// }

// export default AddressCard

import {
  CheckIcon,
  MapPinIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import type { Address } from "../types";
import api from "../config/api";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";

interface AddressCardProps {
  addr: Address;
  onEditHandler: (addr: Address) => void;
  setAddresses: React.Dispatch<
    React.SetStateAction<Address[]>
  >;
}

const AddressCard = ({
  addr,
  onEditHandler,setAddresses
}: AddressCardProps) => {
  const {updateUser}=useAuth()
  const handleDelete = async (
    id: string
  ) => {
    try {
      const confirm=window.confirm("Are you sure want to delete this address?");
      if(!confirm)return;
      const {data}=await api.delete(`/addresses/${id}`);
       setAddresses(data.addresses);
       updateUser({addresses:data.addresses})
       toast.success('Address removed')
    } catch (error:any) {
      toast.error(error.response?.data?.message || error?.message);
    }
   
  };

  return (
    <div className="bg-white rounded-[28px] border border-zinc-200 shadow-sm hover:shadow-md transition-all p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        {/* Left */}
        <div className="flex gap-4">
          <div className="size-12 rounded-2xl bg-app-green/10 flex items-center justify-center shrink-0">
            <MapPinIcon className="size-5 text-app-green" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-zinc-900">
                {addr.label}
              </h3>

              {addr.isDefault && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  <CheckIcon className="size-3" />
                  Default
                </span>
              )}
            </div>

            <p className="text-sm leading-7 text-zinc-600">
              {addr.address}
              <br />
              {addr.city}, {addr.state} -{" "}
              {addr.zip}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onEditHandler(addr)
            }
            className="size-11 rounded-xl border border-zinc-200 hover:border-app-green hover:bg-app-green/5 flex items-center justify-center transition-all"
          >
            <PencilIcon className="size-4 text-zinc-700" />
          </button>

          <button
            onClick={() =>
              handleDelete(addr.id)
            }
            className="size-11 rounded-xl border border-zinc-200 hover:border-red-300 hover:bg-red-50 flex items-center justify-center transition-all"
          >
            <Trash2Icon className="size-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;