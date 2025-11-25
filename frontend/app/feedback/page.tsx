"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star, MessageSquare, User, Calendar, ArrowLeft, Filter, Loader2, MapPin, Briefcase, Mail, Globe, FileText, Building2, Clock, UserCheck, Award, AlertCircle, TrendingUp } from "lucide-react"

const API_BASE_URL = "http://172.23.88.43:8000"
const API_MODULE_PATH = "resume.api.candidate_feedback"
// const API_AUTH = {
//   headers: {
//     Authorization: `token 09481bf19b467f7:39bb84748d00090`,
//   },
// }
import { axiosConfig } from '@/lib/axios-config'

interface SkillAssessment {
  skill: string
  rating: number
}

interface ApplicantData {
  applicant_name: string
  email_id: string
  country: string
  phone_number?: string
  status?: string
}

interface JobOpeningData {
  job_title: string
  location: string
  department?: string
  designation?: string
}

interface FeedbackItem {
  name: string
  interview: string
  interviewer: string
  result: string
  feedback: string
  interview_round: string
  creation: string
  modified: string
  applicant: ApplicantData
  job_opening: JobOpeningData
  skill_assessments: SkillAssessment[]
  average_rating: number
  total_skills: number
  candidate_name?: string
  interview_date?: string
  position_applied_for?: string
  department?: string
  location?: string
  new_position?: string
  replacement_position?: string
  applicant_rating?: string
  final_score_recommendation?: string[]
  not_shortlisted_reason?: string[]
  withdrawn_reason?: string[]
  remarks?: string
}

