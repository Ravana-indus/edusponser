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
  FileText,
  University,
  Briefcase,
  Stethoscope,
  Code,
  Palette,
  Microscope,
  Calculator,
  Globe2,
  Map,
  Trophy,
  Gift,
  Zap
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"

export default function ImpactPage() {
  const impactStats = [
    {
      title: "Students Supported",
      value: "524",
      change: "+23%",
      period: "Last Year",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      description: "Active students receiving support"
    },
    {
      title: "Active Donors",
      value: "367",
      change: "+18%",
      period: "Last Year",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      description: "Monthly sponsors making impact"
    },
    {
      title: "Monthly Impact",
      value: "$28,500",
      change: "+31%",
      period: "Last Year",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      description: "Total monthly donations"
    },
    {
      title: "Success Rate",
      value: "98%",
      change: "+2%",
      period: "Last Year",
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      description: "Student graduation rate"
    },
    {
      title: "Points Distributed",
      value: "28.5M",
      change: "+45%",
      period: "Last Year",
      icon: <Star className="h-8 w-8 text-purple-600" />,
      description: "Total educational points"
    },
    {
      title: "Vendor Partners",
      value: "127",
      change: "+29%",
      period: "Last Year",
      icon: <Building className="h-8 w-8 text-orange-600" />,
      description: "Local business partners"
    }
  ]

  const successStories = [
    {
      name: "Nimali Perera",
      field: "Medicine",
      university: "University of Colombo",
      story: "From a small village in Hambantota to becoming a doctor, Nimali's journey was made possible through EduSponsor. With consistent support, she maintained excellent grades and is now serving her community.",
      impact: "Graduated with honors, now working at National Hospital",
      achievements: [
        "First in family to attend university",
        "Dean's List all 4 years",
        "Published research paper",
        "Community health volunteer"
      ],
      stats: {
        gpa: "3.9/4.0",
        duration: "4 years",
        totalSupport: "$2,400"
      }
    },
    {
      name: "Kamal Silva",
      field: "Computer Science",
      university: "University of Moratuwa",
      story: "Kamal's passion for technology was limited by financial constraints. EduSponsor provided not just funding but also access to online courses and programming resources that shaped his career.",
      impact: "Now working as a senior developer at a tech startup",
      achievements: [
        "Created award-winning mobile app",
        "Internship at Google",
        "Tech community mentor",
        "Started coding bootcamp"
      ],
      stats: {
        gpa: "3.8/4.0",
        duration: "4 years",
        totalSupport: "$2,400"
      }
    },
    {
      name: "Sarah Fernando",
      field: "Engineering",
      university: "University of Peradeniya",
      story: "Sarah dreamed of becoming an engineer but faced financial hurdles. EduSponsor's comprehensive support, including health insurance, allowed her to focus on her studies without worry.",
      impact: "Working as a mechanical engineer at a leading firm",
      achievements: [
        "Graduated top of class",
        "Lead engineering project",
        "Women in STEM advocate",
        "Scholarship recipient"
      ],
      stats: {
        gpa: "4.0/4.0",
        duration: "4 years",
        totalSupport: "$2,400"
      }
    }
  ]

  const fieldBreakdown = [
    {
      field: "Medicine & Healthcare",
      percentage: 25,
      students: 131,
      icon: <Stethoscope className="h-6 w-6 text-red-500" />,
      color: "red"
    },
    {
      field: "Engineering",
      percentage: 22,
      students: 115,
      icon: <Calculator className="h-6 w-6 text-blue-500" />,
      color: "blue"
    },
    {
      field: "Computer Science",
      percentage: 18,
      students: 94,
      icon: <Code className="h-6 w-6 text-purple-500" />,
      color: "purple"
    },
    {
      field: "Business & Finance",
      percentage: 15,
      students: 79,
      icon: <Briefcase className="h-6 w-6 text-green-500" />,
      color: "green"
    },
    {
      field: "Sciences",
      percentage: 12,
      students: 63,
      icon: <Microscope className="h-6 w-8 text-orange-500" />,
      color: "orange"
    },
    {
      field: "Arts & Humanities",
      percentage: 8,
      students: 42,
      icon: <Palette className="h-6 w-6 text-pink-500" />,
      color: "pink"
    }
  ]

  const geographicalImpact = [
    {
      region: "Western Province",
      students: 189,
      percentage: 36,
      universities: ["University of Colombo", "University of Moratuwa", "Kelaniya University"]
    },
    {
      region: "Central Province",
      students: 98,
      percentage: 19,
      universities: ["University of Peradeniya"]
    },
    {
      region: "Southern Province",
      students: 84,
      percentage: 16,
      universities: ["University of Ruhuna"]
    },
    {
      region: "Eastern Province",
      students: 68,
      percentage: 13,
      universities: ["Eastern University"]
    },
    {
      region: "Northern Province",
      students: 52,
      percentage: 10,
      universities: ["University of Jaffna"]
    },
    {
      region: "Other Provinces",
      students: 33,
      percentage: 6,
      universities: ["Various institutions"]
    }
  ]

  const annualReport = [
    {
      year: "2023",
      students: 426,
      donors: 311,
      funding: "$187,200",
      impact: "Expanded to all provinces"
    },
    {
      year: "2022",
      students: 342,
      donors: 267,
      funding: "$160,800",
      impact: "Launched investment features"
    },
    {
      year: "2021",
      students: 256,
      donors: 198,
      funding: "$118,800",
      impact: "First major expansion"
    },
    {
      year: "2020",
      students: 89,
      donors: 67,
      funding: "$40,200",
      impact: "Pilot program launched"
    }
  ]

  const futureGoals = [
    {
      goal: "Support 1,000 Students",
      target: "2025",
      progress: 52,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      description: "Expand our reach to support more deserving students across Sri Lanka"
    },
    {
      goal: "500 Active Donors",
      target: "2024",
      progress: 73,
      icon: <Heart className="h-8 w-8 text-red-600" />,
      description: "Grow our donor community to increase sustainable funding"
    },
    {
      goal: "National Coverage",
      target: "2025",
      progress: 85,
      icon: <Map className="h-8 w-8 text-green-600" />,
      description: "Establish presence in all districts of Sri Lanka"
    },
    {
      goal: "Mobile App Launch",
      target: "2024",
      progress: 90,
      icon: <Phone className="h-8 w-8 text-purple-600" />,
      description: "Launch comprehensive mobile application for enhanced accessibility"
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
            Our Impact
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Measurable Impact,
            </span>
            <br />
            <span className="text-gray-900">Lasting Change</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the real difference EduSponsor is making across Sri Lanka through transparent reporting, 
            success stories, and comprehensive impact metrics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
              <Link href="/register/donor">
                <Heart className="mr-2 h-5 w-5" />
                Be Part of the Impact
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold" asChild>
              <Link href="/how-it-works">
                <BookOpen className="mr-2 h-5 w-5" />
                How We Create Impact
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
              By the Numbers
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Our Collective Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real metrics showing the tangible difference we're making in students' lives across Sri Lanka.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    {stat.icon}
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{stat.period}</p>
                  <p className="text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Transformed Lives</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet some of the students whose educational journeys have been transformed through EduSponsor support.
            </p>
          </div>

          <div className="space-y-12">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-3 gap-0">
                    <div className="lg:col-span-2 p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{story.name}</h3>
                          <p className="text-lg text-gray-600">{story.field}</p>
                          <p className="text-sm text-gray-500">{story.university}</p>
                        </div>
                      </div>
                      
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">{story.story}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Impact:</h4>
                        <p className="text-gray-600">{story.impact}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {story.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-b from-blue-50 to-purple-50 p-8">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-900 mb-4">Education Stats</h4>
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{story.stats.gpa}</div>
                              <div className="text-sm text-gray-600">GPA</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{story.stats.duration}</div>
                              <div className="text-sm text-gray-600">Duration</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{story.stats.totalSupport}</div>
                              <div className="text-sm text-gray-600">Total Support</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Graduate Success</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Field Breakdown */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              Academic Fields
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Educational Diversity</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Supporting students across various academic disciplines to build a diverse and skilled workforce for Sri Lanka's future.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {fieldBreakdown.map((field, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {field.icon}
                      <span className="font-semibold">{field.field}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{field.percentage}%</div>
                      <div className="text-sm text-gray-500">{field.students} students</div>
                    </div>
                  </div>
                  <Progress value={field.percentage} className="h-3" />
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <University className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Field Distribution</h3>
                <p className="text-gray-600">Balanced support across disciplines</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-gray-600">Academic Fields</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">524</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">25%</div>
                  <div className="text-sm text-gray-600">Healthcare</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">40%</div>
                  <div className="text-sm text-gray-600">STEM Fields</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geographical Impact */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
              Nationwide Reach
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Geographical Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our impact extends across all provinces of Sri Lanka, ensuring educational opportunities reach every corner of the country.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {geographicalImpact.map((region, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{region.region}</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {region.percentage}%
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Students Supported</span>
                        <span className="font-bold text-lg">{region.students}</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                      <div className="text-sm text-gray-500">
                        Universities: {region.universities.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <Map className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">National Coverage</h3>
                <p className="text-gray-600">Reaching every province</p>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">6/9</div>
                  <div className="text-gray-600">Provinces Covered</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">189</div>
                    <div className="text-sm text-gray-600">Western Province</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">98</div>
                    <div className="text-sm text-gray-600">Central Province</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Expanding to all provinces</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Annual Progress */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800">
              Year Over Year
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Annual Growth</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tracking our progress and growth since inception, showing consistent expansion and increasing impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {annualReport.map((year, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{year.year}</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-lg font-bold">{year.students}</div>
                      <div className="text-sm text-gray-500">Students</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{year.donors}</div>
                      <div className="text-sm text-gray-500">Donors</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{year.funding}</div>
                      <div className="text-sm text-gray-500">Funding</div>
                    </div>
                    <div className="text-xs text-gray-600 italic">{year.impact}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-800">
              Looking Ahead
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Future Goals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our ambitious goals for the future, building on our success to create even greater impact across Sri Lanka.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {futureGoals.map((goal, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    {goal.icon}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{goal.goal}</h3>
                      <Badge variant="secondary" className="mt-1">
                        Target: {goal.target}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-bold">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                    </div>
                    
                    <p className="text-gray-600">{goal.description}</p>
                  </div>
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
              Join the Impact
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Be Part of the Change</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Your support can transform lives and create lasting educational impact across Sri Lanka. 
              Join our community of donors and be part of something truly meaningful.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-semibold shadow-lg transform transition hover:scale-105" asChild>
                <Link href="/register/donor">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Making Impact
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold" asChild>
                <Link href="/impact">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Full Report
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}