"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Send, Download, Eye, ArrowLeft, Calendar, DollarSign, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

interface SelectedCandidate {
  id: string
  name: string
  email: string
  position: string
  experience: string
  expectedSalary: string
}

export default function OfferLetterPage() {
  const [selectedCandidates] = useState<SelectedCandidate[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      position: "Senior Developer",
      experience: "5+ years",
      expectedSalary: "₹12,00,000",
    },
    {
      id: "2",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      position: "Senior Developer",
      experience: "6+ years",
      expectedSalary: "₹15,00,000",
    },
  ])

  const [selectedCandidate, setSelectedCandidate] = useState<SelectedCandidate | null>(null)
  const [offerDetails, setOfferDetails] = useState({
    salary: "",
    joiningDate: "",
    location: "",
    department: "",
    reportingManager: "",
    benefits: "",
    additionalTerms: "",
  })

  const handleGenerateOffer = () => {
    console.log("Generating offer for:", selectedCandidate?.name, offerDetails)
    // Dummy offer generation
  }

  const handleSendOffer = () => {
    console.log("Sending offer to:", selectedCandidate?.email)
    // Dummy offer sending
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Offer Letter Management
              </h1>
            </div>
            <p className="text-muted-foreground">Generate and send offer letters to selected candidates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shortlisted Candidates */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Shortlisted Candidates</span>
                </CardTitle>
                <CardDescription>Ready for offer letters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCandidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedCandidate?.id === candidate.id ? "ring-2 ring-emerald-500" : ""
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm">
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold text-sm">{candidate.name}</h3>
                          <p className="text-xs text-muted-foreground">{candidate.position}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{candidate.experience}</span>
                            <span>•</span>
                            <span>{candidate.expectedSalary}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Offer Letter Form */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCandidate ? (
              <>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Generate Offer Letter</span>
                    </CardTitle>
                    <CardDescription className="text-emerald-100">
                      For {selectedCandidate.name} - {selectedCandidate.position}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Offer Details</CardTitle>
                    <CardDescription>Fill in the offer letter details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salary" className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Annual Salary (₹)</span>
                        </Label>
                        <Input
                          id="salary"
                          value={offerDetails.salary}
                          onChange={(e) => setOfferDetails({ ...offerDetails, salary: e.target.value })}
                          placeholder="e.g., 1200000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="joiningDate" className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Joining Date</span>
                        </Label>
                        <Input
                          id="joiningDate"
                          type="date"
                          value={offerDetails.joiningDate}
                          onChange={(e) => setOfferDetails({ ...offerDetails, joiningDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>Work Location</span>
                        </Label>
                        <Select onValueChange={(value) => setOfferDetails({ ...offerDetails, location: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>Department</span>
                        </Label>
                        <Select onValueChange={(value) => setOfferDetails({ ...offerDetails, department: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reportingManager">Reporting Manager</Label>
                      <Input
                        id="reportingManager"
                        value={offerDetails.reportingManager}
                        onChange={(e) => setOfferDetails({ ...offerDetails, reportingManager: e.target.value })}
                        placeholder="Manager's name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="benefits">Benefits & Perks</Label>
                      <Textarea
                        id="benefits"
                        value={offerDetails.benefits}
                        onChange={(e) => setOfferDetails({ ...offerDetails, benefits: e.target.value })}
                        placeholder="Health insurance, PF, gratuity, flexible hours..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalTerms">Additional Terms</Label>
                      <Textarea
                        id="additionalTerms"
                        value={offerDetails.additionalTerms}
                        onChange={(e) => setOfferDetails({ ...offerDetails, additionalTerms: e.target.value })}
                        placeholder="Probation period, notice period, confidentiality..."
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={handleGenerateOffer} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Offer
                      </Button>
                      <Button onClick={handleGenerateOffer} variant="outline" className="flex-1 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button onClick={handleSendOffer} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Send Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Offer Preview */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Offer Letter Preview</CardTitle>
                    <CardDescription>Preview of the offer letter to be sent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="space-y-4 text-sm">
                        <div className="text-center">
                          <h2 className="text-xl font-bold">OFFER LETTER</h2>
                          <p className="text-muted-foreground">Company Name</p>
                        </div>

                        <div className="space-y-2">
                          <p>
                            <strong>Dear {selectedCandidate.name},</strong>
                          </p>
                          <p>
                            We are pleased to offer you the position of <strong>{selectedCandidate.position}</strong> at
                            our company.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded border">
                          <div>
                            <strong>Position:</strong> {selectedCandidate.position}
                          </div>
                          <div>
                            <strong>Department:</strong> {offerDetails.department || "TBD"}
                          </div>
                          <div>
                            <strong>Salary:</strong> ₹{offerDetails.salary || "TBD"} per annum
                          </div>
                          <div>
                            <strong>Location:</strong> {offerDetails.location || "TBD"}
                          </div>
                          <div>
                            <strong>Joining Date:</strong> {offerDetails.joiningDate || "TBD"}
                          </div>
                          <div>
                            <strong>Reporting To:</strong> {offerDetails.reportingManager || "TBD"}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          This is a preview. The actual offer letter will contain complete terms and conditions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Candidate</h3>
                  <p className="text-muted-foreground">
                    Choose a shortlisted candidate to generate and send an offer letter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
