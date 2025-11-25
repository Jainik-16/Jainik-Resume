"use client"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Star, Trash2, Copy, ArrowLeft, Plus, RefreshCw, Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const API_MODULE_PATH = "resume.api.interview_feedback"
const API_BASE_URL = "http://172.23.88.43:8000"
// const API_AUTH = {
//   headers: {
//     Authorization: `token 09481bf19b467f7:39bb84748d00090`,
//   },
// }
import { axiosConfig } from '@/lib/axios-config'

interface SkillAssessment {
  id: string
  skill: string
  rating: number
}

interface Interview {
  name: string
  job_applicant: string
  applicant_name?: string
  interview_round: string
  scheduled_on: string
  status: string
}

interface Interviewer {
  name: string
  full_name: string
  email: string
}

interface ColumnConfig {
  fieldname: string
  width: number
}

export default function CandidateFeedbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get candidate info from URL params
  const candidateIdFromUrl = searchParams.get('candidateId')
  const candidateNameFromUrl = searchParams.get('candidateName')
  const candidateEmailFromUrl = searchParams.get('candidateEmail')
  const [feedbackForm, setFeedbackForm] = useState({
    interview: "",
    interviewer: "",
    result: "",
    feedback: "",
    job_applicant: "",
    interview_round: "",
    candidate_name: "",
    interview_date: "",
    position_applied_for: "",
    department: "",
    location: "",
    new_position: "",
    replacement_position: "",
    applicant_rating: "",
    final_score_recommendation: [] as string[],
    not_shortlisted_reason: [] as string[],
    withdrawn_reason: [] as string[],
    remarks: ""
  })

  // const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([
  //   { id: "1", skill: "", rating: 0 }
  // ])
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([
    { id: "1", skill: "Communications Skills", rating: 0 },
    { id: "2", skill: "Education", rating: 0 },
    { id: "3", skill: "IT Skills", rating: 0 },
    { id: "4", skill: "Javascript", rating: 0 },
    { id: "5", skill: "Organization Skills", rating: 0 },
    { id: "6", skill: "Technical Skills", rating: 0 },
    { id: "7", skill: "Training", rating: 0 },
    { id: "8", skill: "Work Experience", rating: 0 }
  ])

  // Add these two NEW lines right after the state declarations:
  const showNotShortlistedSection = feedbackForm.final_score_recommendation.includes("Not Shortlisted")
  const showWithdrawnSection = feedbackForm.final_score_recommendation.includes("Candidature Withdrawn")
  // Calculate total score from all skill ratings
  const calculateTotalScore = () => {
    return skillAssessments.reduce((sum, skill) => sum + skill.rating, 0)
  }

  const [interviews, setInterviews] = useState<Interview[]>([])
  const [interviewers, setInterviewers] = useState<Interviewer[]>([])
  const [resultOptions, setResultOptions] = useState<string[]>([])
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [finalScoreOptions, setFinalScoreOptions] = useState<string[]>([])
  const [notShortlistedOptions, setNotShortlistedOptions] = useState<string[]>([])
  const [withdrawnReasonOptions, setWithdrawnReasonOptions] = useState<string[]>([])
  const [applicantRatingOptions, setApplicantRatingOptions] = useState<string[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [designationOptions, setDesignationOptions] = useState<string[]>([])

  const [loading, setLoading] = useState({
    interviews: true,
    interviewers: true,
    resultOptions: true,
    skills: true,
    finalScoreOptions: true,
    notShortlistedOptions: true,
    withdrawnReasonOptions: true,
    applicantRatingOptions: true,
    departmentOptions: true,
    locationOptions: true,
    designationOptions: true
  })
  const [isSaving, setIsSaving] = useState(false)

  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [showColumnConfig, setShowColumnConfig] = useState(false)
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([
    { fieldname: "Skill", width: 2 },
    { fieldname: "Rating", width: 2 }
  ])

  useEffect(() => {
    console.log("🚀 Component mounted, fetching all data...")
    fetchInterviews()
    fetchInterviewers()
    fetchResultOptions()
    fetchSkills()
    fetchFinalScoreOptions()
    fetchNotShortlistedOptions()
    fetchWithdrawnReasonOptions()
    fetchApplicantRatingOptions()
    fetchDepartmentOptions()
    fetchLocationOptions()
    fetchDesignationOptions()

    // Auto-fill candidate name if provided in URL
    if (candidateNameFromUrl) {
      setFeedbackForm(prev => ({
        ...prev,
        candidate_name: candidateNameFromUrl
      }))
      console.log("✅ Auto-filled candidate name:", candidateNameFromUrl)
    }
  }, [candidateNameFromUrl])


  useEffect(() => {
    const totalScore = calculateTotalScore()
    let recommendation = ""
    let autoCheckOffered = false

    if (totalScore >= 10 && totalScore <= 13) {
      recommendation = "Average (10 to 13)"
    } else if (totalScore >= 14 && totalScore <= 18) {
      recommendation = "Good (14 to 18)"
    } else if (totalScore >= 19 && totalScore <= 21) {
      recommendation = "Excellent (19 to 21)"
    } else if (totalScore > 21) {
      // recommendation = "Excellent (19 to 21)"
      autoCheckOffered = true
    }

    const filteredRecommendations = feedbackForm.final_score_recommendation.filter(
      item => !["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)", "To be Offered"].includes(item)
    )

    let newRecommendations = [...filteredRecommendations]

    if (recommendation) {
      newRecommendations.push(recommendation)
    }

    if (autoCheckOffered) {
      newRecommendations.push("To be Offered")
    }

    // Only update if something changed
    const currentSet = new Set(feedbackForm.final_score_recommendation)
    const newSet = new Set(newRecommendations)
    const hasChanged = currentSet.size !== newSet.size ||
      [...currentSet].some(item => !newSet.has(item))

    if (hasChanged) {
      setFeedbackForm(prev => ({
        ...prev,
        final_score_recommendation: newRecommendations
      }))
    }
  }, [skillAssessments])

  const fetchInterviews = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_interviews`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const interviews = data?.message?.data || []
      setInterviews(interviews)
      console.log("✅ Fetched interviews:", interviews.length, interviews)
    } catch (error: any) {
      console.error("❌ Error fetching interviews:", error)
      setInterviews([])
    } finally {
      setLoading(prev => ({ ...prev, interviews: false }))
    }
  }

  const fetchInterviewers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_interviewers`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const interviewers = data?.message?.data || []
      setInterviewers(interviewers)
      console.log("✅ Fetched interviewers:", interviewers.length, interviewers)
    } catch (error: any) {
      console.error("❌ Error fetching interviewers:", error)
      setInterviewers([])
    } finally {
      setLoading(prev => ({ ...prev, interviewers: false }))
    }
  }

  const fetchResultOptions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_result_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setResultOptions(options)
      console.log("✅ Fetched result options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching result options:", error)
      setResultOptions(["Cleared", "Rejected"])
    } finally {
      setLoading(prev => ({ ...prev, resultOptions: false }))
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_skills`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const skills = data?.message?.data || []
      setAvailableSkills(skills)
      console.log("✅ Fetched skills:", skills)
    } catch (error: any) {
      console.error("❌ Error fetching skills:", error)
      setAvailableSkills([])
    } finally {
      setLoading(prev => ({ ...prev, skills: false }))
    }
  }

  const fetchFinalScoreOptions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_final_score_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setFinalScoreOptions(options)
      console.log("✅ Fetched final score options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching final score options:", error)
      setFinalScoreOptions(["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)", "Not Shortlisted", "To be Offered", "Candidature Withdrawn"])
    } finally {
      setLoading(prev => ({ ...prev, finalScoreOptions: false }))
    }
  }

  const fetchNotShortlistedOptions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_not_shortlisted_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setNotShortlistedOptions(options)
      console.log("✅ Fetched not shortlisted options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching not shortlisted options:", error)
      setNotShortlistedOptions(["No Show for interview", "Not as qualified as others", "Test Scores", "Selected for other position", "Insufficient Skills", "Offer Denied", "Reference Check Unsatisfactory", "Good Skills/Exp, not 1st choice", "Poor Interview Ratings", "Behavioural Attributes"])
    } finally {
      setLoading(prev => ({ ...prev, notShortlistedOptions: false }))
    }
  }

  const fetchWithdrawnReasonOptions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_withdrawn_reason_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setWithdrawnReasonOptions(options)
      console.log("✅ Fetched withdrawn reason options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching withdrawn reason options:", error)
      setWithdrawnReasonOptions(["Another Job", "Changed Mind", "Hours/Work Schedule", "Job Duties", "Salary too low"])
    } finally {
      setLoading(prev => ({ ...prev, withdrawnReasonOptions: false }))
    }
  }

  const fetchApplicantRatingOptions = async () => {
    try {
      console.log("🔄 Fetching applicant rating options...")
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_applicant_rating_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setApplicantRatingOptions(options)
      console.log("✅ Fetched applicant rating options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching applicant rating options:", error)
      const fallbackOptions = ["0)Unsatisfactory", "1)Marginal", "2)Satisfactory", "3)Superior"]
      setApplicantRatingOptions(fallbackOptions)
      console.log("⚠️ Using fallback applicant rating options:", fallbackOptions)
    } finally {
      setLoading(prev => ({ ...prev, applicantRatingOptions: false }))
    }
  }

  const fetchDepartmentOptions = async () => {
    try {
      console.log("🔄 Fetching department options...")
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_department_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setDepartmentOptions(options)
      console.log("✅ Fetched department options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching department options:", error)
      const fallbackOptions = ["Accounts", "All Departments", "Customer Service", "Dispatch", "Human Resources", "Marketing", "Operations", "Production"]
      setDepartmentOptions(fallbackOptions)
      console.log("⚠️ Using fallback department options:", fallbackOptions)
    } finally {
      setLoading(prev => ({ ...prev, departmentOptions: false }))
    }
  }

  const fetchLocationOptions = async () => {
    try {
      console.log("🔄 Fetching location options...")
      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_location_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      const options = data?.message?.data || []
      setLocationOptions(options)
      console.log("✅ Fetched location options:", options)
    } catch (error: any) {
      console.error("❌ Error fetching location options:", error)
      const fallbackOptions = ["Borivali,Mumbai"]
      setLocationOptions(fallbackOptions)
      console.log("⚠️ Using fallback location options:", fallbackOptions)
    } finally {
      setLoading(prev => ({ ...prev, locationOptions: false }))
    }
  }

  const fetchDesignationOptions = async () => {
    try {
      console.log("🔄 Fetching designation options...")
      console.log("📍 API URL:", `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designation_options`)

      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designation_options`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      console.log("📡 Response status:", response.status, response.statusText)

      const data = await response.json()
      console.log("📦 Raw API response:", data)

      const options = data?.message?.data || []
      console.log("✅ Parsed designation options:", options, "Count:", options.length)

      if (options.length > 0) {
        setDesignationOptions(options)
        console.log("✅ Set designation options successfully:", options)
      } else {
        console.warn("⚠️ No designations returned from API, using fallback")
        const fallbackOptions = ["Software Developer", "Senior Developer", "Project Manager", "HR Manager"]
        setDesignationOptions(fallbackOptions)
      }
    } catch (error: any) {
      console.error("❌ Error fetching designation options:", error)
      console.error("❌ Error details:", error.message, error.stack)
      const fallbackOptions = ["Software Developer", "Senior Developer", "Project Manager", "HR Manager"]
      setDesignationOptions(fallbackOptions)
      console.log("⚠️ Using fallback designation options:", fallbackOptions)
    } finally {
      setLoading(prev => ({ ...prev, designationOptions: false }))
      console.log("✅ Designation loading complete")
    }
  }

  const handleInterviewChange = async (interviewName: string) => {
    setFeedbackForm(prev => ({ ...prev, interview: interviewName }))

    const selectedInterview = interviews.find(i => i.name === interviewName)
    if (selectedInterview) {
      // Auto-populate basic interview fields
      setFeedbackForm(prev => ({
        ...prev,
        interview: interviewName,
        job_applicant: selectedInterview.job_applicant || "",
        interview_round: selectedInterview.interview_round || "",
        candidate_name: selectedInterview.applicant_name || "",
        interview_date: selectedInterview.scheduled_on ? selectedInterview.scheduled_on.split(' ')[0] : ""
      }))

      console.log("✅ Auto-populated fields from interview:", {
        job_applicant: selectedInterview.job_applicant,
        interview_round: selectedInterview.interview_round,
        candidate_name: selectedInterview.applicant_name,
        interview_date: selectedInterview.scheduled_on
      })

      // Fetch job applicant details to get designation, department, and location from Job Opening
      if (selectedInterview.job_applicant) {
        try {
          console.log("🔄 Fetching job applicant details for:", selectedInterview.job_applicant)

          const response = await fetch(
            `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicant_details?job_applicant=${selectedInterview.job_applicant}`,
            {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          const data = await response.json()

          console.log("📦 Full API Response:", data)

          if (data?.message?.data) {
            const applicantData = data.message.data

            console.log("✅ Applicant Data:", applicantData)

            setFeedbackForm(prev => ({
              ...prev,
              position_applied_for: applicantData.designation || "",
              department: applicantData.department || "",
              location: applicantData.location || ""
            }))

            console.log("✅ Auto-populated from Job Opening:", {
              position: applicantData.designation,
              department: applicantData.department,
              location: applicantData.location
            })
          } else {
            console.warn("⚠️ No data in response:", data)
          }
        } catch (error) {
          console.error("❌ Error fetching job applicant details:", error)
        }
      }
    }
  }

  const addSkillRow = () => {
    const newSkill: SkillAssessment = {
      id: Date.now().toString(),
      skill: "",
      rating: 0
    }
    setSkillAssessments([...skillAssessments, newSkill])
  }

  const removeSkillRow = (id: string) => {
    setSkillAssessments(skillAssessments.filter(skill => skill.id !== id))
    if (editingRowId === id) setEditingRowId(null)
  }

  const duplicateSkillRow = (id: string) => {
    const skillToDuplicate = skillAssessments.find(s => s.id === id)
    if (skillToDuplicate) {
      const newSkill = {
        ...skillToDuplicate,
        id: Date.now().toString()
      }
      const index = skillAssessments.findIndex(s => s.id === id)
      const newSkills = [...skillAssessments]
      newSkills.splice(index + 1, 0, newSkill)
      setSkillAssessments(newSkills)
    }
  }

  const insertRowBelow = (id: string) => {
    const index = skillAssessments.findIndex(s => s.id === id)
    const newSkill: SkillAssessment = {
      id: Date.now().toString(),
      skill: "",
      rating: 0
    }
    const newSkills = [...skillAssessments]
    newSkills.splice(index + 1, 0, newSkill)
    setSkillAssessments(newSkills)
  }

  const insertRowAbove = (id: string) => {
    const index = skillAssessments.findIndex(s => s.id === id)
    const newSkill: SkillAssessment = {
      id: Date.now().toString(),
      skill: "",
      rating: 0
    }
    const newSkills = [...skillAssessments]
    newSkills.splice(index, 0, newSkill)
    setSkillAssessments(newSkills)
  }

  const updateSkillAssessment = (id: string, field: keyof SkillAssessment, value: string | number) => {
    setSkillAssessments(skillAssessments.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const handleSave = async () => {
    if (!feedbackForm.interview || !feedbackForm.interviewer || !feedbackForm.result) {
      alert("Please fill all required fields (Interview, Interviewer, Result)")
      return
    }

    const validSkills = skillAssessments.filter(s => s.skill.trim() && s.rating > 0)
    const invalidSkills = skillAssessments.filter(s => s.skill.trim() && (!availableSkills.includes(s.skill.trim())))

    if (invalidSkills.length > 0) {
      alert(`Invalid skills found: ${invalidSkills.map(s => s.skill).join(", ")}\n\nPlease select skills from the dropdown only.`)
      return
    }

    setIsSaving(true)
    try {
      const formData = new URLSearchParams()
      formData.append('interview', feedbackForm.interview)
      formData.append('interviewer', feedbackForm.interviewer)
      formData.append('result', feedbackForm.result)
      if (feedbackForm.feedback) formData.append('feedback', feedbackForm.feedback)

      // IMPORTANT: Make sure candidate_name is being sent
      if (feedbackForm.candidate_name) {
        formData.append('candidate_name', feedbackForm.candidate_name)
        console.log("📝 Sending candidate_name:", feedbackForm.candidate_name)
      }

      if (feedbackForm.interview_date) formData.append('interview_date', feedbackForm.interview_date)
      if (feedbackForm.position_applied_for) formData.append('position_applied_for', feedbackForm.position_applied_for)
      if (feedbackForm.department) formData.append('department', feedbackForm.department)
      if (feedbackForm.location) formData.append('location', feedbackForm.location)
      if (feedbackForm.new_position) formData.append('new_position', feedbackForm.new_position)
      if (feedbackForm.replacement_position) formData.append('replacement_position', feedbackForm.replacement_position)
      if (feedbackForm.applicant_rating) formData.append('applicant_rating', feedbackForm.applicant_rating)
      if (feedbackForm.final_score_recommendation.length > 0) formData.append('final_score_recommendation', JSON.stringify(feedbackForm.final_score_recommendation))
      if (feedbackForm.not_shortlisted_reason.length > 0) formData.append('not_shortlisted_reason', JSON.stringify(feedbackForm.not_shortlisted_reason))
      if (feedbackForm.withdrawn_reason.length > 0) formData.append('withdrawn_reason', JSON.stringify(feedbackForm.withdrawn_reason))
      if (feedbackForm.remarks) formData.append('remarks', feedbackForm.remarks)

      if (validSkills.length > 0) {
        const skillsToSend = validSkills.map(({ skill, rating }) => ({
          skill: skill.trim(),
          rating: Number(rating)
        }))
        console.log("Skills being sent:", skillsToSend)
        formData.append('skill_assessments', JSON.stringify(skillsToSend))
      }

      console.log("📤 Complete form data being sent:", Object.fromEntries(formData))
      console.log("📤 Candidate name in form:", feedbackForm.candidate_name)

      const response = await fetch(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.create_interview_feedback`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        }
      )

      const data = await response.json()
      console.log("✅ Full API Response:", data)

      if (response.ok && data.message) {
        const feedbackName = data.message.name || data.message.doc?.name
        console.log("✅ Created feedback with ID:", feedbackName)
        alert(`Interview Feedback ${feedbackName || ''} created successfully!`)

        console.log("✅ Redirecting to /feedback page...")
        router.push('/feedback')
      } else {
        // Handle error response
        const errorMessage = data.message || data.exception || "Failed to create interview feedback"
        console.error("❌ API Error:", errorMessage)
        alert(`Error: ${errorMessage}`)
      }

    } catch (error: any) {
      console.error("❌ Error creating interview feedback:", error)
      const errorMsg = error.message || "Failed to create interview feedback"
      alert(`Error: ${errorMsg}`)
    } finally {
      setIsSaving(false)
    }
  }

  const StarRating = ({ rating, onRate, editable = true }: { rating: number, onRate: (rating: number) => void, editable?: boolean }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => editable && onRate(star)}
            className={`transition-colors ${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            disabled={!editable}
          >
            <Star
              className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
            />
          </button>
        ))}
      </div>
    )
  }

  const RowActions = ({ skillId }: { skillId: string }) => {
    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 bg-red-50 hover:bg-red-100 text-red-600"
            onClick={() => removeSkillRow(skillId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertRowBelow(skillId)}
            className="h-9 px-3 hover:bg-gray-100"
          >
            Insert Below
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertRowAbove(skillId)}
            className="h-9 px-3 hover:bg-gray-100"
          >
            Insert Above
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => duplicateSkillRow(skillId)}
            className="h-9 w-9 p-0 hover:bg-gray-100"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const ColumnConfigModal = () => {
    if (!showColumnConfig) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4 border-0 shadow-xl">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <CardTitle>Configure Columns</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColumnConfig(false)}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-4 pb-2 border-b">
                <div></div>
                <Label className="font-semibold">Fieldname</Label>
                <Label className="font-semibold">Column Width</Label>
                <div></div>
              </div>
              {columnConfig.map((col, index) => (
                <div key={`column-${index}-${col.fieldname}`} className="grid grid-cols-[40px_1fr_1fr_40px] gap-4 items-center bg-gray-50 p-3 rounded">
                  <div className="flex items-center justify-center text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <Input
                    value={col.fieldname}
                    onChange={(e) => {
                      const newConfig = [...columnConfig]
                      newConfig[index].fieldname = e.target.value
                      setColumnConfig(newConfig)
                    }}
                    className="bg-white h-12"
                  />
                  <Input
                    type="number"
                    value={col.width}
                    onChange={(e) => {
                      const newConfig = [...columnConfig]
                      newConfig[index].width = parseInt(e.target.value) || 2
                      setColumnConfig(newConfig)
                    }}
                    className="bg-white h-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setColumnConfig(columnConfig.filter((_, i) => i !== index))
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setColumnConfig([...columnConfig, { fieldname: "", width: 2 }])
                }}
                className="text-blue-600 p-0"
              >
                + Add / Remove Columns
              </Button>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setColumnConfig([
                    { fieldname: "Skill", width: 2 },
                    { fieldname: "Rating", width: 2 }
                  ])
                }}
              >
                Reset to default
              </Button>
              <Button
                onClick={() => setShowColumnConfig(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/feedback')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                New Interview Feedback
              </h1>
            </div>
            <p className="text-muted-foreground">Provide detailed feedback for candidate interviews</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Interview <span className="text-red-500">*</span></Label>
                  <Select
                    value={feedbackForm.interview}
                    onValueChange={handleInterviewChange}
                    disabled={loading.interviews}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        loading.interviews ? "Loading..." :
                          interviews.length === 0 ? "No interviews found" :
                            "Select interview"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {interviews.map((interview) => (
                        <SelectItem key={interview.name} value={interview.name}>
                          {interview.name} - {interview.applicant_name || interview.job_applicant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Interviewer <span className="text-red-500">*</span></Label>
                  <Select
                    value={feedbackForm.interviewer}
                    onValueChange={(value) => setFeedbackForm({ ...feedbackForm, interviewer: value })}
                    disabled={loading.interviewers}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        loading.interviewers ? "Loading..." :
                          interviewers.length === 0 ? "No interviewers found" :
                            "Select interviewer"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewers.map((interviewer) => (
                        <SelectItem key={interviewer.name} value={interviewer.name}>
                          {interviewer.full_name} ({interviewer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {feedbackForm.job_applicant && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Job Applicant</Label>
                    <Input
                      value={feedbackForm.job_applicant}
                      disabled
                      className="bg-gray-50 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Interview Round</Label>
                    <Input
                      value={feedbackForm.interview_round}
                      disabled
                      className="bg-gray-50 h-12"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Candidate Name</Label>
                  <Input
                    value={feedbackForm.candidate_name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, candidate_name: e.target.value })}
                    placeholder="Enter candidate name"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Interview Date</Label>
                  <Input
                    type="date"
                    value={feedbackForm.interview_date}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, interview_date: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Position Applied For</Label>
                  <Input
                    value={feedbackForm.position_applied_for}
                    disabled
                    placeholder="Auto-populated from Job Opening"
                    className="bg-gray-100 h-12 text-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={feedbackForm.department}
                    disabled
                    placeholder="Auto-populated from Job Opening"
                    className="bg-gray-100 h-12 text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={feedbackForm.location}
                    disabled
                    placeholder="Auto-populated from Job Opening"
                    className="bg-gray-100 h-12 text-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Position</Label>
                  <Input
                    value={feedbackForm.new_position}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, new_position: e.target.value })}
                    placeholder="Enter new position"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Replacement Position</Label>
                <Input
                  value={feedbackForm.replacement_position}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, replacement_position: e.target.value })}
                  placeholder="Enter replacement position"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Result <span className="text-red-500">*</span></Label>
                <Select
                  value={feedbackForm.result}
                  onValueChange={(value) => setFeedbackForm({ ...feedbackForm, result: value })}
                  disabled={loading.resultOptions}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={
                      loading.resultOptions ? "Loading..." :
                        resultOptions.length === 0 ? "No options available" :
                          "Select result"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {resultOptions.map((result) => (
                      <SelectItem key={result} value={result}>
                        {result}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Skill Assessment</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowColumnConfig(true)}
                    className="h-9 w-9 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium w-16">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left p-4 text-sm font-medium w-20">No.</th>
                      <th className="text-left p-4 text-sm font-medium">
                        Skill <span className="text-red-500">*</span>
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Rating <span className="text-red-500">*</span>
                      </th>
                      <th className="w-12 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillAssessments.map((skill, index) => (
                      <React.Fragment key={skill.id}>
                        <tr className="border-b hover:bg-blue-50/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4 text-gray-600">{index + 1}</td>
                          <td className="p-4">
                            {/* <Select
                              value={skill.skill}
                              onValueChange={(value) => updateSkillAssessment(skill.id, 'skill', value)}
                              disabled={loading.skills}
                            >
                              <SelectTrigger className="border-0 focus:ring-1 h-12">
                                <SelectValue placeholder={
                                  loading.skills ? "Loading skills..." :
                                    availableSkills.length === 0 ? "No skills available" :
                                      "Select a skill"
                                } />
                              </SelectTrigger>
                              <SelectContent>
                                {availableSkills.map((skillName) => (
                                  <SelectItem key={skillName} value={skillName}>
                                    {skillName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select> */}
                            <Input
                              value={skill.skill}
                              disabled
                              className="border-0 bg-gray-50 h-12"
                            />
                          </td>
                          <td className="p-4">
                            <StarRating
                              rating={skill.rating}
                              onRate={(rating) => updateSkillAssessment(skill.id, 'rating', rating)}
                            />
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingRowId(editingRowId === skill.id ? null : skill.id)}
                              className="h-8 w-8 p-0"
                            >
                              ✏️
                            </Button>
                          </td>
                        </tr>
                        {editingRowId === skill.id && (
                          <tr>
                            <td colSpan={5} className="bg-blue-50/50 border-b">
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="font-semibold">Editing Row #{index + 1}</h3>
                                </div>
                                <div className="mb-4">
                                  <Label className="mb-2 block">Rating <span className="text-red-500">*</span></Label>
                                  <StarRating
                                    rating={skill.rating}
                                    onRate={(rating) => updateSkillAssessment(skill.id, 'rating', rating)}
                                  />
                                </div>
                                <RowActions skillId={skill.id} />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="p-4 border-t">
                <Button
                  variant="link"
                  onClick={addSkillRow}
                  className="text-blue-600 p-0"
                >
                  Add Row
                </Button>
              </div> */}
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Applicant Rating</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <Select
                  value={feedbackForm.applicant_rating}
                  onValueChange={(value) => setFeedbackForm({ ...feedbackForm, applicant_rating: value })}
                  disabled={loading.applicantRatingOptions}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={
                      loading.applicantRatingOptions ? "Loading ratings..." :
                        applicantRatingOptions.length === 0 ? "No ratings available" :
                          "Select rating"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {applicantRatingOptions.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Final Score & Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-4">
                <span className="text-lg font-semibold">Total Score:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {calculateTotalScore()} / 40
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Average (10 to 13)", "Good (14 to 18)", "Excellent (19 to 21)"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`final-score-${option}`}
                      checked={feedbackForm.final_score_recommendation.includes(option)}
                      disabled
                      className="rounded"
                    />
                    <label htmlFor={`final-score-${option}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="final-score-To be Offered"
                    checked={feedbackForm.final_score_recommendation.includes("To be Offered")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFeedbackForm({
                          ...feedbackForm,
                          final_score_recommendation: [...feedbackForm.final_score_recommendation, "To be Offered"]
                        })
                      } else {
                        setFeedbackForm({
                          ...feedbackForm,
                          final_score_recommendation: feedbackForm.final_score_recommendation.filter(item => item !== "To be Offered")
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="final-score-To be Offered" className="text-sm cursor-pointer">
                    To be Offered
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="final-score-Not Shortlisted"
                    checked={feedbackForm.final_score_recommendation.includes("Not Shortlisted")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFeedbackForm({
                          ...feedbackForm,
                          final_score_recommendation: [...feedbackForm.final_score_recommendation, "Not Shortlisted"]
                        })
                      } else {
                        setFeedbackForm({
                          ...feedbackForm,
                          final_score_recommendation: feedbackForm.final_score_recommendation.filter(item => item !== "Not Shortlisted")
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="final-score-Not Shortlisted" className="text-sm cursor-pointer">
                    Not Shortlisted
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="final-score-Candidature Withdrawn"
                    checked={feedbackForm.final_score_recommendation.includes("Candidature Withdrawn")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFeedbackForm({
                          ...feedbackForm,
                          final_score_recommendation: [...feedbackForm.final_score_recommendation, "Candidature Withdrawn"]
                        })
                      } else {
                        setFeedbackForm({
                          ...feedbackForm,
                          final_score_recommendation: feedbackForm.final_score_recommendation.filter(item => item !== "Candidature Withdrawn")
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="final-score-Candidature Withdrawn" className="text-sm cursor-pointer">
                    Candidature Withdrawn
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {showNotShortlistedSection && (
            <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b">
                <CardTitle>Not Shortlisted Reason</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {notShortlistedOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`not-shortlisted-${option}`}
                        checked={feedbackForm.not_shortlisted_reason.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeedbackForm({
                              ...feedbackForm,
                              not_shortlisted_reason: [...feedbackForm.not_shortlisted_reason, option]
                            })
                          } else {
                            setFeedbackForm({
                              ...feedbackForm,
                              not_shortlisted_reason: feedbackForm.not_shortlisted_reason.filter(item => item !== option)
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`not-shortlisted-${option}`} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {showWithdrawnSection && (
            <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b">
                <CardTitle>Withdrawn Reason</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {withdrawnReasonOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`withdrawn-${option}`}
                        checked={feedbackForm.withdrawn_reason.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeedbackForm({
                              ...feedbackForm,
                              withdrawn_reason: [...feedbackForm.withdrawn_reason, option]
                            })
                          } else {
                            setFeedbackForm({
                              ...feedbackForm,
                              withdrawn_reason: feedbackForm.withdrawn_reason.filter(item => item !== option)
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={`withdrawn-${option}`} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Remarks</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={feedbackForm.remarks}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, remarks: e.target.value })}
                  placeholder="Enter remarks..."
                  className="min-h-[150px]"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                placeholder="Enter detailed feedback about the candidate's performance..."
                className="min-h-[150px]"
                rows={6}
              />
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/feedback')}
              disabled={isSaving}
              className="px-8 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-12"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <ColumnConfigModal />
    </div>
  )
}
