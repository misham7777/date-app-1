"use client";

import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Highlight } from "@/components/ui/hero-highlight";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trackSearch, searchTrackingService } from "@/lib/search-tracking";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    searchType: 'partner'
  });
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      try {
        // Track search
        await trackSearch({
          session_id: searchTrackingService['sessionId'],
          name: formData.name.trim(),
          email: formData.email || undefined,
          search_type: formData.searchType as 'partner' | 'friend' | 'family',
          source_page: 'home'
        });

        // Navigate to quiz with the form data
        const params = new URLSearchParams({
          name: formData.name.trim(),
          searchType: formData.searchType
        });
        router.push(`/quiz?${params.toString()}`);
      } catch (error) {
        console.error('Error tracking lead:', error);
        // Still navigate even if tracking fails
        const params = new URLSearchParams({
          name: formData.name.trim(),
          searchType: formData.searchType
        });
        router.push(`/quiz?${params.toString()}`);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full pt-8 pb-4 md:pt-16 md:pb-8" data-hero-section>
      <div className="w-full px-4 md:px-6 md:container md:mx-auto overflow-hidden">
        <div className="grid grid-cols-1 gap-4 md:gap-6 items-center lg:grid-cols-2">
          <div className="flex gap-4 flex-col order-1 lg:order-1">
            <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Badge variant="outline" className="animate-pulse">🔍 Investigation Ready</Badge>
            </div>
            <div className={`flex gap-3 flex-col transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-left font-bold leading-tight">
                This is the moment you discover the truth!
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground text-left">
                Stop wondering if your partner is hiding something online. Avoid sleepless nights and endless worry by using outdated, single-app search methods.{" "}
                <Highlight className="text-black dark:text-white">
                  Our goal is to provide complete relationship transparency, making it faster and more comprehensive than ever.
                </Highlight>
              </p>
            </div>
          </div>
          
          {/* Lead Generation Form */}
          <div className={`order-2 lg:order-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative w-full max-w-sm mx-auto lg:max-w-md">
              {/* White Card Container */}
              <form onSubmit={handleSubmit} className="relative rounded-2xl bg-white shadow-xl p-6 lg:p-1.5">
                {/* Header */}
                <div className="text-center mb-4 lg:mb-1.5">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                    Who are you searching for?
                  </h3>
                </div>
                
                {/* Gender Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4 lg:mb-1.5">
                  {/* Woman Card */}
                  <button
                    type="button"
                    onClick={() => handleInputChange('searchType', 'woman')}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                      formData.searchType === 'woman' 
                        ? 'ring-4 ring-pink-500 shadow-lg' 
                        : 'shadow-md'
                    }`}
                  >
                    <div className={`absolute inset-0 ${
                      formData.searchType === 'woman' 
                        ? 'bg-pink-500' 
                        : 'bg-gray-200'
                    }`}>
                      <img
                        src="/l1QD6KFgUXDpcVfAprHnTmoe70.avif"
                        alt="Woman"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <span className={`text-lg font-bold ${
                        formData.searchType === 'woman' 
                          ? 'text-white' 
                          : 'text-gray-900'
                      }`}>
                        WOMAN
                      </span>
                    </div>
                  </button>
                  
                  {/* Man Card */}
                  <button
                    type="button"
                    onClick={() => handleInputChange('searchType', 'man')}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                      formData.searchType === 'man' 
                        ? 'ring-4 ring-blue-500 shadow-lg' 
                        : 'shadow-md'
                    }`}
                  >
                    <div className={`absolute inset-0 ${
                      formData.searchType === 'man' 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                    }`}>
                      <img
                        src="/vg4dSvxo1lLXFbF9LkXHZFJJyYA.avif"
                        alt="Man"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <span className={`text-lg font-bold ${
                        formData.searchType === 'man' 
                          ? 'text-white' 
                          : 'text-gray-900'
                      }`}>
                        MAN
                      </span>
                    </div>
                  </button>
                </div>
                
                {/* Name Input */}
                <div className="mb-4 lg:mb-1.5">
                  <Input
                    type="text"
                    placeholder="Enter their first name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex flex-col items-center">
                    <span>Start search</span>
                    <span className="text-sm font-normal opacity-90">Get your report in 3 min.</span>
                  </div>
                  <MoveRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
