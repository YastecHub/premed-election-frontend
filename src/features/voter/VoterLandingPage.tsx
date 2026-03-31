import React from 'react';
import { UserPlus, Vote, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

interface VoterLandingPageProps {
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

export const VoterLandingPage: React.FC<VoterLandingPageProps> = ({
  onNavigateToRegister,
  onNavigateToLogin
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 tracking-tight">
            Pre-MedElect
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Your voice matters. Choose your path to participate in the election.
          </p>
        </div>

        {/* Two-Card Layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: Register & Verify */}
          <div 
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-100 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 cursor-pointer animate-in fade-in slide-in-from-left duration-700"
            onClick={onNavigateToRegister}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8 md:p-10">
              {/* Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl w-fit shadow-lg">
                  <UserPlus className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                Register & Verify
              </h2>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
                First time? Register and verify your identity to get started.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-3 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Quick registration with your student details</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Instant OCR verification of your ID</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Get verified before election day</span>
                </li>
              </ul>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 active:scale-95">
                <span>Register Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Login to Vote */}
          <div 
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-purple-50/50 border-2 border-purple-100 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer animate-in fade-in slide-in-from-right duration-700"
            onClick={onNavigateToLogin}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8 md:p-10">
              {/* Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl w-fit shadow-lg">
                  <Vote className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">
                Login to Vote
              </h2>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
                Already registered? Log in with your Matric Number to cast your vote.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start space-x-3 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Quick login with your matric number</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Secure and encrypted voting process</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-slate-600">
                  <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Cast your vote when election is active</span>
                </li>
              </ul>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105 active:scale-95">
                <span>Login to Vote</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12 animate-in fade-in duration-1000 delay-300">
          <p className="text-sm text-slate-500 mb-4">
            Need help? Contact the election administrator for assistance.
          </p>
          <a
            href="https://wa.me/09068913009"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-green-500/50"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
