'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  GraduationCap, 
  Heart, 
  Users, 
  Target, 
  Award,
  Globe,
  Lightbulb,
  Shield,
  TrendingUp,
  BookOpen,
  Star,
  CheckCircle,
  ArrowRight,
  Quote,
  MapPin,
  Mail,
  Phone,
  Calendar
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Nimal Perera",
      role: "Founder & CEO",
      bio: "Former university professor with 20+ years in education technology",
      image: "/team/nimal.jpg",
      education: "PhD in Educational Technology, Stanford University"
    },
    {
      name: "Sarah Fernando",
      role: "COO",
      bio: "Experienced operations manager from the nonprofit sector",
      image: "/team/sarah.jpg",
      education: "MBA, University of Colombo"
    },
    {
      name: "Kamal Rajapakse",
      role: "CTO",
      bio: "Full-stack developer passionate about social impact technology",
      image: "/team/kamal.jpg",
      education: "BSc Computer Science, MIT"
    },
    {
      name: "Anushka Liyanage",
      role: "Head of Partnerships",
      bio: "Expert in building educational partnerships across Sri Lanka",
      image: "/team/anushka.jpg",
      education: "MA in International Education, Columbia University"
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description: "EduSponsor founded with a vision to transform educational access in Sri Lanka"
    },
    {
      year: "2021",
      title: "First Pilot",
      description: "Launched pilot program with 50 students and 30 donors"
    },
    {
      year: "2022",
      title: "Platform Launch",
      description: "Official platform launch with point-based system and vendor partnerships"
    },
    {
      year: "2023",
      title: "Major Expansion",
      description: "Expanded to 500+ students and 350+ active donors nationwide"
    },
    {
      year: "2024",
      title: "Innovation Hub",
      description: "Launched investment features and AI-powered matching system"
    }
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Compassion",
      description: "We believe in the power of empathy and genuine care for students' futures"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Transparency",
      description: "Every donation is tracked and reported with complete transparency"
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Impact",
      description: "We focus on measurable outcomes and lasting educational impact"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Community",
      description: "Building a supportive network of donors, students, and partners"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: "Innovation",
      description: "Continuously improving our platform and approach to educational support"
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-500" />,
      title: "Accessibility",
      description: "Making quality education accessible to all deserving students"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transforming Education,
            </span>
            <br />
            <span className="text-gray-900">One Student at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            EduSponsor was born from a simple belief: every deserving student deserves access to quality education, 
            regardless of their financial circumstances. We're building a bridge between compassionate donors and ambitious students across Sri Lanka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
              <Link href="/register/donor">
                <Heart className="mr-2 h-5 w-5" />
                Join Our Mission
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold" asChild>
              <Link href="/how-it-works">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                  Our Purpose
                </Badge>
                <h2 className="text-4xl font-bold mb-6">Mission & Vision</h2>
              </div>
              
              <Card className="border-l-4 border-l-blue-600 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Target className="mr-3 h-6 w-6 text-blue-600" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To democratize access to quality education in Sri Lanka by connecting compassionate donors 
                    with deserving students through an innovative, transparent, and impactful platform that 
                    provides comprehensive support beyond just financial assistance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-600 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Globe className="mr-3 h-6 w-6 text-purple-600" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    A Sri Lanka where every student, regardless of their economic background, has the 
                    opportunity to pursue their educational dreams and build a brighter future for themselves 
                    and their communities through accessible, quality education.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">500+</div>
                    <p className="text-lg text-gray-700">Students Supported</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-3xl font-bold text-green-600">350+</div>
                      <p className="text-sm text-gray-600">Active Donors</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">25K</div>
                      <p className="text-sm text-gray-600">Monthly Impact ($)</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
                    <p className="text-lg text-gray-700">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
              What We Stand For
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every action we take as we work towards our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              Our Journey
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Milestones & Achievements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to a movement transforming education across Sri Lanka.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-400"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 pr-8">
                    <Card className="hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-800">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
              Meet Our Team
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Passionate People Making a Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team brings together expertise in education, technology, and social impact to create meaningful change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{member.bio}</p>
                  <div className="text-xs text-gray-500 italic">{member.education}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white text-blue-600">
              Get in Touch
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Whether you're interested in becoming a donor, partner, or team member, we'd love to hear from you. 
              Together, we can create lasting educational impact across Sri Lanka.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
                <Link href="/register/donor">
                  <Heart className="mr-2 h-5 w-5" />
                  Become a Donor
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}