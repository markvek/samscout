import React, { useState } from "react";
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Calendar, User, Key, RefreshCw, Star } from "lucide-react";
import { CreditCardData } from "../types";

interface Props {
  price: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function SimulatedCheckout({ price, onBack, onSuccess }: Props) {
  const [formData, setFormData] = useState<CreditCardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  const STEPS = [
    "Establishing secure, encrypted SSL socket channel...",
    "Hashing cardholder identification tokens...",
    "Querying federal merchant payment gateway routing...",
    "Acquiring settlement clearing validations...",
    "Authorization approved. Allocating secure workspace storage...",
    "Compiling generated RFP cover letter coverages...",
    "Building perfect-overlap bidding compliance checklists..."
  ];

  const handleInputChange = (field: keyof CreditCardData, value: string) => {
    let formattedValue = value;
    if (field === "cardNumber") {
      // Format numeric card inputs into standard 4-character gaps
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = formattedValue.match(/.{1,4}/g)?.join(" ") || formattedValue;
    } else if (field === "expiryDate") {
      // Format MM/YY
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    } else if (field === "cardholderName") {
      formattedValue = value.slice(0, 32).toUpperCase();
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      alert("Please supply complete credit credentials before proceeding.");
      return;
    }

    setIsProcessing(true);
    setProcessStep(0);

    // Loop through simulated step updates
    const interval = setInterval(() => {
      setProcessStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onSuccess();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1100);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-sans text-usa-blue hover:text-red-700 font-semibold cursor-pointer"
        disabled={isProcessing}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Gap Analysis
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-lg border border-gray-250 shadow-md p-6 relative overflow-hidden">
        {/* Decorative Top header */}
        <div className="bg-gray-50 border-b border-gray-150 p-4 -mx-6 -mt-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-usa-red shrink-0" />
            <h3 className="text-xs font-sans font-bold tracking-wider uppercase text-usa-blue">
              Treasury Gateway • Secure Deposit
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] bg-white border border-gray-200 text-emerald-600 px-2 py-0.5 rounded font-mono">
            <Lock className="w-3 h-3 text-emerald-500" />
            256-BIT SECURE
          </div>
        </div>

        {!isProcessing ? (
          <div className="space-y-6">
            {/* Visual Credit Card */}
            <div className="flex justify-center">
              <div 
                className="w-full max-w-[340px] h-48 rounded-xl shadow-lg relative cursor-pointer text-white transition-transform duration-500 transform font-mono leading-none flex flex-col justify-between"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  backgroundImage: "linear-gradient(135deg, #1d3557 0%, #111e38 100%)",
                  borderTop: "3px solid #d4af37"
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* CARD FRONT */}
                <div 
                  className="absolute w-full h-full p-5 flex flex-col justify-between backface-invisible"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-usa-gold font-sans font-black">
                        FEDERAL BID GUARANTY
                      </div>
                      <div className="text-[8px] text-gray-400 uppercase font-sans">
                        SECURE LIQUID SETTLEMENT CARD
                      </div>
                    </div>
                    {/* Tiny visual star emblem */}
                    <div className="flex gap-1">
                      <Star className="w-4 h-4 fill-usa-gold text-usa-gold animate-spin-slow" />
                    </div>
                  </div>

                  {/* Shiny Chip */}
                  <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md border border-yellow-200 mt-2" />

                  {/* Card Number */}
                  <div className="text-base tracking-widest text-center py-1 mt-1 font-bold text-gray-100">
                    {formData.cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  {/* Expiry and Cardholder Name */}
                  <div className="flex justify-between items-end text-[10px] text-gray-300">
                    <div>
                      <div className="text-[8px] uppercase text-gray-500 font-sans">Cardholder</div>
                      <div className="truncate max-w-[170px] uppercase font-bold text-white tracking-wider">
                        {formData.cardholderName || "JOHN SMITH"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] uppercase text-gray-500 font-sans">Expires</div>
                      <div className="font-bold text-white">{formData.expiryDate || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                {/* CARD BACK */}
                <div 
                  className="absolute w-full h-full pb-5 pt-3 flex flex-col justify-between backface-invisible"
                  style={{ 
                    backfaceVisibility: "hidden", 
                    transform: "rotateY(180deg)" 
                  }}
                >
                  {/* Magnetic Strip */}
                  <div className="w-full h-10 bg-black mt-2" />

                  {/* Authorized Sign Box & CVV */}
                  <div className="px-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[7px] text-gray-400 font-sans uppercase">
                        Authorized Signature • Not transferable
                      </div>
                      <div className="text-[7px] text-gray-400 font-sans uppercase">
                        CVC/CVV
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Signature line mock */}
                      <div className="flex-1 bg-gradient-to-r from-gray-200 to-slate-300 h-7 rounded px-3 flex items-center font-serif text-[10px] text-gray-600 italic">
                        US Govt Escrow Depository
                      </div>
                      {/* CVV Number */}
                      <div className="bg-amber-100 text-gray-800 font-extrabold px-3 py-1.5 h-7 rounded text-xs border border-amber-300">
                        {formData.cvv || "•••"}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 text-[8px] text-gray-500 text-center uppercase font-sans">
                    Insured of FDIC Bank • Customer Service: 1-800-FED-BID
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company cardholder */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <User className="w-3.5 h-3.5 text-usa-blue" />
                    Cardholder Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="E.G. JOHN SMITH"
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-usa-blue rounded px-3 py-2.5 font-medium text-gray-900"
                    required
                  />
                </div>

                {/* Card number */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <CreditCard className="w-3.5 h-3.5 text-usa-blue" />
                    Credit Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-usa-blue rounded px-3 py-2.5 font-mono text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Exp date */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 text-usa-blue" />
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-usa-blue rounded px-3 py-2.5 font-mono text-gray-900 text-center"
                    required
                  />
                </div>

                {/* CVV/CVC */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Key className="w-3.5 h-3.5 text-usa-blue" />
                    CVV / Security Code
                  </label>
                  <input
                    type="password"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="•••"
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-usa-blue rounded px-3 py-2.5 font-mono text-gray-900 text-center"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-gray-150 flex items-center gap-3 text-gray-600 leading-relaxed font-sans text-[11px]">
                <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                <span>
                  Your transaction is fully simulated in the AI space. Under no circumstances should you type real credentials into this playground container. This is a visual framework illustrating standard payment logic.
                </span>
              </div>

              {/* Submit Pay */}
              <button
                type="submit"
                className="w-full bg-usa-red hover:bg-red-700 active:scale-95 text-white font-sans text-sm font-bold tracking-wide py-3 rounded shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Submit Deposit &amp; Complete Authorization • {price}
              </button>
            </form>
          </div>
        ) : (
          /* Processing State animation */
          <div className="py-12 text-center space-y-6">
            <div className="relative flex justify-center">
              <span className="relative flex h-16 w-16">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-usa-blue opacity-35"></span>
                <span className="relative inline-flex rounded-full h-16 w-16 bg-navy-800 flex items-center justify-center border-2 border-usa-gold text-white text-base">
                  <RefreshCw className="w-6 h-6 animate-spin text-usa-gold" />
                </span>
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-serif text-usa-blue font-bold uppercase tracking-wider">
                PROCESSING BID AUTHORIZATION SETTLEMENT...
              </h4>
              <p className="text-xs text-gray-500 font-mono italic max-w-md mx-auto">
                "{STEPS[processStep]}"
              </p>

              {/* Progress indicator steps */}
              <div className="w-full max-w-sm mx-auto bg-slate-100 border border-slate-200 rounded-full h-2 overflow-hidden mt-4">
                <div 
                  className="bg-usa-blue h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((processStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
