'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  GraduationCap, 
  Palette, 
  Globe, 
  Brain,
  CheckCircle,
  ArrowRight,
  Star,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function RiftUniPage() {
  const services = [
    {
      icon: Shield,
      title: 'AI Safety for Seniors',
      description: 'Navigate the digital world with confidence. Our specialized course teaches seniors how to safely and effectively use AI-powered tools, protecting them from online scams and misinformation while unlocking the benefits of modern technology for daily life.',
      features: [
        'Scam protection techniques',
        'AI tool mastery',
        'Digital confidence building',
        'Personal safety online',
        'Practical daily applications'
      ],
      benefits: [
        'Stay connected with family',
        'Access online services safely',
        'Learn new technologies',
        'Protect personal information',
        'Join digital communities'
      ],
      duration: '8 weeks',
      level: 'Beginner',
      price: '$299',
      color: 'bg-blue-100 text-blue-800',
      highlight: 'Most Popular'
    },
    {
      icon: GraduationCap,
      title: 'IELTS with AI',
      description: 'Achieve your target IELTS score faster. Our innovative course combines expert instruction with cutting-edge AI technology to provide personalized feedback, practice tests, and targeted lessons, helping you master the skills needed for success.',
      features: [
        'Personalized AI feedback',
        'Adaptive practice tests',
        'Expert instructor guidance',
        'Real-time progress tracking',
        'Comprehensive skill development'
      ],
      benefits: [
        'Achieve target score faster',
        'Personalized learning path',
        '24/7 AI assistance',
        'Confidence building',
        'Global opportunities'
      ],
      duration: '12 weeks',
      level: 'Intermediate',
      price: '$499',
      color: 'bg-green-100 text-green-800',
      highlight: 'AI-Powered'
    },
    {
      icon: Palette,
      title: 'Drawing Class for Kids',
      description: 'Spark your child\'s creativity! Our engaging drawing classes use a blend of fun, hands-on techniques and AI-powered feedback to help young artists develop their skills and imagination in a supportive and inspiring environment.',
      features: [
        'Creative development',
        'AI-powered feedback',
        'Fun learning techniques',
        'Supportive environment',
        'Progress tracking'
      ],
      benefits: [
        'Boost creativity',
        'Develop artistic skills',
        'Build confidence',
        'Express imagination',
        'Make new friends'
      ],
      duration: 'Ongoing',
      level: 'Beginner',
      price: '$149/month',
      color: 'bg-purple-100 text-purple-800',
      highlight: 'For Kids'
    },
    {
      icon: Globe,
      title: 'Tamil Class for Kids with AI',
      description: 'Connect your child to their heritage. Our unique Tamil language classes for kids use interactive AI tools to make learning fun and effective, building a strong foundation in reading, writing, and speaking Tamil.',
      features: [
        'Cultural connection',
        'Interactive AI tools',
        'Comprehensive language skills',
        'Engaging activities',
        'Progress monitoring'
      ],
      benefits: [
        'Connect with heritage',
        'Learn Tamil effectively',
        'Cultural understanding',
        'Language confidence',
        'Family bonding'
      ],
      duration: 'Ongoing',
      level: 'Beginner',
      price: '$149/month',
      color: 'bg-orange-100 text-orange-800',
      highlight: 'Cultural'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">RiftUni</h1>
          </div>
          <p className="text-2xl mb-8 max-w-3xl mx-auto">
            Empowering You for the Future - AI & Technology for All
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Discover innovative learning experiences powered by cutting-edge technology, designed to transform your educational journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Enroll Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our AI-Powered Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each program is carefully designed to leverage AI technology for maximum learning effectiveness
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-full bg-blue-100">
                        <service.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <Badge className={service.color}>
                        {service.highlight}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                      <div className="text-sm text-muted-foreground">{service.duration}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-700">Benefits:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{service.level}</Badge>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Limited seats</span>
                      </div>
                    </div>
                    <Button className="group">
                      Enroll Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose RiftUni?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI technology with proven teaching methods
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-muted-foreground">
                  Our courses leverage advanced AI to provide personalized learning experiences and real-time feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Expert Instruction</h3>
                <p className="text-muted-foreground">
                  Learn from industry experts and experienced educators who are passionate about teaching.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Supportive Community</h3>
                <p className="text-muted-foreground">
                  Join a community of learners and get support from peers and instructors throughout your journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who have transformed their lives with our AI-powered education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}