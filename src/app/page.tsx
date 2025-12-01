'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  GraduationCap, 
  Heart, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock,
  Star,
  Award,
  BookOpen,
  Target,
  Globe,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Quote,
  Play
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  🎓 Transforming Education in Sri Lanka
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Empower Dreams,
                  </span>
                  <br />
                  <span className="text-gray-900">Change Lives</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Connect passionate donors with deserving students. Your $50 monthly sponsorship becomes 50,000 points that directly fund educational resources, health insurance, and future investments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
                  <Link href="/register/donor">
                    <Heart className="mr-2 h-5 w-5" />
                    Become a Sponsor
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold" asChild>
                  <Link href="/register/student">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Apply for Support
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">100% Transparent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Secure Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600">500+ Students</span>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Monthly Impact</p>
                        <p className="text-sm text-gray-500">Your $50 contribution</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Educational Resources</span>
                      <span className="font-semibold">20,000 pts</span>
                    </div>
                    <Progress value={40} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Health Insurance</span>
                      <span className="font-semibold">15,000 pts</span>
                    </div>
                    <Progress value={30} className="h-3" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Future Investments</span>
                      <span className="font-semibold">15,000 pts</span>
                    </div>
                    <Progress value={30} className="h-3" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Monthly Points</span>
                      <span className="font-bold text-2xl text-blue-600">50,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
              Simple & Effective
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How EduSponsor Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our innovative platform connects donors with students through a transparent point-based system that maximizes educational impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition-colors">
                1
              </div>
              <CardHeader className="pt-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Join the Community</CardTitle>
                <CardDescription className="text-lg">
                  Students create detailed profiles sharing their educational aspirations. Donors register to become sponsors and make a lasting difference.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:bg-purple-700 transition-colors">
                2
              </div>
              <CardHeader className="pt-12 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Connect & Support</CardTitle>
                <CardDescription className="text-lg">
                  Donors are intelligently matched with students. Your $50 monthly donation converts to 50,000 points for comprehensive support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:bg-green-700 transition-colors">
                3
              </div>
              <CardHeader className="pt-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Watch the Impact</CardTitle>
                <CardDescription className="text-lg">
                  Track your impact in real-time. Points fund education, health insurance, and investments that secure students' futures.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Collective Impact
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Together, we're creating a brighter future for students across Sri Lanka through education and opportunity.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Students Supported</div>
              <div className="text-sm opacity-75 mt-1">Across Sri Lanka</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">350+</div>
              <div className="text-lg opacity-90">Active Donors</div>
              <div className="text-sm opacity-75 mt-1">Monthly Sponsors</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">$25K</div>
              <div className="text-lg opacity-90">Monthly Impact</div>
              <div className="text-sm opacity-75 mt-1">Direct Support</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-lg opacity-90">Success Rate</div>
              <div className="text-sm opacity-75 mt-1">Student Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
              Comprehensive Support
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              More Than Just Funding
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our holistic approach ensures students receive complete support for their educational journey and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Educational Resources</CardTitle>
                <CardDescription>
                  Access to textbooks, online courses, tutoring, and learning materials that enhance academic performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Health Insurance</CardTitle>
                <CardDescription>
                  Comprehensive health coverage ensuring students stay healthy and focused on their studies without medical worries.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Future Investments</CardTitle>
                <CardDescription>
                  Automatic investment of unused points creates financial security and opportunities for post-graduation success.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Globe className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Local Vendor Network</CardTitle>
                <CardDescription>
                  Partnerships with local bookstores, tech shops, and service providers for easy access to educational resources.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Lightbulb className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Mentorship Program</CardTitle>
                <CardDescription>
                  Connect students with experienced mentors who provide guidance, career advice, and personal development support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Achievement Tracking</CardTitle>
                <CardDescription>
                  Monitor academic progress, celebrate milestones, and recognize achievements to motivate continued success.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transforming Lives, One Student at a Time
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the students and donors whose lives have been transformed through the EduSponsor platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-blue-200 mb-4" />
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "EduSponsor made my dream of becoming an engineer a reality. The support I received went beyond just financial assistance - I gained a community that believes in me."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">NK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Nimal Kumarasinghe</p>
                    <p className="text-sm text-gray-600">Engineering Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-purple-200 mb-4" />
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "As a donor, I love seeing exactly how my contribution is making a difference. The transparency and impact tracking is incredible - I know I'm changing lives."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">SF</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Fernando</p>
                    <p className="text-sm text-gray-600">Monthly Sponsor</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-green-200 mb-4" />
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "The health insurance coverage alone has been life-changing. I can focus on my studies without worrying about medical emergencies. Thank you, EduSponsor!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Anusha Liyanage</p>
                    <p className="text-sm text-gray-600">Medical Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white text-blue-600">
              Join the Movement
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Be Part of the Change
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Whether you're looking to support the next generation of leaders or seeking educational opportunities, 
              EduSponsor provides the platform to make meaningful impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
                <Link href="/register/donor">
                  <Heart className="mr-2 h-5 w-5" />
                  Become a Sponsor
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold" asChild>
                <Link href="/register/student">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Apply for Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}