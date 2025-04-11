
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Mail } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail('');
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
    }, 1000);
  };

  return (
    <section className="py-16 bg-brand-yellow/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange text-white rounded-full mb-6">
            <Mail size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-darkBlue mb-4">
            Stay Updated With Our Newsletter
          </h2>
          <p className="text-gray-600 mb-8">
            Get the latest updates on new arrivals, exclusive offers, and building inspiration delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow shadow-sm focus:ring-2 focus:ring-brand-orange"
            />
            <Button 
              type="submit" 
              className="bg-brand-orange hover:bg-brand-darkBlue transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
