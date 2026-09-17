import React from "react";
import { PackageOpen, Sparkles, PlusCircle } from "lucide-react";

export const EmptyState = ({
  title = "No campus items found",
  message = "Try adjusting your filters or search keywords to find what you need.",
  actionText = "Post an Item",
  onAction,
  secondaryText = "Reset Filters",
  onSecondaryAction,
}) => {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto bg-cream-50/60 rounded-3xl border border-dashed border-cream-300">
      <div className="w-16 h-16 rounded-2xl bg-cream-200 text-marigold-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <PackageOpen className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold font-serif text-navy-800 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary w-full sm:w-auto text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            {actionText}
          </button>
        )}

        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="btn-secondary w-full sm:w-auto text-sm"
          >
            <Sparkles className="w-4 h-4 text-marigold-500" />
            {secondaryText}
          </button>
        )}
      </div>
    </div>
  );
};
