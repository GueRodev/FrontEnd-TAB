
import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Johnson',
    avatar: '/lovable-uploads/17088b0e-dee8-4716-b76d-00be5a07559d.png',
    comment: "My son absolutely loves the LEGO Star Wars collection. The quality is exceptional and the delivery was super fast. Couldn't be happier!",
    rating: 5,
    title: 'Thrilled with my purchase!'
  },
  {
    id: 't2',
    name: 'Mark Williams',
    avatar: '/lovable-uploads/51190e3f-2193-4b2a-85ac-e5453680e7bf.png',
    comment: "As a collector, I appreciate the care that goes into packaging these rare items. The Millennium Falcon set arrived in perfect condition.",
    rating: 5,
    title: 'Perfect for collectors'
  },
  {
    id: 't3',
    name: 'Emily Chen',
    avatar: '/lovable-uploads/9c75102e-2923-40ad-8aaf-ff7279ad2993.png',
    comment: "The customer service is outstanding. When I had a question about my order, they responded immediately and solved my issue.",
    rating: 4,
    title: 'Amazing customer service'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied customers about their shopping experience with us.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                  />
                ))}
              </div>
              
              <h3 className="font-bold text-lg text-brand-darkBlue mb-4">{testimonial.title}</h3>
              
              <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-orange/10">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-darkBlue">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
