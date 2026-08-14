import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Monitor, CheckCircle, Database, BarChart3, Shield, Building2, Star, ChevronRight, Mail, Phone } from 'lucide-react';

const features = [
  { icon: Monitor, title: 'Computer-Based Testing', description: 'Conduct seamless digital exams with an intuitive interface designed for both students and teachers.' },
  { icon: CheckCircle, title: 'Auto Grading', description: 'Save time with instant grading for multiple-choice and automated evaluation for subjective answers.' },
  { icon: Database, title: 'Question Bank', description: 'Build and manage a rich repository of questions with support for various formats and categories.' },
  { icon: BarChart3, title: 'Real-Time Analytics', description: 'Track student performance with detailed reports and actionable insights as exams progress.' },
  { icon: Shield, title: 'Secure Platform', description: 'Enterprise-grade security with anti-cheating measures, encrypted data, and role-based access.' },
  { icon: Building2, title: 'Multi-School Support', description: 'Manage multiple schools, departments, and classes from a single centralized dashboard.' },
];

const stats = [
  { value: '10,000+', label: 'Students' },
  { value: '500+', label: 'Schools' },
  { value: '50,000+', label: 'Exams Taken' },
  { value: '99.9%', label: 'Uptime' },
];

const testimonials = [
  { name: 'Dr. Adebayo O.', role: 'Principal, Lagos High School', text: 'AceTest has revolutionized how we conduct examinations. The auto-grading feature alone has saved us countless hours.' },
  { name: 'Mrs. Chidinma E.', role: 'Head of Academics, Excel College', text: 'The analytics dashboard gives us insights we never had before. We can now identify struggling students early.' },
  { name: 'Mr. Samuel K.', role: 'IT Director, Greenfield Schools', text: 'Security was our biggest concern, but AceTest exceeded our expectations. Highly recommended for any institution.' },
];

const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    features: ['Up to 50 students', '5 exams per month', 'Basic analytics', 'Email support'],
    cta: 'Get Started',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'School',
    price: '₦20,000',
    period: '/month',
    features: ['Up to 500 students', 'Unlimited exams', 'Advanced analytics', 'Priority support', 'Question bank access', 'Custom branding'],
    cta: 'Start Free Trial',
    href: '/auth/register',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '₦50,000',
    period: '/month',
    features: ['Unlimited students', 'Unlimited exams', 'Real-time analytics', 'Dedicated support', 'Full question bank', 'Multi-school management', 'API access', 'SLA guarantee'],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
  },
];

export default function Home() {
  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ace Your Exams with <span className="text-primary-600">AceTest</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Modern Computer-Based Testing Platform for Schools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary btn-lg">
                Get Started <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
              <Link href="/about" className="btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Powerful features designed to make exam management effortless for schools of all sizes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Schools Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Trusted by educators across Nigeria.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-6">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your school best.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`card p-8 flex flex-col ${plan.highlight ? 'ring-2 ring-primary-500 relative' : ''}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-accent-500 mr-2 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`${plan.highlight ? 'btn-primary' : 'btn-outline'} w-full justify-center`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Contact us today to schedule a demo or ask any questions.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-300">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-400" />
              <span>support@acetest.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-400" />
              <span>+234 800 123 4567</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
