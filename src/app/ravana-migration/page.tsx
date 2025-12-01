'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  Plane, 
  Euro,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function RavanaMigrationPage() {
  const services = [
    {
      country: 'Germany',
      flag: '🇩🇪',
      currency: 'EUR',
      services: [
        {
          icon: GraduationCap,
          title: 'German Student Visa with up to 100% Scholarship',
          description: 'Make your dream of studying in Germany a reality. We offer comprehensive support to help you secure a student visa and unlock scholarship opportunities, with potential funding for up to 100% of your tuition and living expenses.',
          features: [
            '100% scholarship potential',
            'Comprehensive visa support',
            'German education expertise',
            'Living expense coverage',
            'University selection guidance',
            'Post-study work opportunities'
          ],
          benefits: [
            'World-class education',
            'No tuition fees at public universities',
            'Strong job market',
            'European Union access',
            'High quality of life',
            'Permanent residency opportunities'
          ],
          requirements: [
            'Academic transcripts',
            'Language proficiency (German/English)',
            'Financial proof',
            'Health insurance',
            'Motivation letter'
          ],
          price: 'Consultation Fee: $500',
          successRate: '95%',
          color: 'bg-blue-100 text-blue-800',
          highlight: 'Full Scholarship',
          popular: true
        },
        {
          icon: Users,
          title: 'German Job-Seeking Visa',
          description: 'Launch your career in Germany. Our expert guidance and support help you navigate the process of obtaining a job-seeking visa, giving you the time and resources you need to find professional opportunities in one of Europe\'s strongest economies.',
          features: [
            'Job search support',
            'Extended stay period (6 months)',
            'Career guidance',
            'Economic opportunity',
            'Resume optimization',
            'Interview preparation'
          ],
          benefits: [
            'Access to German job market',
            'Extended job search period',
            'Professional networking',
            'Career advancement',
            'European work experience',
            'Path to work visa'
          ],
          requirements: [
            'Recognized degree',
            '5 years professional experience',
            'Financial means (€11,208)',
            'Health insurance',
            'German language skills (B1)'
          ],
          price: 'Service Fee: $750',
          successRate: '88%',
          color: 'bg-green-100 text-green-800',
          highlight: 'Career Launchpad',
          popular: false
        }
      ]
    },
    {
      country: 'Canada',
      flag: '🇨🇦',
      currency: 'CAD',
      services: [
        {
          icon: DollarSign,
          title: 'Canada Student Visa with up to 75% Loan',
          description: 'Study in Canada with minimal upfront costs. With our unique program, you can begin your journey to Canada with just 3 million, and we\'ll help you secure a loan for up to 75% of your expenses, which you can comfortably repay over 4 to 7 years.',
          features: [
            'Minimal upfront cost (3 million)',
            '75% loan support',
            'Flexible repayment (4-7 years)',
            'IELTS 6.0 requirement',
            'Comprehensive application support',
            'Post-graduation work permit'
          ],
          benefits: [
            'World-class education',
            'Multicultural environment',
            'Work while studying',
            'Path to permanent residency',
            'High standard of living',
            'Global recognition'
          ],
          requirements: [
            'IELTS score of 6.0',
            'Academic qualifications',
            'Proof of funds',
            'Medical examination',
            'Statement of purpose'
          ],
          price: 'Initial Payment: 3 Million LKR',
          successRate: '92%',
          color: 'bg-red-100 text-red-800',
          highlight: 'Affordable Education',
          popular: true
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Plane className="h-12 w-12 mr-4" />
            <h1 className="text-5xl font-bold">Ravana Migration</h1>
          </div>
          <p className="text-2xl mb-8 max-w-3xl mx-auto">
            Your Gateway to Global Opportunities
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Expert guidance for your international education and career journey. We make your dreams of studying and working abroad a reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Migration Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support for your international education and career aspirations
            </p>
          </div>

          {services.map((country, countryIndex) => (
            <div key={countryIndex} className="mb-16">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-5xl">{country.flag}</span>
                  <h3 className="text-3xl font-bold">{country.country}</h3>
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    {country.currency}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                {country.services.map((service, serviceIndex) => (
                  <Card key={serviceIndex} className={`hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${service.popular ? 'ring-2 ring-green-500' : ''}`}>
                    {service.popular && (
                      <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                        MOST POPULAR CHOICE
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-full bg-green-100">
                            <service.icon className="h-8 w-8 text-green-600" />
                          </div>
                          <Badge className={service.color}>
                            {service.highlight}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{service.price}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-muted-foreground">{service.successRate} Success Rate</span>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-1 gap-4">
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

                        <div>
                          <h4 className="font-semibold mb-3 text-purple-700">Requirements:</h4>
                          <ul className="space-y-2">
                            {service.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <Award className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">
                            <Globe className="h-3 w-3 mr-1" />
                            {country.country}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Limited spots</span>
                          </div>
                        </div>
                        <Button className="group bg-green-600 hover:bg-green-700">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Migration Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A streamlined process designed for your success
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Consultation</h3>
                <p className="text-muted-foreground text-sm">
                  Free initial consultation to assess your eligibility and goals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-muted-foreground text-sm">
                  We help you prepare and organize all necessary documents
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Application</h3>
                <p className="text-muted-foreground text-sm">
                  Expert guidance through the entire application process
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Success</h3>
                <p className="text-muted-foreground text-sm">
                  Celebrate your successful visa approval and journey ahead
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Ravana Migration?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for international education and migration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Plane className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Experienced consultants with deep knowledge of immigration policies and procedures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Global Network</h3>
                <p className="text-muted-foreground">
                  Extensive network of universities and employers in Germany and Canada.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Proven Success</h3>
                <p className="text-muted-foreground">
                  High success rate with thousands of successful visa applications and satisfied clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Global Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Take the first step towards your international education and career goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}