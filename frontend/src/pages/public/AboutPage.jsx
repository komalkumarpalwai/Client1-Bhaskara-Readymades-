import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shirt, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Users, 
  Award, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Star 
} from 'lucide-react';
import { logo } from '../../assets/index.js';

const AboutPage = () => {
  const storePillars = [
    {
      icon: <Shirt className="w-6 h-6 text-indigo-600" />,
      title: "All-in-One Family Clothing",
      description: "From formal shirts for men and designer sarees for women to joyful festive wear for kids, we cater to every member of the family under one welcoming roof."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Strict Quality Inspection",
      description: "Every fabric and stitch is thoroughly inspected for durability, colorfastness, and skin-friendly comfort before it reaches our store hangers."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "Transparent & Honest Pricing",
      description: "Direct relationship with leading textile hubs across India enables us to provide the finest readymades at budget-friendly Ganapavaram prices."
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      title: "Personalized Customer Care",
      description: "Rooted in Saripalli, we treat every customer like family, helping you discover the ideal fit and style for your special celebrations."
    }
  ];

  const categoryHighlights = [
    {
      title: "Kids' Collection (Special Focus)",
      tag: "Vibrant, Joyful & Full Sets",
      desc: "Complete kids clothing destination: soft cotton daily wear, birthday gowns, party suits, ethnic pattu pavadas, and festive sets for boys and girls of all ages.",
      link: "/category/kids",
      bgGradient: "from-amber-900 to-orange-950",
      accent: "text-amber-300"
    },
    {
      title: "Women's Collection (Complete Range)",
      tag: "Elegance & Everyday Grace",
      desc: "Complete womenswear: exquisite handloom & daily wear sarees, trendy kurtis, anarkalis, festive dress materials, tops, and bottom wear.",
      link: "/category/women",
      bgGradient: "from-rose-900 to-purple-950",
      accent: "text-rose-300"
    },
    {
      title: "Men's Night Wear & Casuals",
      tag: "Comfort Essentials",
      desc: "Comfortable cotton nightwear, track pants, lungies, loungewear sets, and casual shirts for daily home comfort.",
      link: "/category/men",
      bgGradient: "from-slate-900 to-slate-950",
      accent: "text-slate-300"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-14 shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Welcome to Bhaskara Readymades • Saripalli, Ganapavaram</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Dressing Generations with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-indigo-300">Quality, Elegance & Trust</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Located on Sivalayam Street in Saripalli, Ganapavaram, <strong className="text-white font-medium">Bhaskara Readymades</strong> is your trusted neighborhood destination for premier ready-to-wear clothing for Men, Women, and Children.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link 
              to="/products"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Clothing Collection</span>
            </Link>
            <Link 
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all inline-flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Visit Our Shop</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story & Heritage */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 flex items-center justify-center p-8 aspect-square">
            <img 
              src={logo} 
              alt="Bhaskara Readymades Heritage" 
              className="max-h-72 w-auto object-contain rounded-lg drop-shadow-md"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 text-white text-center text-xs">
              <p className="font-bold text-amber-300">Bhaskara Readymades</p>
              <p className="text-slate-300 text-[11px]">Sivalayam Street, Saripalli, Ganapavaram, AP</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Our Story</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              A Family Store Built on Community Roots & Genuine Value
            </h2>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            Founded with a passion to bring fashionable, durable, and affordable attire to the families of Saripalli and Ganapavaram, Bhaskara Readymades has grown into the region's preferred readymade garments center. 
          </p>

          <p className="text-slate-600 text-sm leading-relaxed">
            Whether preparing for a grand wedding, festive celebrations like Sankranti, Diwali, and Dasara, or picking up comfortable everyday wear for your children, our store offers an extensive variety of hand-picked apparel that combines traditional values with contemporary fashion trends.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="block text-2xl font-black text-indigo-600">100%</span>
              <span className="text-xs font-medium text-slate-600">Quality Checked</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="block text-2xl font-black text-amber-600">3-in-1</span>
              <span className="text-xs font-medium text-slate-600">Men, Women, Kids</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="block text-2xl font-black text-emerald-600">Ganapavaram</span>
              <span className="text-xs font-medium text-slate-600">Local Trusted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Why Shop With Us</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            The Bhaskara Readymades Commitment
          </h2>
          <p className="text-slate-500 text-sm">
            We are dedicated to making family clothing shopping effortless, comfortable, and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storePillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{pillar.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{pillar.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" /> Guaranteed Standard
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Showcases */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Our Collections</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tailored For Every Member Of Your Family
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryHighlights.map((cat, i) => (
            <div 
              key={i} 
              className={`rounded-2xl p-7 bg-gradient-to-br ${cat.bgGradient} text-white flex flex-col justify-between shadow-lg relative overflow-hidden group`}
            >
              <div className="space-y-4 relative z-10">
                <span className={`text-xs font-bold uppercase tracking-wider ${cat.accent}`}>
                  {cat.tag}
                </span>
                <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{cat.desc}</p>
              </div>

              <div className="mt-8 relative z-10">
                <Link 
                  to={cat.link}
                  className="inline-flex items-center text-xs font-bold text-white group-hover:text-amber-300 transition-colors"
                >
                  <span>Browse {cat.title}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location & Visit CTA */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Visit Our Store in Saripalli Today
          </h3>
          <p className="text-slate-300 text-sm">
            Experience our fabric quality and wide sizing ranges in person at Sivalayam Street, Saripalli, Ganapavaram.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 justify-center md:justify-start">
            <span className="flex items-center">
              <Clock className="w-4 h-4 text-amber-400 mr-1.5" /> 9:00 AM – 9:30 PM (All Days)
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 text-indigo-400 mr-1.5" /> Sivalayam Street, Ganapavaram, AP
            </span>
          </div>
        </div>

        <Link
          to="/contact"
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0 text-sm"
        >
          View Map & Directions →
        </Link>
      </section>
      </div>
    </div>
  );
};

export default AboutPage;

