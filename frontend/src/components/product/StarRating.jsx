import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, readOnly = true, size = 16, onRatingChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => !readOnly && onRatingChange?.(i)}
          className={!readOnly ? 'cursor-pointer' : ''}
          disabled={readOnly}
        >
          <Star
            size={size}
            className={
              i <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}
