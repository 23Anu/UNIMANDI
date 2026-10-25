import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
    CheckCircle2,
    Copy,
    Check,
    Smartphone,
    Loader2,
    ShieldCheck,
} from "lucide-react";

const UPI_ID = "8830653841@ybl";
const UPI_NAME = "UniMandi Campus";

/**
 * UPI QR Code Payment Component
 * Generates a scannable UPI deep-link QR code for PhonePe / GPay / Paytm.
 *
 * Props:
 *  - amount       (number)  — payment amount in ₹
 *  - description  (string)  — transaction note
 *  - onPaymentConfirmed  (fn) — called when user clicks "I've Paid"
 *  - onCancel     (fn)      — close / go back
 *  - accentColor  (string)  — theme color (default: #FF5A1F)
 */
export const UpiQrPayment = ({
    amount,
    description = "UniMandi Payment",
    onPaymentConfirmed,
    onCancel,
    accentColor = "#FF5A1F",
}) => {
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const txnRef = `UM${Date.now()}`;
    const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}&tr=${txnRef}`;

    const handleCopyUpiId = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleConfirmPayment = () => {
        setConfirming(true);
        setTimeout(() => {
            setConfirming(false);
            setConfirmed(true);
            if (onPaymentConfirmed) {
                onPaymentConfirmed({ paymentId: `upi_${txnRef}`, method: "UPI QR", upiId: UPI_ID });
            }
        }, 1200);
    };

    if (confirmed) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-reveal-up">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">Payment Confirmed!</h3>
                <p className="text-[11px] text-slate-500 max-w-[220px]">
                    Your UPI payment of ₹{amount.toLocaleString("en-IN")} has been marked as received.
                </p>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Ref: {txnRef}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center space-y-4 py-2 animate-reveal-up">
            {/* Header */}
            <div>
                <h3 className="font-bold text-base text-slate-800 mb-0.5 flex items-center justify-center gap-1.5">
                    <Smartphone className="w-4 h-4" style={{ color: accentColor }} />
                    Scan & Pay via UPI
                </h3>
                <p className="text-[11px] text-slate-500 max-w-[260px]">
                    Open PhonePe, Google Pay, Paytm or any UPI app and scan this QR code
                </p>
            </div>

            {/* QR Code */}
            <div className="relative bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
                <QRCodeSVG
                    value={upiDeepLink}
                    size={200}
                    level="H"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#121417"
                />
                {/* Amount overlay badge */}
                <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-extrabold shadow-md"
                    style={{ backgroundColor: accentColor }}
                >
                    ₹{amount.toLocaleString("en-IN")}
                </div>
            </div>

            {/* UPI ID display */}
            <div className="flex items-center gap-2 mt-2">
                <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">UPI ID:</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">{UPI_ID}</span>
                </div>
                <button
                    onClick={handleCopyUpiId}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
                    title="Copy UPI ID"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Secured UPI Payment · PhonePe Preferred</span>
            </div>

            {/* Transaction Note */}
            <div className="w-full max-w-[260px] px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium">
                📝 <strong>Note:</strong> After scanning & paying in your UPI app, tap the button below to confirm.
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[260px] space-y-2 pt-1">
                <button
                    onClick={handleConfirmPayment}
                    disabled={confirming}
                    className="w-full py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70 active:scale-95"
                    style={{ backgroundColor: confirming ? "#94a3b8" : accentColor }}
                >
                    {confirming ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>I've Paid ₹{amount.toLocaleString("en-IN")}</span>
                        </>
                    )}
                </button>

                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-all border border-slate-200"
                    >
                        Cancel / Go Back
                    </button>
                )}
            </div>
        </div>
    );
};
