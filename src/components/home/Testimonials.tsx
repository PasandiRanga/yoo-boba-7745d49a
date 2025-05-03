
const testimonials = [
  {
    quote:
      "YooBoba's pearls have become a staple in our bubble tea shops. The consistency and quality are unmatched, and our customers can taste the difference.",
    author: "Sarah Chen",
    title: "Owner, Bubble Tea House",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Since switching to YooBoba, our sales have increased by 30%. Their pearls maintain the perfect chewy texture even hours after preparation.",
    author: "David Wong",
    title: "CEO, Tea Time Cafes",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    quote:
      "The customer service at YooBoba is exceptional. They've helped us with rush orders multiple times and always deliver on time.",
    author: "Lisa Park",
    title: "Operations Manager, Boba Bliss",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-yooboba-blue/10 via-yooboba-purple/10 to-yooboba-pink/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">
            Don't just take our word for it. Here's what bubble tea shop owners say about YooBoba.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="mt-4 flex text-yooboba-purple">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
