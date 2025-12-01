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
  Calendar,
  DollarSign,
  PiggyBank,
  ShoppingCart,
  QrCode,
  Building,
  Timer,
  BarChart3,
  CreditCard,
  FileText
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"

export default function HowItWorksPage() {
  const processSteps = [
    {
      step: 1,
      title: "Registration & Profile Creation",
      icon: <Users className="h-12 w-12 text-blue-600" />,
      description: "Students create comprehensive profiles sharing their educational background, goals, and aspirations. Donors register and complete their profiles.",
      details: [
        "Students provide academic records and financial need documentation",
        "Donors complete verification process",
        "Both parties set preferences and goals",
        "Profile review and approval by EduSponsor team"
      ],
      duration: "2-3 days"
    },
    {
      step: 2,
      title: "Smart Matching System",
      icon: <Target className="h-12 w-12 text-purple-600" />,
      description: "Our AI-powered algorithm matches donors with students based on compatibility, goals, and preferences.",
      details: [
        "Algorithm analyzes student needs and donor preferences",
        "Considers academic field, location, and financial requirements",
        "Multiple matching factors ensure compatibility",
        "Manual review by EduSponsor team for quality assurance"
      ],
      duration: "1-2 days"
    },
    {
      step: 3,
      title: "Monthly Donation & Point Conversion",
      icon: <DollarSign className="h-12 w-12 text-green-600" />,
      description: "Donors contribute $50 monthly, which converts to 50,000 points for the student's educational needs.",
      details: [
        "Automatic monthly donation processing",
        "Real-time point conversion (1:1000 ratio)",
        "Instant notification to both parties",
        "Secure payment processing with multiple options"
      ],
      duration: "Monthly"
    },
    {
      step: 4,
      title: "Smart Point Allocation",
      icon: <BarChart3 className="h-12 w-12 text-orange-600" />,
      description: "Points are automatically distributed across educational resources, health insurance, and future investments.",
      details: [
        "40% for educational resources (books, courses, tutoring)",
        "30% for comprehensive health insurance coverage",
        "30% for automatic investments in student's future",
        "Flexible allocation based on individual student needs"
      ],
      duration: "Automatic"
    },
    {
      step: 5,
      title: "Resource Access & Utilization",
      icon: <ShoppingCart className="h-12 w-12 text-red-600" />,
      description: "Students access educational resources through our vendor network and platform partnerships.",
      details: [
        "Access to partnered bookstores and educational suppliers",
        "Online course subscriptions and learning platforms",
        "Health insurance coverage through partner providers",
        "Tutoring and academic support services"
      ],
      duration: "Ongoing"
    },
    {
      step: 6,
      title: "Impact Tracking & Reporting",
      icon: <TrendingUp className="h-12 w-12 text-indigo-600" />,
      description: "Real-time tracking of student progress and impact reporting for donors with complete transparency.",
      details: [
        "Monthly progress reports for donors",
        "Academic performance tracking",
        "Goal achievement monitoring",
        "Financial impact and ROI analysis"
      ],
      duration: "Continuous"
    }
  ]

  const pointSystem = [
    {
      category: "Educational Resources",
      percentage: 40,
      amount: "20,000",
      color: "blue",
      icon: <BookOpen className="h-6 w-6" />,
      items: [
        "Textbooks and educational materials",
        "Online courses and subscriptions",
        "Tutoring and academic support",
        "Exam preparation resources",
        "Lab equipment and software"
      ]
    },
    {
      category: "Health Insurance",
      percentage: 30,
      amount: "15,000",
      color: "green",
      icon: <Shield className="h-6 w-6" />,
      items: [
        "Comprehensive medical coverage",
        "Dental and vision care",
        "Mental health support",
        "Emergency medical services",
        "Preventive care and checkups"
      ]
    },
    {
      category: "Future Investments",
      percentage: 30,
      amount: "15,000",
      color: "purple",
      icon: <PiggyBank className="h-6 w-6" />,
      items: [
        "Automatic investment portfolio",
        "Retirement savings plan",
        "Entrepreneurship fund",
        "Emergency savings",
        "Career development investments"
      ]
    }
  ]

  const features = [
    {
      title: "AI-Powered Matching",
      description: "Advanced algorithms ensure optimal donor-student matches based on multiple compatibility factors.",
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      benefits: [
        "Higher compatibility rates",
        "Better long-term relationships",
        "Improved student outcomes",
        "Increased donor satisfaction"
      ]
    },
    {
      title: "Transparent Tracking",
      description: "Real-time dashboards show exactly how donations are being used and their impact.",
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      benefits: [
        "Complete donation visibility",
        "Real-time impact metrics",
        "Detailed spending reports",
        "Performance analytics"
      ]
    },
    {
      title: "Vendor Network",
      description: "Partnerships with local businesses provide easy access to educational resources and services.",
      icon: <Building className="h-8 w-8 text-green-500" />,
      benefits: [
        "Local economic support",
        "Discounted educational resources",
        "Quality service providers",
        "Community integration"
      ]
    },
    {
      title: "Mobile App",
      description: "Comprehensive mobile application for easy management of donations, points, and progress tracking.",
      icon: <Phone className="h-8 w-8 text-purple-500" />,
      benefits: [
        "On-the-go access",
        "Push notifications",
        "Easy point management",
        "Progress tracking"
      ]
    }
  ]

  const faqs = [
    {
      question: "How does the point system work?",
      answer: "Each $50 donation converts to 50,000 points (1:1000 ratio). Points are automatically allocated: 40% for educational resources, 30% for health insurance, and 30% for future investments. Students can use points through our vendor network or platform partnerships."
    },
    {
      question: "Can I choose which student to support?",
      answer: "While our AI-powered matching system recommends optimal matches, donors can express preferences for student characteristics, academic fields, or locations. Final matches are made with both donor and student approval."
    },
    {
      question: "How do I know my donation is making an impact?",
      answer: "Donors receive monthly impact reports showing student progress, academic achievements, and how points were utilized. Our transparent dashboard provides real-time tracking of all activities and outcomes."
    },
    {
      question: "What happens if a student no longer needs support?",
      answer: "Students graduate from the program when they complete their education or achieve financial independence. We celebrate their success and donors can choose to support new students or take a break."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes, EduSponsor is a registered nonprofit organization, and all donations are tax-deductible. Donors receive annual tax receipts and documentation for their contributions."
    },
    {
      question: "How long is the commitment period?",
      answer: "We recommend a minimum commitment of one academic year to provide stable support for students. However, donors can choose to continue supporting the same student through their entire educational journey."
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
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple Process,
            </span>
            <br />
            <span className="text-gray-900">Powerful Impact</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how EduSponsor connects compassionate donors with deserving students through our innovative point-based system, 
            creating lasting educational impact across Sri Lanka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
              <Link href="/register/donor">
                <Heart className="mr-2 h-5 w-5" />
                Start Donating
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold" asChild>
              <Link href="/about">
                <BookOpen className="mr-2 h-5 w-5" />
                Learn About Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
              6 Simple Steps
            </Badge>
            <h2 className="text-4xl font-bold mb-6">How EduSponsor Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures maximum impact with minimal complexity, making educational sponsorship accessible to everyone.
            </p>
          </div>

          <div className="space-y-16">
            {processSteps.map((step, index) => (
              <div key={step.step} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {step.duration}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{step.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Key Details:</h4>
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Point System Breakdown */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
              Smart Allocation
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Point System Breakdown</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every $50 donation becomes 50,000 points, intelligently distributed across essential student needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {pointSystem.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <div className={`text-${category.color}-600`}>
                      {category.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">{category.amount} pts</div>
                  <div className="text-lg text-gray-600">{category.percentage}%</div>
                </CardHeader>
                <CardContent>
                  <Progress value={category.percentage} className="mb-4" />
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className={`w-2 h-2 bg-${category.color}-500 rounded-full`}></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Monthly Impact Summary</h3>
              <p className="text-gray-600">Your $50 monthly donation creates comprehensive support</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$50</div>
                <div className="text-sm text-gray-600">Monthly Donation</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">50,000</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Support Categories</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600">Transparent Usage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold mb-6">What Makes EduSponsor Unique</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our innovative features ensure maximum impact, transparency, and ease of use for both donors and students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800">
              Common Questions
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about how EduSponsor works and how you can get involved.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-white text-blue-600">
              Ready to Begin?
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Start Making a Difference Today</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of donors and students who are already transforming educational opportunities across Sri Lanka. 
              Your journey to making a lasting impact starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
                <Link href="/register/donor">
                  <Heart className="mr-2 h-5 w-5" />
                  Become a Donor
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold" asChild>
                <Link href="/register/student">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Apply as Student
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}