import React, { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";
import { Footer } from "./components/layout/Footer";
import { HeroBanner } from "./components/feed/HeroBanner";
import { LiveActivityTicker } from "./components/feed/LiveActivityTicker";
import { CategoryBar } from "./components/feed/CategoryBar";
import { SearchFilterBar } from "./components/feed/SearchFilterBar";
import { ListingCard } from "./components/feed/ListingCard";
import { InFeedSellBanner } from "./components/feed/InFeedSellBanner";
import { ItemDetailModal } from "./components/item/ItemDetailModal";
import { PostItemModal } from "./components/post/PostItemModal";
import { ChatDrawer } from "./components/chat/ChatDrawer";
import { ProfileView } from "./components/profile/ProfileView";
import { MyListingsTabs } from "./components/profile/MyListingsTabs";
import { RatingModal } from "./components/profile/RatingModal";
import { ReportBlockModal } from "./components/safety/ReportBlockModal";
import { EmptyState } from "./components/common/EmptyState";
import { LoginScreen } from "./components/auth/LoginScreen";
import { CompleteProfileScreen } from "./components/auth/CompleteProfileScreen";
import { TanishStoreView } from "./components/store/TanishStoreView";
import { TanishMerchantDashboard } from "./components/store/TanishMerchantDashboard";
import { useListings } from "./context/ListingsContext";
import { useChat } from "./context/ChatContext";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "./components/common/ToastContainer";
import { FloatingChatButton } from "./components/common/FloatingChatButton";
import { Sparkles, Heart, Compass, Store } from "lucide-react";

function MainContent() {
  const { currentUser, needsProfileSetup } = useAuth();
  const {
    filteredListings,
    savedListings,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
  } = useListings();
  const { isChatOpen, setIsChatOpen, dealRatingPrompt, setDealRatingPrompt } = useChat();

  const isStoreMerchant = currentUser?.role === "merchant" || currentUser?.id === "user_kampus_store";
  const [activeTab, setActiveTab] = useState(() => isStoreMerchant ? "store" : "home"); // home | browse | store | saved | mylistings | profile
  const [selectedListing, setSelectedListing] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [reportListing, setReportListing] = useState(null);

  // If user is not authenticated, show Login / Onboarding screen first!
  if (!currentUser) {
    return <LoginScreen />;
  }

  // If student needs to complete their full profile (email & phone verification, hostel, roll no, branch)
  if (needsProfileSetup || !currentUser.isProfileComplete) {
    return <CompleteProfileScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#121417]">
      {/* Real-time live notifications */}
      <ToastContainer onOpenChat={() => setIsChatOpen(true)} />
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenChatDrawer={() => setIsChatOpen(true)}
        onOpenProfileView={() => setActiveTab("profile")}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        
        {/* VIEW: Home / Feed */}
        {activeTab === "home" && (
          <div className="animate-reveal-up">
            <HeroBanner
              onBrowseClick={() => setActiveTab("browse")}
              onPostClick={() => setIsPostModalOpen(true)}
            />

            <LiveActivityTicker />

            <CategoryBar />
            <SearchFilterBar />


            {/* Official UniMandi SAC Store Quick Card */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121417] to-[#23262F] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700 shadow-sm text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FF5A1F] text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  🏪
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-white">
                      UniMandi Official Store • SAC Counter
                    </h3>
                    <span className="text-[10px] uppercase font-bold bg-[#FF5A1F] px-2 py-0.5 rounded-full text-white">
                      Instant QR Pickup
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Order Drawing Kits, Official Lab Manuals, Casio Calculators or Exam Packs directly. No counter queues!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("store")}
                className="btn-primary text-xs py-2.5 px-4 shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Visit UniMandi Store &rarr;</span>
              </button>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-[#121417]">
                  Fresh Campus Recommendations
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] border border-[#FF5A1F]/30">
                  <Sparkles className="w-3 h-3 text-[#FF5A1F]" />
                  Branch & Year Ranked
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredListings.length} items available
              </span>
            </div>

            {/* Listings Grid with In-Feed Seller Banner */}
            {filteredListings.length === 0 ? (
              <EmptyState
                title="No listings matched your criteria"
                message="Try resetting your category or location filters, or be the first student to post!"
                actionText="Post an Item"
                onAction={() => setIsPostModalOpen(true)}
                secondaryText="View All Items"
                onSecondaryAction={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredListings.slice(0, 4).map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelectListing={setSelectedListing}
                  />
                ))}

                {/* In-Feed "Sell & Earn Cash" Banner (OLX Model) */}
                <InFeedSellBanner onPostClick={() => setIsPostModalOpen(true)} />

                {filteredListings.slice(4).map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelectListing={setSelectedListing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: Browse All Catalog */}
        {activeTab === "browse" && (
          <div className="animate-reveal-up text-left">
            <div className="mb-6">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121417]">
                Browse Campus Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore books, electronics, lab components, PG rooms, and cycles across campus
              </p>
            </div>

            <CategoryBar />
            <SearchFilterBar />

            {filteredListings.length === 0 ? (
              <EmptyState
                title="No items in this category"
                message="Be the first student to list in this category!"
                actionText="Post an Item"
                onAction={() => setIsPostModalOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelectListing={setSelectedListing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: Tanish Stationery Store (Student Catalog or Store Counter Dashboard) */}
        {activeTab === "store" && (
          <div className="animate-reveal-up">
            {isStoreMerchant ? (
              <TanishMerchantDashboard />
            ) : (
              <TanishStoreView />
            )}
          </div>
        )}

        {/* VIEW: Saved / Wishlist Items (OLX 1-Click Saved Tab) */}
        {activeTab === "saved" && (
          <div className="animate-reveal-up text-left">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121417] flex items-center gap-2">
                  <Heart className="w-7 h-7 text-[#FF5A1F] fill-[#FF5A1F]" />
                  <span>My Saved Wishlist ({savedListings.length})</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Items you have bookmarked for later comparison or deal discussions
                </p>
              </div>

              <button
                onClick={() => setActiveTab("browse")}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore More</span>
              </button>
            </div>

            {savedListings.length === 0 ? (
              <EmptyState
                title="Your Wishlist is Empty"
                message="Tap the heart icon on any listing card to save items you are interested in!"
                actionText="Browse Campus Items"
                onAction={() => setActiveTab("browse")}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {savedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelectListing={setSelectedListing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: My Listings */}
        {activeTab === "mylistings" && (
          <div className="animate-reveal-up">
            <MyListingsTabs
              onOpenPostModal={() => setIsPostModalOpen(true)}
              onSelectListing={setSelectedListing}
            />
          </div>
        )}

        {/* VIEW: Profile */}
        {activeTab === "profile" && (
          <div className="animate-reveal-up">
            <ProfileView
              onNavigateMyListings={() => setActiveTab("mylistings")}
            />
          </div>
        )}

      </main>

      {/* Modals & Slide-out Drawers */}
      <ItemDetailModal
        listing={selectedListing}
        isOpen={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
        onOpenReportModal={(listing) => {
          setSelectedListing(null);
          setReportListing(listing);
        }}
      />

      <PostItemModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostSuccess={(newItem) => {
          setSelectedListing(newItem);
        }}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenRatingModal={(dealInfo) => {
          setDealRatingPrompt(dealInfo);
        }}
      />

      <RatingModal
        isOpen={Boolean(dealRatingPrompt)}
        dealInfo={dealRatingPrompt}
        onClose={() => setDealRatingPrompt(null)}
        onSubmitRating={(ratingData) => {
          console.log("Rating submitted:", ratingData);
        }}
      />

      <ReportBlockModal
        isOpen={Boolean(reportListing)}
        targetListing={reportListing}
        onClose={() => setReportListing(null)}
      />

      {/* Floating 1-Click Chat & Deals Button (Visible across all dashboard tabs) */}
      <FloatingChatButton onOpenChat={() => setIsChatOpen(true)} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenChatDrawer={() => setIsChatOpen(true)}
        onOpenProfileView={() => setActiveTab("profile")}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <MainContent />
  );
}
