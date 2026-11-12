import React from 'react';
import { Order } from '../types';
import { formatKip } from '../data/initialData';
import { CheckCircle2, Printer, MapPin, Phone, User, Calendar, ExternalLink, X } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-[#062817] border-2 border-emerald-700 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Top Orange Bar (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
        <div className="bg-orange-600 px-5 py-3.5 flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <h2 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
              ສັ່ງຊື້ສຳເລັດແລ້ວ! (Order Placed Successfully)
            </h2>
          </div>
          {/* Red Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow"
            title="ປິດ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 space-y-4 print:p-0 text-slate-100">
          {/* Brand & Order Number Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-emerald-800 gap-2">
            <div>
              <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-xl font-bold text-white">
                ຮ້ານຂາຍອຸປະກອນກິລາແບັດມິນຕັນ (Badminton Pro Laos)
              </h3>
              <p className="text-xs text-emerald-300">ເລກທີໃບບິນອໍເດີ້: <span className="font-mono text-yellow-400 font-bold">{order.id}</span></p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-400">
              <div className="flex items-center gap-1 sm:justify-end">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>{order.createdAt}</span>
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[11px] font-bold">
                ສະຖານະ: ກຳລັງກຽມເຄື່ອງ
              </span>
            </div>
          </div>

          {/* Customer & Location Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#041a0f] p-4 rounded-xl border border-emerald-800">
            <div>
              <span className="text-slate-400 block mb-1">ຂໍ້ມູນຜູ້ຮັບ:</span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{order.customerName}</span>
              </div>
              <div className="text-emerald-300 mt-1 flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{order.phone}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">ສະຖານທີ່ຈັດສົ່ງ (GPS Pin):</span>
              <div className="text-slate-200 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{order.address}</span>
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${order.coordinates.lat}&mlon=${order.coordinates.lng}#map=16/${order.coordinates.lat}/${order.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 underline mt-1"
              >
                <span>ເປີດເບິ່ງແຜນທີ່ເຕັມ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-orange-400">ລາຍການສິນຄ້າ:</h4>
            <div className="rounded-xl border border-emerald-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#03150c] text-emerald-300 border-b border-emerald-800">
                  <tr>
                    <th className="p-2.5">ສິນຄ້າ</th>
                    <th className="p-2.5 text-center">ຈຳນວນ</th>
                    <th className="p-2.5 text-right">ລາຄາຕໍ່ໜ່ວຍ</th>
                    <th className="p-2.5 text-right">ລວມ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40 bg-[#041a0f]">
                  {order.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">
                        <div className="font-semibold text-white">{it.product.name}</div>
                        {it.selectedSize && (
                          <div className="text-[10px] text-orange-400">Size: {it.selectedSize}</div>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold">{it.quantity}</td>
                      <td className="p-2.5 text-right font-mono text-slate-300">
                        {formatKip(it.product.price)}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-yellow-400">
                        {formatKip(it.product.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Payment Method */}
          <div className="p-4 rounded-xl bg-[#041a0f] border border-emerald-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>ວິທີການຊຳລະ:</span>
              <span className="font-bold text-white">
                {order.paymentMethod === 'bank_qr'
                  ? 'ໂອນຜ່ານ Bank QR Code (OnePay)'
                  : 'ເກັບເງິນປາຍທາງ (Cash on Delivery)'}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>ຄ່າຈັດສົ່ງ:</span>
              <span className="font-bold text-emerald-400">
                {order.deliveryFee === 0 ? 'ຟຣີ' : formatKip(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-emerald-900">
              <span className="text-white">ຍອດລວມທັງໝົດ:</span>
              <span className="text-yellow-400 font-mono text-xl">{formatKip(order.total)}</span>
            </div>
          </div>

          {/* Actions: Blue Print button, Yellow Done button */}
          <div className="flex gap-3 pt-2 print:hidden">
            {/* Blue Button: Print Receipt */}
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Printer className="w-5 h-5" />
              <span>ພິມໃບບິນຮັບເງິນ</span>
            </button>

            {/* Yellow Button: Close / Return to Home */}
            <button
              onClick={onClose}
              className="py-3 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow transition-transform active:scale-95"
            >
              ສຳເລັດ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
