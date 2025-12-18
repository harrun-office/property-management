function VendorCard({ vendor, onAssign, onEdit }) {
  return (
    <div className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow border border-stone-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-charcoal mb-1">{vendor.companyName}</h3>
          <p className="text-architectural mb-2">{vendor.contactName}</p>
          <p className="text-sm text-stone-600 mb-3">{vendor.email}</p>
          
          <div className="mb-3">
            <p className="text-sm font-medium text-charcoal mb-1">Service Types:</p>
            <div className="flex flex-wrap gap-2">
              {vendor.serviceTypes.map((type, idx) => (
                <span key={idx} className="px-2 py-1 bg-obsidian-100 text-obsidian-500 rounded text-xs capitalize">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {vendor.performanceRating > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-charcoal">Rating:</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= vendor.performanceRating ? 'text-brass-500' : 'text-stone-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-architectural">({vendor.performanceRating})</span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-3">
            <p className="text-sm text-architectural">
              {vendor.assignedProperties?.length || 0} properties assigned
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          vendor.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
          vendor.status === 'suspended' ? 'bg-error/20 text-error' :
          'bg-warning/20 text-warning'
        }`}>
          {vendor.status}
        </span>
      </div>

      <div className="flex space-x-2 pt-4 border-t border-stone-300">
        {onAssign && (
          <button
            onClick={() => onAssign(vendor)}
            className="flex-1 px-4 py-2 bg-obsidian-500 text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors text-sm"
          >
            Assign Property
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(vendor)}
            className="flex-1 px-4 py-2 bg-stone-200 text-charcoal rounded-lg hover:bg-stone-300 transition-colors text-sm"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default VendorCard;

