import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Target, Eye, Monitor, CheckCircle, Database, BarChart3, Users } from 'lucide-react';

const features = [
  { icon: Monitor, title: 'Modern Testing', description: 'Replace paper-based exams with a seamless digital experience.' },
  { icon: CheckCircle, title: 'Automated Grading', description: 'Instant results with zero manual effort.' },
  { icon: Database, title: 'Rich Question Bank', description: 'Thousands of questions at your fingertips.' },
  { icon: BarChart3, title: 'Deep Analytics', description: 'Actionable insights to improve student outcomes.' },
];

const team = [
  { name: 'Tunde Adeyemi', role: 'CEO & Co-Founder' },
  { name: 'Funmi Okafor', role: 'CTO & Co-Founder' },
  { name: 'Chidi Okonkwo', role: 'Head of Product' },
  { name: 'Zainab Abdullah', role: 'Head of Engineering' },
];

export default function About() {
  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About AceTest</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are on a mission to transform how schools conduct and manage examinations across Africa.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To empower educational institutions with accessible, secure, and intelligent technology that simplifies exam management, enhances academic integrity, and provides actionable insights for continuous improvement.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-accent-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the leading computer-based testing platform in Africa, powering fair and efficient assessments for millions of students across the continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AceTest</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Built by educators, for educators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Passionate people building the future of education.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="card p-6 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
