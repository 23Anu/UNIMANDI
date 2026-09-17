import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, UserX } from "lucide-react";
import { Modal } from "../common/Modal";

const REPORT_REASONS = [
  "Fake / Spam listing",
  "Item condition misleading",
  "Unreasonable price / Scalping",
  "Prohibited or illegal item",
  "Unresponsive or suspicious behavior",
  "Harassment or rude conduct",
];

export const ReportBlockModal = ({
  isOpen,
  onClose,
  targetListing,
}) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [shouldBlock, setShouldBlock] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !targetListing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Post or User" maxWidth="max-w-md">
      {isSubmitted ? (
        <div className="py-8 text-center animate-reveal-up">
          <div className="w-14 h-14 rounded-full bg-moss-50 text-moss-500 border border-moss-500/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-navy-800">
            Report Received
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Our campus trust & safety team will review this item within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
          <div className="p-3 bg-rust-50 border border-rust-500/20 rounded-xl text-rust-700">
            Reporting listing: <strong>"{targetListing.title}"</strong>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
              Select Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-cream-100 border border-cream-300 rounded-xl text-xs text-navy-800"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 text-[10px] mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context on what was wrong or broken..."
              className="w-full px-3 py-2 bg-cream-100 border border-cream-300 rounded-xl text-xs text-navy-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="blockUserCheck"
              checked={shouldBlock}
              onChange={(e) => setShouldBlock(e.target.checked)}
              className="w-4 h-4 text-navy-800 rounded border-cream-300 focus:ring-marigold-500"
            />
            <label htmlFor="blockUserCheck" className="text-slate-600 font-medium cursor-pointer">
              Also block this user from contacting me
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rust-600 hover:bg-rust-700 text-cream-50 font-bold shadow-sm"
            >
              Submit Report
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
