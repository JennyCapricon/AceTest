import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div>
      <Navbar />

      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="label" htmlFor="name">Full Name</label>
                  <input id="name" type="text" className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email Address</label>
                  <input id="email" type="email" className="input" placeholder="you@school.com" />
                </div>
                <div>
                  <label className="label" htmlFor="subject">Subject</label>
                  <input id="subject" type="text" className="input" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="label" htmlFor="message">Message</label>
                  <textarea id="message" rows={5} className="input min-h-[120px]" placeholder="Tell us more..." />
                </div>
                <button type="submit" className="btn-primary btn-lg w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">support@acetest.com</p>
                      <p className="text-gray-600">hello@acetest.com</p>
                    </div>
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">+234 800 123 4567</p>
                      <p className="text-gray-600">+234 800 765 4321</p>
                    </div>
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">42 Marina Street</p>
                      <p className="text-gray-600">Lagos Island, Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
