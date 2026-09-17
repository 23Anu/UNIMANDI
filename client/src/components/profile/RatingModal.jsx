import React, { useState } from "react";
import { Star, CheckCircle, Sparkles, X } from "lucide-react";
import { Modal } from "../common/Modal";

const TRUST_TAGS = [
  "On time",
  "Item as described",
  "Good communication",
  "Helpful senior",
  "Fair pricing",
  "Smooth meetup"
];

export const RatingModal = ({
  isOpen,
  onClose,
  dealInfo, // { listingId, targetUserId, targetUserName }
  onSubmitRating
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(["On time", "Item as described"]);
  const [comment, setComment] = useState("");
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !dealInfo) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitRating) {
      onSubmitRating({
        dealListingId: dealInfo.listingId,
        toUserId: dealInfo.targetUserId,
        rating,
        tags: selectedTags,
        comment: comment.trim(),
      });
    }

    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Deal & Build Trust" maxWidth="max-w-md">
      {isDone ? (
        <div className="py-8 text-center animate-reveal-up">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#121417]">
            Rating Submitted!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Thank you for keeping our campus marketplace trusted and safe.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
          <p className="text-slate-600">
            How was your exchange with <strong>{dealInfo.targetUserName || "the other student"}</strong>?
          </p>

          {/* Star Rating Selection */}
          <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl border border-slate-200">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Trust Tags */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-2">
              Select Trust Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TRUST_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      isSelected
                        ? "bg-[#121417] text-white border-[#121417]"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Comment */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-500 text-[10px] mb-1">
              Add a brief comment (optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Handed over right on time at the SAC Nescafe stall, item was clean..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-2 px-3"
            >
              Skip
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-4 font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Trust Rating</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

