
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { axiosConfig } from '@/lib/axios-config'


interface Interviewer {
  name: string
  full_name: string
  email: string
}

interface JobApplicant {
  name: string
  applicant_name: string
  email_id: string
}

interface InterviewRound {
  name: string
  round_name: string
}

interface Location {
  name: string
}

// const API_AUTH = {
//   headers: {
//     Authorization: `token 09481bf19b467f7:39bb84748d00090`,
//   },
// }

export default function EventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get applicant info from URL params
  const applicantId = searchParams.get('applicantId')
  const applicantName = searchParams.get('applicantName')
  const applicantEmail = searchParams.get('applicantEmail')

  // Debug logging
  useEffect(() => {
    console.log("=== URL Parameters ===")
    console.log("applicantId:", applicantId)
    console.log("applicantName:", applicantName)
    console.log("applicantEmail:", applicantEmail)
    console.log("Full URL:", window.location.href)
  }, [applicantId, applicantName, applicantEmail])

  const [eventForm, setEventForm] = useState({
    interviewRound: "",
    jobApplicant: applicantId || "",
    resumeLink: "",
    meetingLink: "",
    location: "",
    status: "Pending",
    scheduledOn: "",
    fromTime: "",
    toTime: "",
    interviewers: [] as string[],
  })

  const [availableInterviewers, setAvailableInterviewers] = useState<Interviewer[]>([])
  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const statusOptions = ["Pending", "Under Review", "Cleared", "Rejected"]

  useEffect(() => {
    fetchInterviewers()
    fetchInterviewRounds()
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `http://172.23.88.43:8000/api/resource/Location?fields=["name"]&limit_page_length=100`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }

      )
      const data = await response.json()

      if (data && data.data) {
        setLocations(data.data)
        console.log("Fetched locations:", data.data)
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const fetchInterviewRounds = async () => {
    try {
      const response = await fetch(
        `http://172.23.88.43:8000/api/resource/Interview Round?fields=["name","round_name"]&limit_page_length=100`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()

      if (data && data.data) {
        setInterviewRounds(data.data)
        console.log("Fetched interview rounds:", data.data)
      }
    } catch (error) {
      console.error("Error fetching interview rounds:", error)
      setInterviewRounds([
        { name: "First Round", round_name: "First Round" },
        { name: "Second Round", round_name: "Second Round" },
        { name: "Final Round", round_name: "Final Round" },
      ])
    }
  }

  const fetchInterviewers = async () => {
    try {
      const response = await fetch(
        `http://172.23.88.43:8000/api/resource/User?fields=["name","full_name","email"]&filters=[["enabled","=",1]]&limit_page_length=100`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()

      if (data && data.data) {
        const filteredUsers = data.data.filter(
          (user: any) => user.name !== "Administrator" && user.name !== "Guest"
        )
        setAvailableInterviewers(filteredUsers)
        console.log("Fetched interviewers:", filteredUsers)
      }
    } catch (error) {
      console.error("Error fetching interviewers:", error)
    }
  }

  const handleInterviewerToggle = (interviewer: string) => {
    setEventForm((prev) => ({
      ...prev,
      interviewers: prev.interviewers.includes(interviewer)
        ? prev.interviewers.filter((i) => i !== interviewer)
        : [...prev.interviewers, interviewer],
    }))
  }

  const handleSaveEvent = async () => {
    if (!eventForm.interviewRound || !eventForm.jobApplicant || !eventForm.scheduledOn || !eventForm.fromTime || !eventForm.toTime) {
      alert("Please fill all required fields")
      return
    }

    console.log("=== DEBUG ===");
    console.log("Meeting Link from state:", eventForm.meetingLink);

    setIsSaving(true)
    try {
      // Create FormData for Frappe API
      const formData = new URLSearchParams();
      formData.append('interview_round', eventForm.interviewRound);
      formData.append('job_applicant', eventForm.jobApplicant);
      formData.append('resume_link', eventForm.resumeLink || '');
      formData.append('meeting_link', eventForm.meetingLink || '');
      formData.append('location', eventForm.location || '');
      formData.append('status', eventForm.status);
      formData.append('scheduled_on', eventForm.scheduledOn);
      formData.append('from_time', eventForm.fromTime);
      formData.append('to_time', eventForm.toTime);
      formData.append('notes', '');
      formData.append('interviewers', JSON.stringify(eventForm.interviewers));

      const response = await fetch(
        `http://172.23.88.43:8000/api/method/resume.api.interview.create_interview_event`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        }
      )

      const data = await response.json()
      console.log("API Response:", data);

      if (data && data.message) {
        alert(data.message.message || "Interview created successfully!")
        console.log("Created interview:", data)
        router.back()
      }
    } catch (error: any) {
      console.error("Error creating interview:", error)
      alert("Failed to create interview: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                New Interview
              </h1>
            </div>
            <p className="text-muted-foreground">Schedule a new interview for candidates</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Interview Round <span className="text-red-500">*</span></Label>
                  {interviewRounds.length > 0 ? (
                    <Select
                      value={eventForm.interviewRound}
                      onValueChange={(value) => setEventForm({ ...eventForm, interviewRound: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select round" />
                      </SelectTrigger>
                      <SelectContent>
                        {interviewRounds.map((round) => (
                          <SelectItem key={round.name} value={round.name}>
                            {round.round_name || round.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={eventForm.interviewRound}
                      onChange={(e) => setEventForm({ ...eventForm, interviewRound: e.target.value })}
                      placeholder="Loading rounds..."
                      className="h-12"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={eventForm.status}
                    onValueChange={(value) => setEventForm({ ...eventForm, status: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Applicant <span className="text-red-500">*</span></Label>
                {applicantId && applicantName ? (
                  <div className="h-12 px-4 py-2 bg-gray-50 border rounded-md flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {applicantName}
                      </span>
                      {/* {applicantEmail && (
                        <span className="text-xs text-gray-500">
                          {applicantEmail}
                        </span>
                      )} */}
                    </div>
                    {/* <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Selected
                    </Badge> */}
                  </div>
                ) : (
                  <div className="h-12 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
                    <span className="text-sm text-yellow-800">
                      ⚠️ No applicant selected. Please go back and select a candidate.
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Resume link</Label>
                <Input
                  type="url"
                  value={eventForm.resumeLink}
                  onChange={(e) => setEventForm({ ...eventForm, resumeLink: e.target.value })}
                  placeholder="Enter resume URL"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input
                  type="url"
                  value={eventForm.meetingLink}
                  onChange={(e) => setEventForm({ ...eventForm, meetingLink: e.target.value })}
                  placeholder="Enter meeting URL (e.g., Zoom, Google Meet)"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                {locations.length > 0 ? (
                  <Select
                    value={eventForm.location}
                    onValueChange={(value) => setEventForm({ ...eventForm, location: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.name} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Loading locations..."
                    className="h-12"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Scheduled On <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={eventForm.scheduledOn}
                  onChange={(e) => setEventForm({ ...eventForm, scheduledOn: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>From Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={eventForm.fromTime}
                    onChange={(e) => setEventForm({ ...eventForm, fromTime: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={eventForm.toTime}
                    onChange={(e) => setEventForm({ ...eventForm, toTime: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interviewers Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
            <CardHeader className="border-b">
              <CardTitle>Interviewers</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <tr>
                      <th className="text-left p-3 w-12">
                        <Checkbox disabled />
                      </th>
                      <th className="text-left p-3 w-20 text-sm font-medium text-gray-700">No.</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Interviewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableInterviewers.length > 0 ? (
                      availableInterviewers.map((interviewer, index) => (
                        <tr key={interviewer.name} className="border-b hover:bg-blue-50/50 transition-colors">
                          <td className="p-3">
                            <Checkbox
                              checked={eventForm.interviewers.includes(interviewer.name)}
                              onCheckedChange={() => handleInterviewerToggle(interviewer.name)}
                            />
                          </td>
                          <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {interviewer.full_name || interviewer.name}
                              </span>
                              <span className="text-xs text-gray-500">{interviewer.email}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-gray-500">
                          Loading interviewers...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {eventForm.interviewers.length > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    {eventForm.interviewers.length} interviewer{eventForm.interviewers.length !== 1 ? 's' : ''} selected
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveEvent}
              disabled={isSaving || !applicantId}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-12"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
