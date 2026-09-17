import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Tag,
  Flame,
  Check,
  Trash2,
  Plus,
  FileUp,
  Camera,
  AlertCircle,
  Building,
  Layers,
  HelpCircle
} from "lucide-react";
import { CATEGORIES, BRANCHES, YEARS } from "../../data/seedListings";
import { useListings } from "../../context/ListingsContext";
import { useAuth } from "../../context/AuthContext";

const SAMPLE_CAMPUS_IMAGES = [
  { label: "Textbook / Notes", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80" },
  { label: "Scientific Calculator / Tech", url: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80" },
  { label: "Mini Drafter & Engineering Kit", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80" },
  { label: "Arduino & Electronics", url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80" },
  { label: "Study Desk / Chair", url: "https://images.unsplash.com/photo-1580481077191-236b32dfec6b?w=600&auto=format&fit=crop&q=80" },
  { label: "Hostel Geared Items", url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80" },
];

export const PostItemModal = ({ isOpen, onClose, onPostSuccess }) => {
  const { addListing } = useListings();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [type, setType] = useState("Rent"); // Rent or Sell
  const [category, setCategory] = useState("Books & Notes");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("Good"); // New | Good | Fair
  const [price, setPrice] = useState("");
  const [rentDuration, setRentDuration] = useState("per week");
  const [location, setLocation] = useState(currentUser?.pickupLocation || "SAC / Central Library");
  
  // Real Uploaded Images State
  const [selectedImages, setSelectedImages] = useState([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showStockImages, setShowStockImages] = useState(false);

  const [targetBranch, setTargetBranch] = useState(currentUser?.branch || "Computer Engineering");
  const [targetYear, setTargetYear] = useState("All Years");
  const [genderTarget, setGenderTarget] = useState("Girls Only"); // Girls Only | Boys Only | Co-ed / Any | Any
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload valid image files (PNG, JPG, JPEG, WebP).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImages((prev) => [...prev, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset input
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImages((prev) => [...prev, event.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomImageUrl = () => {
    if (customImageUrl.trim()) {
      setSelectedImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl("");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (category.includes("Other") && !customCategory.trim()) {
        alert("Please specify your custom category or item type.");
        return;
      }
    }
    if (step === 2 && !title.trim()) {
      alert("Please enter an item title.");
      return;
    }
    if (step === 3 && selectedImages.length === 0) {
      alert("Please upload or select at least 1 photo for your listing.");
      return;
    }
    if (step === 4 && (!price || Number(price) <= 0)) {
      alert("Please set a valid price.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const effectiveCategory = category.includes("Other") && customCategory.trim() ? customCategory.trim() : category;

    const created = addListing({
      type,
      category: effectiveCategory,
      subcategory: category.includes("Other") && customCategory.trim() ? customCategory.trim() : "General",
      title,
      description,
      condition,
      price: Number(price),
      rentDuration: type === "Rent" ? rentDuration : null,
      location,
      images: selectedImages.length > 0 ? selectedImages : [SAMPLE_CAMPUS_IMAGES[0].url],
      targetBranch,
      targetYear,
      genderTarget: category === "Hostel & PG Living" ? genderTarget : "Any",
      isUrgent,
      isFeatured,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setStep(1);
      onClose();
      if (onPostSuccess) onPostSuccess(created);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden z-10 my-6 animate-reveal-up flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#121417]">
              Post an Item on Campus
            </h2>
            <p className="text-xs text-slate-500">
              Step {step} of 5 • {step === 1 ? "Listing Type & Category" : step === 2 ? "Item Details" : step === 3 ? "Upload Photos" : step === 4 ? "Price & Meetup" : "Review & Publish"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-[#121417]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Modal View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3 animate-reveal-up">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-[#121417]">
              Listing Published to Campus Feed!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Students across your campus will now be able to view and connect with you for this item.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            
            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[65vh]">
              
              {/* STEP 1: Type & Category (With Other input option) */}
              {step === 1 && (
                <div className="space-y-4 animate-reveal-up">
                  {/* Rent vs Sell Toggle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Choose Listing Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setType("Rent")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          type === "Rent"
                            ? "bg-orange-50 border-[#FF5A1F] text-[#121417] ring-2 ring-[#FF5A1F]/20"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        <span className="font-display font-bold text-base block text-[#121417]">
                          📦 Rent it Out
                        </span>
                        <span className="text-xs text-slate-500 mt-1 block">
                          Lend temporary items for a week, month, or semester.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setType("Sell")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          type === "Sell"
                            ? "bg-[#121417] border-[#121417] text-white ring-2 ring-[#121417]/20"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        <span className={`font-display font-bold text-base block ${type === "Sell" ? "text-white" : "text-[#121417]"}`}>
                          🏷️ Sell Item
                        </span>
                        <span className={`text-xs mt-1 block ${type === "Sell" ? "text-slate-300" : "text-slate-500"}`}>
                          Sell items you no longer need after term ends.
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Category Selection Grid */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Select Campus Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                        const isSelected = category === cat;
                        const isOther = cat.includes("Other");
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-[#121417] text-white border-[#121417] shadow-sm scale-102"
                                : isOther
                                ? "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100"
                                : "bg-slate-50 hover:bg-slate-100 text-[#121417] border-slate-200"
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5A1F]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic "Other" Custom Category Input */}
                  {category.includes("Other") && (
                    <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 animate-reveal-up space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900">
                        <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                        <span>Specify Your Custom Category / Item Type *</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Acoustic Guitar, Gym Dumbbells, Table Lamp, Art Supplies, Room Cooler..."
                        className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl text-xs text-[#121417] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                      />
                      <p className="text-[11px] text-purple-700 leading-tight">
                        ✨ Describing your item category helps campus peers search and discover it instantly.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* STEP 2: Title, Description, Condition */}
              {step === 2 && (
                <div className="space-y-4 animate-reveal-up">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Operating Systems (Silberschatz) + Handwritten Notes"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Condition
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["New", "Good", "Fair"].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setCondition(cond)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
                            condition === cond
                              ? "bg-[#121417] text-white border-[#121417]"
                              : "bg-slate-50 hover:bg-slate-100 text-[#121417] border-slate-200"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PG & Hostel Specific Gender Option */}
                  {category === "Hostel & PG Living" && (
                    <div className="p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#FF5A1F]">
                        🏠 Allowed Tenants / Hostel Preference
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "Girls Only", label: "🌸 Girls Only" },
                          { id: "Boys Only", label: "🔷 Boys Only" },
                          { id: "Co-ed / Any", label: "👥 Co-ed / Any" }
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setGenderTarget(g.id)}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                              genderTarget === g.id
                                ? g.id === "Girls Only"
                                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                                  : g.id === "Boys Only"
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-[#121417] text-white border-[#121417]"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Description & Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Mention edition, highlighting, included cables, lab notes, reason for selling/renting..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Real Device Photo Upload & Dropzone */}
              {step === 3 && (
                <div className="space-y-4 animate-reveal-up">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Upload Photos from Your Device *
                      </label>
                      <span className="text-[11px] font-bold text-[#FF5A1F]">
                        {selectedImages.length} photo{selectedImages.length === 1 ? "" : "s"} added
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      Add clear real pictures of the actual item for 3x faster student deals.
                    </p>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Primary Clickable Drag & Drop Zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                        isDragging
                          ? "border-[#FF5A1F] bg-orange-50/80 scale-102"
                          : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-[#FF5A1F]/60"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5A1F] flex items-center justify-center shadow-xs">
                        <Upload className="w-7 h-7" />
                      </div>

                      <div>
                        <span className="font-display font-bold text-sm text-[#121417] block">
                          Click to browse files or drag & drop here
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          Supports JPG, PNG, WebP • Take photo from camera or gallery
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="btn-primary text-xs py-2 px-4 shadow-sm font-bold mt-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Choose Photos</span>
                      </button>
                    </div>

                    {/* Uploaded Images Gallery Grid */}
                    {selectedImages.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Uploaded Photos (First image is Cover):
                        </span>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {selectedImages.map((imgSrc, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 group shadow-sm bg-slate-100"
                            >
                              <img
                                src={imgSrc}
                                alt={`Upload ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Cover Photo Badge */}
                              {idx === 0 && (
                                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#121417]/85 text-white font-bold text-[9px] backdrop-blur-xs flex items-center gap-1 shadow-xs">
                                  <span>⭐</span>
                                  <span>Cover</span>
                                </div>
                              )}

                              {/* Delete Photo Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-md transition-transform active:scale-90"
                                title="Remove Image"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          {/* Add More Tile */}
                          {selectedImages.length < 6 && (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-orange-50/50 hover:border-[#FF5A1F]/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-[#FF5A1F]"
                            >
                              <Plus className="w-6 h-6" />
                              <span className="text-[10px] font-bold">Add More</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Secondary Option: Stock Photos or Image URL Toggle */}
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setShowStockImages(!showStockImages)}
                        className="text-xs font-semibold text-slate-500 hover:text-[#FF5A1F] flex items-center gap-1.5 transition-colors"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{showStockImages ? "Hide Stock Photos & URL Link" : "Or pick from Quick Campus Stock Samples / Paste URL Link"}</span>
                      </button>

                      {showStockImages && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-reveal-up">
                          <div className="grid grid-cols-3 gap-2">
                            {SAMPLE_CAMPUS_IMAGES.map((sample, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  if (!selectedImages.includes(sample.url)) {
                                    setSelectedImages((prev) => [...prev, sample.url]);
                                  }
                                }}
                                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 hover:border-[#FF5A1F] cursor-pointer group"
                              >
                                <img src={sample.url} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[9px] text-white text-center truncate">
                                  + {sample.label}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="Paste external image URL..."
                              value={customImageUrl}
                              onChange={(e) => setCustomImageUrl(e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-[#121417]"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomImageUrl}
                              className="btn-secondary text-xs py-2 px-3 shrink-0"
                            >
                              Add URL
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 4: Price, Duration & Pickup Location */}
              {step === 4 && (
                <div className="space-y-4 animate-reveal-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Price (₹ INR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                          ₹
                        </span>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="e.g. 250"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-[#121417] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30"
                        />
                      </div>
                    </div>

                    {type === "Rent" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Rental Duration
                        </label>
                        <select
                          value={rentDuration}
                          onChange={(e) => setRentDuration(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#121417] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                        >
                          <option value="per week">per week</option>
                          <option value="per month">per month</option>
                          <option value="per semester">per semester</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Campus Meetup Spot
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. SAC Building / Central Library / Hostel 3"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#121417] focus:outline-none focus:ring-1 focus:ring-[#FF5A1F]"
                      />
                    </div>
                  </div>

                  {/* OLX Boost Toggles */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      OLX-Style Promoted Badges (Free for Campus Students)
                    </span>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-600" />
                        <div>
                          <span className="text-xs font-bold text-[#121417] block">Mark as Urgent Deal</span>
                          <span className="text-[10px] text-slate-500">Highlights with red pulse badge for 24h fast sale</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5A1F] rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
                        <div>
                          <span className="text-xs font-bold text-[#121417] block">Feature on Campus Homepage</span>
                          <span className="text-[10px] text-slate-500">Ranks at the top of recommendations</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#FF5A1F] rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Target Branch
                      </label>
                      <select
                        value={targetBranch}
                        onChange={(e) => setTargetBranch(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#121417]"
                      >
                        {BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Target Year
                      </label>
                      <select
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#121417]"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Confirm */}
              {step === 5 && (
                <div className="space-y-4 animate-reveal-up text-xs text-slate-600">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between font-display font-bold text-sm text-[#121417]">
                      <span>{title}</span>
                      <span>₹{price} {type === "Rent" ? `(${rentDuration})` : ""}</span>
                    </div>
                    <p className="text-slate-500 line-clamp-2">{description || "No description"}</p>
                    
                    {/* Photos Preview in Review */}
                    {selectedImages.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {selectedImages.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-[#121417] font-semibold">{type}</span>
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FF5A1F] font-bold">
                        {category.includes("Other") && customCategory.trim() ? customCategory.trim() : category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-[#121417]">{condition}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-[#121417]">📍 {location}</span>
                      {isUrgent && <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">🔥 Urgent Deal</span>}
                      {isFeatured && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">⭐ Featured</span>}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-800 text-xs">
                    🛡️ <strong>Campus Safe Protocol</strong>: Your listing will default to <em>Available</em>. No personal contact numbers are shared until a deal is discussed inside chat.
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary text-xs py-2 px-4 ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary text-xs py-2.5 px-5 ml-auto font-bold shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Campus Feed</span>
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};