export default function FeedbackPage() {
  const router = useRouter()
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedbackList()
  }, [])

  const fetchFeedbackList = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔄 Fetching feedback list from:", `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_candidate_feedback_list`)

      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_candidate_feedback_list`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()
      console.log("📦 Raw API Response:", result)

      if (result.message?.success) {
        setFeedbackList(result.message.data)
        console.log("✅ Fetched feedback list:", result.message.data.length, "records")
      } else {
        setError(result.message?.error || "Failed to fetch feedback")
        setFeedbackList([])
        console.error("⚠️ API returned success=false:", result)
      }
    } catch (err: any) {
      console.error("❌ Error fetching feedback list:", err)
      setError(err.message || "Network error")
      setFeedbackList([])
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedback = feedbackList.filter(
    (item) => filterStatus === "all" || item.result.toLowerCase() === filterStatus.toLowerCase()
  )

  const getResultColor = (result: string) => {
    switch (result?.toLowerCase()) {
      case "cleared":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-muted-foreground">Loading feedback data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Candidate Feedback
              </h1>
            </div>
            <p className="text-muted-foreground">Review candidates and provide detailed feedback</p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 h-12">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">⚠️ {error}</p>
              <Button onClick={fetchFeedbackList} variant="outline" size="sm" className="mt-2">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Indicator */}
        {feedbackList.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Review Progress</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {feedbackList.filter((f) => f.result === "Cleared").length} Cleared / {feedbackList.length} Total
                </Badge>
              </div>
              <Progress
                value={(feedbackList.filter((f) => f.result === "Cleared").length / feedbackList.length) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Candidate Feedback ({filteredFeedback.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFeedback.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Feedback Found</h3>
                    <p className="text-sm text-muted-foreground">
                      {filterStatus === "all"
                        ? "No feedback records available yet."
                        : `No ${filterStatus} feedback found.`}
                    </p>
                  </div>
                ) : (
                  filteredFeedback.map((item) => (
                    <Card
                      key={item.name}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-0 shadow-lg ${selectedFeedback?.name === item.name ? "ring-2 ring-blue-500" : ""
                        }`}
                      onClick={() => setSelectedFeedback(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                {(item.candidate_name || item.applicant?.applicant_name || "NA")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2 flex-1">
                              <div>
                                <h3 className="font-semibold">{item.candidate_name || item.applicant?.applicant_name || "N/A"}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{item.applicant?.email_id || "N/A"}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Briefcase className="h-3 w-3" />
                                  <span className="font-medium">{item.position_applied_for || item.job_opening?.job_title || "N/A"}</span>
                                </div>
                                {item.new_position && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <TrendingUp className="h-3 w-3 text-blue-600" />
                                    <span className="text-blue-600 font-medium">New: {item.new_position}</span>
                                  </div>
                                )}
                                {item.replacement_position && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <UserCheck className="h-3 w-3 text-purple-600" />
                                    <span className="text-purple-600">Replacement: {item.replacement_position}</span>
                                  </div>
                                )}
                                {(item.location || item.job_opening?.location) && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{item.location || item.job_opening?.location}</span>
                                  </div>
                                )}
                                {(item.applicant?.country) && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Globe className="h-3 w-3" />
                                    <span>{item.applicant.country}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{item.interview_round || "N/A"}</span>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(item.interview_date || item.creation)}</span>
                                </div>
                              </div>
                              {item.applicant_rating && (
                                <div className="pt-2">
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    <Award className="h-3 w-3 mr-1" />
                                    {item.applicant_rating}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge className={getResultColor(item.result)}>{item.result || "Pending"}</Badge>
                            {item.average_rating > 0 && (
                              <div className="text-sm">
                                <StarRating rating={Math.round(item.average_rating)} />
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.average_rating.toFixed(1)} avg ({item.total_skills} skills)
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          {/* Left side button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Add your action here
                              router.push("/document-verify")
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            Document Verify
                          </Button>

                          {/* Right side button */}
                          {item.result === "Cleared" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push("/offer-letter")
                              }}
                            >
                              <FileText className="h-4 w-4" />
                              Offer Letter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Details Panel */}
          <div className="space-y-6">
            {selectedFeedback ? (
              <>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Feedback Details</span>
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      For {selectedFeedback.candidate_name || selectedFeedback.applicant?.applicant_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-blue-100 mb-2 block">Interview Round</label>
                      <p className="text-white">{selectedFeedback.interview_round || "N/A"}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-blue-100 mb-2 block">Result</label>
                      <Badge className={`${selectedFeedback.result.toLowerCase() === 'cleared' ? 'bg-green-500' : selectedFeedback.result.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} text-white border-0`}>
                        {selectedFeedback.result}
                      </Badge>
                    </div>

                    {selectedFeedback.average_rating > 0 && (
                      <div>
                        <label className="text-sm font-medium text-blue-100 mb-2 block">Overall Rating</label>
                        <StarRating rating={Math.round(selectedFeedback.average_rating)} />
                        <p className="text-sm text-blue-100 mt-1">
                          {selectedFeedback.average_rating.toFixed(1)} / 5.0
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-blue-100 mb-2 block">Detailed Feedback</label>
                      <Textarea
                        value={selectedFeedback.feedback || "No feedback provided"}
                        readOnly
                        className="bg-white/20 border-blue-300 text-white placeholder:text-blue-200"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-blue-100 mb-2 block">
                        Interviewed By
                      </label>
                      <p className="text-white">{selectedFeedback.interviewer}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Candidate Information - ENHANCED */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Candidate Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Job Position */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Job Position
                      </h4>
                      <p className="text-sm font-semibold">{selectedFeedback.position_applied_for || selectedFeedback.job_opening?.job_title || "N/A"}</p>
                    </div>

                    {/* Department */}
                    {selectedFeedback.department && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Department
                        </h4>
                        <p className="text-sm">{selectedFeedback.department}</p>
                      </div>
                    )}

                    {/* Location */}
                    {(selectedFeedback.location || selectedFeedback.job_opening?.location) && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </h4>
                        <p className="text-sm">{selectedFeedback.location || selectedFeedback.job_opening?.location}</p>
                      </div>
                    )}

                    {/* Country */}
                    {selectedFeedback.applicant?.country && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Country
                        </h4>
                        <p className="text-sm">{selectedFeedback.applicant.country}</p>
                      </div>
                    )}

                    {/* New Position */}
                    {selectedFeedback.new_position && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          New Position
                        </h4>
                        <p className="text-sm">{selectedFeedback.new_position}</p>
                      </div>
                    )}

                    {/* Replacement Position */}
                    {selectedFeedback.replacement_position && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Replacement Position
                        </h4>
                        <p className="text-sm">{selectedFeedback.replacement_position}</p>
                      </div>
                    )}

                    {/* Applicant Rating */}
                    {selectedFeedback.applicant_rating && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Applicant Rating
                        </h4>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {selectedFeedback.applicant_rating}
                        </Badge>
                      </div>
                    )}

                    {/* Final Score & Recommendation */}
                    {selectedFeedback.final_score_recommendation && selectedFeedback.final_score_recommendation.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Final Score & Recommendation</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFeedback.final_score_recommendation.map((score, index) => (
                            <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {score}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Not Shortlisted Reasons */}
                    {selectedFeedback.not_shortlisted_reason && selectedFeedback.not_shortlisted_reason.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Not Shortlisted Reasons
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFeedback.not_shortlisted_reason.map((reason, index) => (
                            <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Withdrawn Reasons */}
                    {selectedFeedback.withdrawn_reason && selectedFeedback.withdrawn_reason.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Withdrawn Reasons</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedFeedback.withdrawn_reason.map((reason, index) => (
                            <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skill Assessment */}
                    {selectedFeedback.skill_assessments && selectedFeedback.skill_assessments.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Skill Assessment</h4>
                        <div className="space-y-2">
                          {selectedFeedback.skill_assessments.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{skill.skill}</span>
                              <StarRating rating={skill.rating} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remarks */}
                    {selectedFeedback.remarks && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Remarks</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{selectedFeedback.remarks}</p>
                      </div>
                    )}

                    {/* Interview Date */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Interview Date
                      </h4>
                      <p className="text-sm">{formatDate(selectedFeedback.interview_date || selectedFeedback.creation)}</p>
                    </div>

                    {/* Feedback Date */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Feedback Date
                      </h4>
                      <p className="text-sm">{formatDate(selectedFeedback.creation)}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Select a Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a candidate feedback from the list to view detailed information.
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
