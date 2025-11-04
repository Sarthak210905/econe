import { Link } from 'react-router-dom';
import { 
  MapIcon,
  ExclamationTriangleIcon, 
  SunIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: MapIcon,
      title: 'Plant Tracking',
      description: 'Register and monitor tree plantations with real-time geolocation and growth analytics',
      link: '/plantations',
      color: 'bg-green-100 text-green-600',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: ExclamationTriangleIcon,
      title: 'Grievance System',
      description: 'Report environmental issues and track resolutions with automated updates',
      link: '/grievances',
      color: 'bg-orange-100 text-orange-600',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: SunIcon,
      title: 'Solar Feasibility',
      description: 'AI-powered solar panel installation feasibility analysis for your location',
      link: '/solar',
      color: 'bg-yellow-100 text-yellow-600',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Pollution Monitor',
      description: 'Real-time air quality monitoring with predictive analytics and alerts',
      link: '/pollution',
      color: 'bg-blue-100 text-blue-600',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  const benefits = [
    'Real-time environmental monitoring',
    'AI-powered predictive analytics',
    'Community-driven initiatives',
    'Government-verified data',
    'Mobile-first responsive design',
    '24/7 automated support'
  ];

  const stats = [
    { value: '10,000+', label: 'Trees Planted', color: 'text-green-600' },
    { value: '5,000+', label: 'Issues Resolved', color: 'text-blue-600' },
    { value: '50+', label: 'Wards Covered', color: 'text-purple-600' },
    { value: '95%', label: 'User Satisfaction', color: 'text-orange-600' }
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section - Full Screen */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8 border border-white/30 animate-fade-in">
              <SparklesIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Sustainable City Management Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Building a Greener Future with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                EcoNE
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-green-50 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive environmental monitoring, intelligent plantation tracking, 
              and data-driven sustainable solutions for modern cities
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/register"
                className="group px-8 py-4 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Get Started Free
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-green-50 mb-12">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">Trusted by 50+ Wards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">Government Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="text-sm">ISO Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDownIcon className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Features Section - Full Screen */}
      <div className="min-h-screen flex items-center justify-center bg-white py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Comprehensive Environmental Solutions
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Powerful tools designed to help municipalities and citizens create sustainable, 
              data-driven environmental impact
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center text-green-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                    <span>Explore</span>
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section - Full Screen */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Why Choose EcoNE?
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Experience the future of environmental management with cutting-edge 
                technology and community-focused solutions
              </p>
              
              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Your Journey
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>

            {/* Right Content - Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105"
                >
                  <p className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Full Screen */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-700 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl md:text-2xl text-green-50 mb-12 max-w-2xl mx-auto">
            Join thousands of citizens and municipalities creating a sustainable future together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="px-10 py-5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/solar"
              className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Features
            </Link>
          </div>

          {/* Additional Trust Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-3xl font-bold text-white mb-2">99.9%</p>
              <p className="text-green-50">Uptime Guarantee</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-3xl font-bold text-white mb-2">24/7</p>
              <p className="text-green-50">Support Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-3xl font-bold text-white mb-2">Free</p>
              <p className="text-green-50">Forever Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
