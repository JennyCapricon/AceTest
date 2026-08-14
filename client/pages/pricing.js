import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { CheckCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '₦0',
    period: 'forever',
    features: ['Up to 50 students', '5 exams per month', 'Basic analytics', 'Email support', 'Standard security'],
    cta: 'Get Started',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: 'School',
    price: '₦20,000',
    period: '/month',
    features: ['Up to 500 students', 'Unlimited exams', 'Advanced analytics', 'Priority support', 'Question bank access', 'Custom branding', 'Bulk student import'],
    cta: 'Start Free Trial',
    href: '/auth/register',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '₦50,000',
    period: '/month',
    features: ['Unlimited students', 'Unlimited exams', 'Real-time analytics', 'Dedicated support', 'Full question bank', 'Multi-school management', 'API access', 'SLA guarantee', 'On-premise option'],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
  },
];

const faqs = [
  { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'Is there a free trial for paid plans?', a: 'Absolutely! We offer a 14-day free trial on the School plan with no credit card required.' },
  { q: 'Do you offer discounts for multiple schools?', a: 'Yes, we provide special pricing for school groups and districts. Contact our sales team for a custom quote.' },
  { q: 'What payment methods do you accept?', a: 'We accept bank transfers, debit/credit cards, and mobile money payments. Enterprise plans can be invoiced.' },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-6 py-4 text-left">
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-4 text-gray-600 text-sm">{answer}</div>}
    </div>
  );
}

export default function Pricing() {
  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">No hidden fees. No surprises. Choose the plan that works for your school.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
