import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { formatKip } from '../data/initialData';
import { InteractiveMap } from './InteractiveMap';
import {
  X,
  User,
  Phone,
  MapPin,
  QrCode,
  Banknote,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  isOpen,
  onClose,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 500000 || items.length === 0 ? 0 : 20000;
  const total = subtotal + deliveryFee;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [locationName, setLocationName] = useState('ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital, Laos)');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 17.9757,
    lng: 102.6133,
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_qr'>('bank_qr');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Slip Upload
  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('ກະລຸນາອັບໂຫຼດສະເພາະໄຟລ໌ຮູບພາບຫຼັກຖານການໂອນ (JPG, PNG)');
      return;
    }

    setSlipFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSlipImage(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Submit Order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMsg('ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ ຂອງລູກຄ້າ');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('ກະລຸນາປ້ອນເບີໂທລະສັບຕິດຕໍ່ສຳລັບການຈັດສົ່ງ');
      return;
    }
    if (paymentMethod === 'bank_qr' && !slipImage) {
      setErrorMsg('ກະລຸນາອັບໂຫຼດສະລິບ (Slip) ຫຼັກຖານການໂອນເງິນຜ່ານທະນາຄານ');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `BP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('lo-LA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: `${addressDetails.trim() ? addressDetails.trim() + ' | ' : ''}${locationName}`,
      coordinates: coords,
      locationName,
      paymentMethod,
      slipImage: slipImage || undefined,
      items,
      subtotal,
      deliveryFee,
      total,
      status: 'preparing',
      orderType: 'online',
      notes: notes.trim() || undefined,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitOrder(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#062817] border-2 border-emerald-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Top Header Bar in Orange (ແຖບຕ່າງໆແມ່ນສີສົ້ມ Orange) */}
        <div className="bg-orange-600 px-5 py-3.5 flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-2">
            <h2 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-black">
              ເຊັກເອົາ & ຂໍ້ມູນຈັດສົ່ງສິນຄ້າ (Checkout & Delivery)
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Contact Info */}
          <div className="space-y-3">
            <div className="bg-orange-600/20 border-l-4 border-orange-500 px-3 py-1.5 rounded-r">
              <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-white">
                1. ຂໍ້ມູນລູກຄ້າສຳລັບການຈັດສົ່ງ (Customer Information)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ຊື່ ແລະ ນາມສະກຸນ (Customer Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ຕົວຢ່າງ: ທ່ານ ສົມສັກ ວົງສາ"
                    className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ເບີໂທລະສັບຕິດຕໍ່ (Phone Number) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ຕົວຢ່າງ: 020 55556666"
                    className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ຈຸດສັງເກດ / ລາຍລະອຽດທີ່ຢູ່ເພີ່ມເຕີມ (Landmark & Address Details)
              </label>
              <input
                type="text"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="ຕົວຢ່າງ: ບ້ານ ໂພນສະຫວ່າງ, ຮ່ອມ 5, ໃກ້ກັບເດີ່ນແບັດມິນຕັນ..."
                className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Section 2: Interactive Map & GPS Location */}
          <div className="space-y-3">
            <div className="bg-orange-600/20 border-l-4 border-orange-500 px-3 py-1.5 rounded-r">
              <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-white">
                2. ແຜນທີ່ຈັດສົ່ງ ແລະ ປັກໝຸດ GPS (Map & Delivery Pin)
              </h3>
            </div>

            {/* Interactive Map with "Get My Location" (HTML5 Geolocation API) */}
            <InteractiveMap
              initialLat={coords.lat}
              initialLng={coords.lng}
              onLocationSelect={(loc) => {
                setCoords({ lat: loc.lat, lng: loc.lng });
                setLocationName(loc.addressText);
              }}
            />
          </div>

          {/* Section 3: Payment Gateway (2 Systems: COD and Bank QR) */}
          <div className="space-y-3">
            <div className="bg-orange-600/20 border-l-4 border-orange-500 px-3 py-1.5 rounded-r">
              <h3 className="font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold text-white">
                3. ຊ່ອງທາງການຊຳລະເງິນ (Payment Method)
              </h3>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Bank QR Code */}
              <div
                onClick={() => setPaymentMethod('bank_qr')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank_qr'
                    ? 'border-orange-500 bg-[#07361e] shadow-lg'
                    : 'border-emerald-800 bg-[#041a0f] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Bank QR Code (OnePay / BCEL)</h4>
                      {paymentMethod === 'bank_qr' && (
                        <CheckCircle2 className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      ສະແກນຈ່າຍຜ່ານ BCEL One / ທຸກທະນາຄານໃນລາວ
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-[#07361e] shadow-lg'
                    : 'border-emerald-800 bg-[#041a0f] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                    <Banknote className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Cash on Delivery (COD)</h4>
                      {paymentMethod === 'cod' && (
                        <CheckCircle2 className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      ເກັບເງິນປາຍທາງເມື່ອພະນັກງານຈັດສົ່ງສິນຄ້າຮອດທ່ານ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank QR details & Slip Upload Box */}
            {paymentMethod === 'bank_qr' && (
              <div className="p-4 rounded-xl bg-[#03150c] border border-orange-500/50 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-[#052114] p-4 rounded-xl border border-emerald-800">
                  {/* Generated QR Code SVG/Canvas */}
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-xl shadow-md inline-block border-2 border-red-600">
                      <div className="w-44 h-44 relative flex items-center justify-center bg-white">
                        {/* Realistic SVG Representation of BCEL OnePay QR */}
                        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          {/* Corner Squares */}
                          <rect x="5" y="5" width="26" height="26" fill="#CC0000" />
                          <rect x="9" y="9" width="18" height="18" fill="white" />
                          <rect x="13" y="13" width="10" height="10" fill="#CC0000" />

                          <rect x="69" y="5" width="26" height="26" fill="#CC0000" />
                          <rect x="73" y="9" width="18" height="18" fill="white" />
                          <rect x="77" y="13" width="10" height="10" fill="#CC0000" />

                          <rect x="5" y="69" width="26" height="26" fill="#CC0000" />
                          <rect x="9" y="73" width="18" height="18" fill="white" />
                          <rect x="13" y="77" width="10" height="10" fill="#CC0000" />

                          {/* Pattern Blocks */}
                          <rect x="35" y="8" width="8" height="8" fill="#1e293b" />
                          <rect x="47" y="8" width="14" height="8" fill="#1e293b" />
                          <rect x="35" y="20" width="10" height="6" fill="#1e293b" />
                          <rect x="49" y="20" width="12" height="10" fill="#1e293b" />

                          <rect x="8" y="35" width="8" height="10" fill="#1e293b" />
                          <rect x="20" y="39" width="12" height="8" fill="#1e293b" />
                          <rect x="8" y="49" width="12" height="12" fill="#1e293b" />
                          <rect x="24" y="51" width="8" height="10" fill="#1e293b" />

                          <rect x="36" y="36" width="28" height="28" fill="#CC0000" rx="4" />
                          <text x="50" y="53" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">OnePay</text>

                          <rect x="68" y="35" width="14" height="8" fill="#1e293b" />
                          <rect x="86" y="35" width="8" height="14" fill="#1e293b" />
                          <rect x="72" y="47" width="12" height="12" fill="#1e293b" />

                          <rect x="35" y="68" width="12" height="10" fill="#1e293b" />
                          <rect x="51" y="68" width="10" height="14" fill="#1e293b" />
                          <rect x="35" y="82" width="18" height="10" fill="#1e293b" />
                          <rect x="57" y="86" width="35" height="8" fill="#1e293b" />
                          <rect x="69" y="72" width="10" height="10" fill="#1e293b" />
                          <rect x="83" y="72" width="12" height="10" fill="#1e293b" />
                        </svg>
                      </div>
                      <span className="block text-[10px] font-bold text-red-600 mt-1 uppercase">
                        BCEL OnePay · ທະນາຄານການຄ້າ
                      </span>
                    </div>
                  </div>

                  {/* Bank Account Info */}
                  <div className="space-y-1.5 text-xs text-slate-200">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>ທະນາຄານການຄ້າຕ່າງປະເທດລາວ (BCEL)</span>
                    </div>
                    <p className="text-slate-300">
                      ຊື່ບັນຊີ: <strong className="text-white">BADMINTON PRO LAOS STORE</strong>
                    </p>
                    <p className="font-mono text-sm font-bold text-orange-400 bg-black/60 px-2 py-1 rounded inline-block">
                      160-12-00-01928374-001 (LAK)
                    </p>
                    <div className="pt-2">
                      <span className="text-slate-400">ຈຳນວນເງິນທີ່ຕ້ອງໂອນ:</span>
                      <div className="text-xl font-black text-yellow-400 font-mono">
                        {formatKip(total)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slip Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    ອັບໂຫຼດສະລິບ (Slip) ຫຼັກຖານການໂອນເງິນ *
                  </label>

                  <div className="border-2 border-dashed border-emerald-700 hover:border-orange-500 rounded-xl p-4 text-center bg-[#041a0f] transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {slipImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={slipImage}
                          alt="Uploaded Slip"
                          className="h-32 object-contain rounded-lg border border-emerald-600 shadow"
                        />
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                          <FileCheck className="w-4 h-4" />
                          <span>ອັບໂຫຼດສະລິບສຳເລັດ: {slipFileName}</span>
                        </div>
                        {/* Red Button: Remove Slip */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSlipImage(null);
                            setSlipFileName(null);
                          }}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded shadow z-10"
                        >
                          ລົບຮູບສະລິບ / ເລືອກໃໝ່
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400 py-3">
                        <Upload className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-bold text-white">
                          ກົດເພື່ອເລືອກຮູບສະລິບ ຫຼື ລາກຮູບມາວາງທີ່ນີ້
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ຮອງຮັບຮູບຖ່າຍໜ້າຈໍການໂອນເງິນ (JPG, PNG)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Delivery Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ໝາຍເຫດເພີ່ມເຕີມເຖິງຮ້ານ (Delivery Notes)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ຕົວຢ່າງ: ໂທກ່ອນສົ່ງ 15 ນາທີ, ຝາກໄວ້ໜ້າບ້ານ..."
                className="w-full bg-[#041a0f] border border-emerald-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Section 4: Order Summary and Final Confirmation */}
          <div className="p-4 rounded-xl bg-[#041a0f] border border-emerald-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-300">
              <span>ລວມຍອດສິນຄ້າ ({items.reduce((s, i) => s + i.quantity, 0)} ອັນ):</span>
              <span className="font-mono text-white font-bold">{formatKip(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>ຄ່າຈັດສົ່ງ:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {deliveryFee === 0 ? 'ຟຣີ (Free)' : formatKip(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-emerald-900">
              <span className="text-white">ຍອດຊຳລະສຸດທິ:</span>
              <span className="text-yellow-400 font-mono text-xl">{formatKip(total)}</span>
            </div>

            {/* Action Buttons: Red and Blue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Red Button: Cancel */}
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow transition-colors text-center"
              >
                ຍົກເລີກ / ກັບຄືນ
              </button>

              {/* Blue Button: Confirm Order */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-['Phetsarath_OT','Noto_Sans_Lao',sans-serif] text-[18px] font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>ກຳລັງບັນທຶກອໍເດີ້...</span>
                ) : (
                  <>
                    <span>ຢືນຢັນການສັ່ງຊື້ສິນຄ້າ</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
