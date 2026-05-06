export default function PromoBanner({ title, discount, image, description, ctaText = 'READ MORE' }) {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          <p className="text-lg text-gray-800">
            {description}
          </p>
          {discount && (
            <div className="inline-flex items-center gap-4">
              <div className="bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg">
                <div className="text-sm font-bold text-gray-600">UP TO</div>
                <div className="text-3xl font-bold text-red-600">{discount}</div>
                <div className="text-xs text-gray-600">OFF</div>
              </div>
            </div>
          )}
          <button className="btn-primary self-start">
            {ctaText}
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={image || '/placeholder.png'}
            alt={title}
            className="max-w-full h-auto max-h-72 object-contain"
          />
        </div>
      </div>
    </div>
  )
}
