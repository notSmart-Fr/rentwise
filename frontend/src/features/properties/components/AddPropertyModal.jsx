import React from 'react';
import { usePropertyForm } from '../hooks/usePropertyForm';

const AddPropertyModal = ({ isOpen, onClose, onSuccess }) => {
  const { formData, isLoading, error, handleChange, handleSubmit } = usePropertyForm(null, () => {
    onSuccess();
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-90 flex justify-center bg-bg-base/60 backdrop-blur-md animate-fade-in">

      {/* 2. SCROLL CONTAINER: This is the invisible box that scrolls */}
      <div className="w-full h-full overflow-y-auto px-6 pb-20 pt-[120px]">

        {/* 3. THE FORM CARD: The actual visible modal card */}
        <div className="relative w-full max-w-2xl mx-auto rounded-2xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10 animate-zoom-in">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">List New Property</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-2xl text-slate-400 transition-all hover:rotate-90 hover:bg-red-500 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/20 p-4 text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Apartment in Gulshan"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all placeholder:text-slate-600 focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary/10"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Banani"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Rent (৳)</label>
                <input
                  type="number"
                  name="rent_amount"
                  value={formData.rent_amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address Details</label>
                <input
                  type="text"
                  name="address_text"
                  value={formData.address_text}
                  onChange={handleChange}
                  placeholder="Specific location/street name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell tenants about your beautiful home..."
                  className="w-full resize-y min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Image URLs (One per line)</label>
                <textarea
                  name="image_urls"
                  value={formData.image_urls}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Paste image links here..."
                  className="w-full resize-y min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none font-mono"
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-white/5 pt-8">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-6 py-3 font-bold text-slate-400 transition-all hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Add Property'}
              </button>
            </div>
          </form>
        </div> {/* End of Form Card */}
      </div> {/* End of Scroll Container */}
    </div> /* End of Backdrop */
  );
};

export default AddPropertyModal;