import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'John Kariuki',
      role: 'Tech Enthusiast',
      content: 'Excellent quality products and superb customer service. My MacBook arrived in perfect condition and with great value for money.',
      rating: 5,
      avatar: '👨‍💻',
    },
    {
      id: 2,
      name: 'Sarah Kipchoge',
      role: 'Entrepreneur',
      content: 'Best place to buy tech in Kenya. The Dell laptop I purchased runs perfectly and the after-sales support is outstanding.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      id: 3,
      name: 'Mike Nganga',
      role: 'Software Developer',
      content: 'Fast delivery, genuine products, and competitive pricing. I recommend Nixxon Technologies to all my colleagues. Worth every penny!',
      rating: 5,
      avatar: '👨‍💻',
    },
  ]

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Loved by Thousands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read what our happy customers have to say about their experience shopping with Nixxon Technologies
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Quote icon */}
              <Quote size={24} className="text-blue-600 mb-4" />

              {/* Content */}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {testimonial.content}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 pt-16 border-t grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <p className="text-gray-600">Products Sold</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}
