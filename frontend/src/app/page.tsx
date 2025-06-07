'use client';

import Link from 'next/link';
import { Sparkles, Mail, MessageSquare, Zap, Shield, Clock, ArrowRight, CheckCircle, Star, Users, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';

// Animation hook for intersection observer - simplified for less intrusive animations
function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, { threshold: 0.3, ...options }); // Higher threshold for smoother experience

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [hasIntersected, options]);

  return [elementRef, isIntersecting, hasIntersected] as const;
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: string; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, , hasIntersected] = useIntersectionObserver();

  useEffect(() => {
    if (!hasIntersected) return;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = parseInt(end.replace(/[^\d]/g, ''));

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [hasIntersected, end, duration]);

  return (
    <div ref={ref} className="text-3xl font-bold text-white mb-2">
      {end.includes('K') ? `${count}K` : 
       end.includes('%') ? `${count}%` : 
       end.includes('M') ? `${count}M` : count}{suffix}
    </div>
  );
}

// Gentle fade-in animation wrapper - much less intrusive
function FadeInOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, , hasIntersected] = useIntersectionObserver({ threshold: 0.2 });
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        hasIntersected 
          ? 'opacity-100' 
          : 'opacity-80'
      }`}
      style={{ 
        transitionDelay: hasIntersected ? `${delay}ms` : '0ms'
      }}
    >
      {children}
    </div>
  );
}

// Continuously moving carousel component
function MovingCarousel({ 
  items, 
  direction = 'left', 
  speed = 50,
  className = ""
}: { 
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className={`flex gap-12 whitespace-nowrap ${
          direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
        }`}
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {/* Render items twice for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div 
            key={index}
            className="text-slate-500 font-semibold text-xl hover:text-slate-300 transition-colors cursor-pointer flex-shrink-0"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// Moving testimonials carousel
function MovingTestimonials() {
  const testimonials = [
    {
      quote: "Gmail AI transformed our sales process. We've seen a 150% increase in response rates and saved 20+ hours per week.",
      author: "Sarah Chen",
      role: "VP of Sales",
      company: "TechCorp"
    },
    {
      quote: "The AI understands context better than any tool we've used. It's like having a personal assistant for every team member.",
      author: "Michael Rodriguez",
      role: "Head of Operations", 
      company: "StartupXYZ"
    },
    {
      quote: "Enterprise-grade security with consumer-grade simplicity. Our IT team loves the compliance features.",
      author: "Jennifer Kim",
      role: "CISO",
      company: "Fortune 500 Co."
    },
    {
      quote: "We increased our email efficiency by 300% and our team couldn't be happier with the results.",
      author: "David Park",
      role: "CEO",
      company: "InnovateLabs"
    },
    {
      quote: "The best investment we've made for our communication workflow. ROI was immediate.",
      author: "Lisa Wang",
      role: "CTO",
      company: "ScaleUp Inc"
    },
    {
      quote: "Gmail AI handles complex email threads with incredible accuracy. It's revolutionized our customer support.",
      author: "Alex Thompson",
      role: "Support Director",
      company: "CustomerFirst"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-8 animate-scroll-left" style={{ animationDuration: '60s' }}>
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <Card key={index} className="flex-shrink-0 w-96 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 group">
            <CardContent className="p-6">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-slate-300 mb-4 leading-relaxed italic text-sm group-hover:text-white transition-colors">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-sm">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-slate-400 text-xs">{testimonial.role} • {testimonial.company}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Parallax background component
function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0002})` }}
      ></div>
    </div>
  );
}

export default function Home() {
  const [heroRef, , heroIntersected] = useIntersectionObserver();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header - Enhanced with Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 holographic-element rounded-xl flex items-center justify-center glow-effect transition-all duration-500 hover:scale-110 hover:rotate-12">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-900 animate-pulse glow-cyan"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-white futuristic-text">Gmail AI</span>
                <Badge variant="secondary" className="ml-2 text-xs glass-badge">
                  Neural
                </Badge>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="nav-link-futuristic">
                Features
                <span className="holographic-underline"></span>
              </Link>
              <Link href="#solutions" className="nav-link-futuristic">
                Solutions
                <span className="holographic-underline"></span>
              </Link>
              <Link href="#pricing" className="nav-link-futuristic">
                Pricing
                <span className="holographic-underline"></span>
              </Link>
              <Link href="/chat" className="nav-link-futuristic">
                Neural Interface
                <span className="holographic-underline"></span>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="glass-button hidden sm:flex">
                Connect
              </Button>
              <Link href="/chat">
                <Button className="neural-button group">
                  Initialize
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={heroRef} className="text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className={`flex items-center justify-center gap-2 mb-8 transition-all duration-1000 ${heroIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-1 hover:scale-105 transition-transform duration-300">
                <CheckCircle className="mr-2 h-3 w-3" />
                Trusted by 10,000+ professionals
              </Badge>
            </div>

            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] transition-all duration-1000 delay-200 ${heroIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="spatial-text">Transcend</span> Communication
              <br />
              <span className="holographic-text">
                Neural Workflows
              </span>
            </h1>
            
            <p className={`text-xl sm:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto transition-all duration-1000 delay-400 ${heroIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Advanced neural architecture that reconstructs communication paradigms. 
              Synthesize contextual responses, orchestrate intelligent workflows, and amplify cognitive efficiency by 
              <span className="cyber-accent"> 300%</span>.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-600 ${heroIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link href="/chat">
                <Button size="lg" className="quantum-button group">
                  <div className="quantum-shimmer"></div>
                  <MessageSquare className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Initiate Neural Link</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-button-outline group"
              >
                <div className="glass-shimmer"></div>
                <Mail className="mr-3 h-6 w-6 relative z-10" />
                <span className="relative z-10">Preview Interface</span>
              </Button>
            </div>

            {/* Animated Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-800 ${heroIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {[
                { value: "10K+", label: "Active Users" },
                { value: "2M+", label: "Emails Processed" },
                { value: "99.9%", label: "Uptime" },
                { value: "70%", label: "Time Saved" }
              ].map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <AnimatedCounter end={stat.value} />
                  <div className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Parallax Background */}
        <ParallaxBackground />

        {/* Quantum Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60 glow-cyan"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-500 opacity-60 glow-effect"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-1000 opacity-60 glow-effect"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-700 opacity-40 glow-effect"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300 opacity-50 glow-effect"></div>
        
        {/* Neural Grid Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
        </div>
      </section>

      {/* Social Proof - Moving Carousel */}
      <section className="py-16 border-y border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <p className="text-center text-slate-400 mb-8 text-sm uppercase tracking-wider">
              Trusted by leading enterprises worldwide
            </p>
          </FadeInOnScroll>
          
          <MovingCarousel 
            items={[
              'Microsoft', 'Google', 'Amazon', 'Salesforce', 'Slack', 
              'Meta', 'Apple', 'Tesla', 'Netflix', 'Spotify',
              'Adobe', 'Zoom', 'HubSpot', 'Stripe', 'Shopify'
            ]}
            direction="left"
            speed={40}
            className="opacity-70 hover:opacity-90 transition-opacity duration-500"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <FadeInOnScroll>
              <Badge className="glass-badge mb-4">
                ⚡ Neural Capabilities
              </Badge>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                <span className="spatial-text">Quantum</span> Intelligence
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={400}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Engineered for visionary teams that transcend conventional boundaries through <span className="cyber-accent">cognitive amplification</span>
              </p>
            </FadeInOnScroll>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="h-8 w-8" />,
                title: "Contextual Synthesis Engine",
                description: "Neural architecture that deciphers semantic layers, emotional resonance, and implicit meaning with consciousness-level understanding.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Adaptive Flow Orchestration",
                description: "Self-evolving workflows that anticipate needs, adapt to behavioral patterns, and maintain authentic human essence.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: "Linguistic Resonance Matrix",
                description: "Generates authentic communications through tonal harmonization, semantic optimization, and brand consciousness.",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Quantum Security Fortress",
                description: "Military-grade encryption matrices, zero-trust architecture, and consciousness-level data sovereignty.",
                color: "from-red-500 to-orange-500"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Analytics & Insights",
                description: "Real-time productivity metrics, team performance analytics, and actionable insights dashboard.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Multi-language Support",
                description: "Native support for 40+ languages with cultural context awareness and localized templates.",
                color: "from-cyan-500 to-blue-500"
              }
            ].map((feature, index) => (
              <FadeInOnScroll key={index} delay={index * 100}>
                <Card className="group relative overflow-hidden glass-morphism hover:border-cyan-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 h-full">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:rotate-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors futuristic-text">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm"></div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <FadeInOnScroll>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">
                🚀 Use Cases
              </Badge>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Built for Every Team
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={400}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                From startups to Fortune 500 companies, see how teams leverage Gmail AI
              </p>
            </FadeInOnScroll>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-12 w-12" />,
                title: "Sales Teams",
                description: "Automate follow-ups, personalize outreach, and track engagement",
                features: ["Automated sequences", "Personalization at scale", "Performance analytics"],
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <MessageSquare className="h-12 w-12" />,
                title: "Customer Support",
                description: "Intelligent responses, ticket routing, and satisfaction tracking",
                features: ["Smart categorization", "Response templates", "Sentiment analysis"],
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <TrendingUp className="h-12 w-12" />,
                title: "Executives",
                description: "Priority management, executive summaries, and strategic insights",
                features: ["Priority detection", "Meeting prep", "Strategic summaries"],
                color: "from-purple-500 to-pink-500"
              }
            ].map((solution, index) => (
              <FadeInOnScroll key={index} delay={index * 200}>
                <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:rotate-6`}>
                      {solution.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {solution.title}
                    </h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {solution.description}
                    </p>
                    <ul className="space-y-3">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-slate-300 group-hover:text-white transition-colors duration-300" style={{ transitionDelay: `${featureIndex * 100}ms` }}>
                          <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Moving Carousel */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeInOnScroll>
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 mb-4">
                ⭐ Customer Success
              </Badge>
            </FadeInOnScroll>
            <FadeInOnScroll delay={200}>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Loved by Teams Worldwide
              </h2>
            </FadeInOnScroll>
            <FadeInOnScroll delay={400}>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Join thousands of professionals who've transformed their email workflow
              </p>
            </FadeInOnScroll>
          </div>
          
          <FadeInOnScroll delay={600}>
            <MovingTestimonials />
          </FadeInOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInOnScroll>
            <Badge className="glass-badge mb-6">
              🚀 Transcendence Awaits
            </Badge>
          </FadeInOnScroll>
          <FadeInOnScroll delay={200}>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-[1.1]">
              Ascend Beyond
              <br />
              <span className="holographic-text">
                Conventional Limits
              </span>
            </h2>
          </FadeInOnScroll>
          <FadeInOnScroll delay={400}>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Initiate neural synchronization. Zero friction deployment. Consciousness expansion in <span className="cyber-accent">180 seconds</span>.
              Unite with 10,000+ visionaries transcending communication paradigms.
            </p>
          </FadeInOnScroll>
          
          <FadeInOnScroll delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/chat">
                <Button size="lg" className="quantum-button group">
                  <div className="quantum-shimmer"></div>
                  <Sparkles className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Activate Neural Link</span>
                  <ArrowRight className="ml-3 h-6 w-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="glass-button-outline group">
                <div className="glass-shimmer"></div>
                <span className="relative z-10">Preview Consciousness</span>
              </Button>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={800}>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center hover:text-slate-300 transition-colors">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Free 14-day trial
              </div>
              <div className="flex items-center hover:text-slate-300 transition-colors">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center hover:text-slate-300 transition-colors">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Cancel anytime
              </div>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <FadeInOnScroll>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Gmail AI</span>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll delay={200}>
                <p className="text-slate-400 mb-4 max-w-md">
                  Revolutionizing email productivity with enterprise-grade AI. Transform how your team communicates and collaborates.
                </p>
              </FadeInOnScroll>
              <FadeInOnScroll delay={400}>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:scale-105 transition-transform duration-300">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    SOC 2 Compliant
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:scale-105 transition-transform duration-300">
                    99.9% Uptime
                  </Badge>
                </div>
              </FadeInOnScroll>
            </div>
            
            <div>
              <FadeInOnScroll delay={600}>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Features</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Enterprise</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">API</Link></li>
                </ul>
              </FadeInOnScroll>
            </div>
            
            <div>
              <FadeInOnScroll delay={800}>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">About</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Security</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 block">Contact</Link></li>
                </ul>
              </FadeInOnScroll>
            </div>
          </div>
          
          <FadeInOnScroll delay={1000}>
            <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2024 Gmail AI Assistant. All rights reserved. Built with Next.js and Enterprise AI.</p>
            </div>
          </FadeInOnScroll>
        </div>
      </footer>
    </div>
  );
}
