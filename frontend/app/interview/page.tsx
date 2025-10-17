// "use client"
// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Calendar,
//   Clock,
//   Video,
//   MapPin,
//   Phone,
//   Mail,
//   ArrowLeft,
//   Plus,
//   Edit,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Users,
// } from "lucide-react"
// import Link from "next/link"

// interface Candidate {
//   id: string
//   name: string
//   email: string
//   phone: string
//   position: string
//   experience: string
//   skills: string[]
//   resumeScore: number
//   status: "shortlisted" | "interview-scheduled" | "interviewed" | "pending-interview"
//   appliedDate: string
//   interviewDetails?: {
//     date: string
//     time: string
//     type: "in-person" | "video" | "phone"
//     location?: string
//     interviewers: string[]
//     round: number
//     notes?: string
//   }
// }

// interface InterviewSlot {
//   date: string
//   time: string
//   available: boolean
//   interviewer: string
// }

// export default function InterviewPage() {
//   const [candidates] = useState<Candidate[]>([
//     {
//       id: "1",
//       name: "Sarah Johnson",
//       email: "sarah.johnson@email.com",
//       phone: "+91 98765 43210",
//       position: "Senior Developer",
//       experience: "5+ years",
//       skills: ["React", "Node.js", "TypeScript", "AWS"],
//       resumeScore: 92,
//       status: "shortlisted",
//       appliedDate: "2025-01-15",
//     },
//     {
//       id: "2",
//       name: "Michael Chen",
//       email: "michael.chen@email.com",
//       phone: "+91 98765 43211",
//       position: "Senior Developer",
//       experience: "4+ years",
//       skills: ["Vue.js", "Python", "Docker", "MongoDB"],
//       resumeScore: 88,
//       status: "interview-scheduled",
//       appliedDate: "2025-01-14",
//       interviewDetails: {
//         date: "2025-01-25",
//         time: "10:00 AM",
//         type: "video",
//         interviewers: ["John Doe", "Jane Smith"],
//         round: 1,
//       },
//     },
//     {
//       id: "3",
//       name: "Emily Rodriguez",
//       email: "emily.rodriguez@email.com",
//       phone: "+91 98765 43212",
//       position: "Senior Developer",
//       experience: "6+ years",
//       skills: ["Angular", "Java", "Kubernetes", "PostgreSQL"],
//       resumeScore: 95,
//       status: "interviewed",
//       appliedDate: "2025-01-13",
//       interviewDetails: {
//         date: "2025-01-20",
//         time: "2:00 PM",
//         type: "in-person",
//         location: "Conference Room A",
//         interviewers: ["John Doe", "Mike Wilson"],
//         round: 1,
//         notes: "Strong technical skills, good communication",
//       },
//     },
//   ])



//   const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
//   const [showScheduleForm, setShowScheduleForm] = useState(false)
//   const [interviewForm, setInterviewForm] = useState({
//     date: "",
//     time: "",
//     type: "video" as "in-person" | "video" | "phone",
//     location: "",
//     interviewers: [] as string[],
//     round: 1,
//     duration: "60",
//     notes: "",
//   })

//   const [availableInterviewers] = useState([
//     "John Doe - Tech Lead",
//     "Jane Smith - Senior Developer",
//     "Mike Wilson - Engineering Manager",
//     "Sarah Davis - HR Manager",
//     "Alex Kumar - Product Manager",
//   ])

//   const [filterStatus, setFilterStatus] = useState("all")

//   const filteredCandidates = candidates.filter(
//     (candidate) => filterStatus === "all" || candidate.status === filterStatus,
//   )

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "interviewed":
//         return "bg-green-500"
//       case "interview-scheduled":
//         return "bg-blue-500"
//       case "shortlisted":
//         return "bg-yellow-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "interviewed":
//         return "Interviewed"
//       case "interview-scheduled":
//         return "Interview Scheduled"
//       case "shortlisted":
//         return "Ready for Interview"
//       default:
//         return "Pending"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "interviewed":
//         return <CheckCircle className="h-4 w-4" />
//       case "interview-scheduled":
//         return <Clock className="h-4 w-4" />
//       case "shortlisted":
//         return <AlertCircle className="h-4 w-4" />
//       default:
//         return <XCircle className="h-4 w-4" />
//     }
//   }

//   const handleScheduleInterview = () => {
//     console.log("Scheduling interview for:", selectedCandidate?.name, interviewForm)
//     setShowScheduleForm(false)
//     setInterviewForm({
//       date: "",
//       time: "",
//       type: "video",
//       location: "",
//       interviewers: [],
//       round: 1,
//       duration: "60",
//       notes: "",
//     })
//   }

//   const handleInterviewerToggle = (interviewer: string) => {
//     setInterviewForm((prev) => ({
//       ...prev,
//       interviewers: prev.interviewers.includes(interviewer)
//         ? prev.interviewers.filter((i) => i !== interviewer)
//         : [...prev.interviewers, interviewer],
//     }))
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
//       <div className="container mx-auto p-8 space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="space-y-2">
//             <div className="flex items-center space-x-4">
//               <Link href="/">
//                 <Button variant="outline" size="sm">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back to Dashboard
//                 </Button>
//               </Link>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
//                 Interview Management
//               </h1>
//             </div>
//             <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
//           </div>

//           <div className="flex items-center space-x-4">
//             <Select value={filterStatus} onValueChange={setFilterStatus}>
//               <SelectTrigger className="w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Candidates</SelectItem>
//                 <SelectItem value="shortlisted">Ready for Interview</SelectItem>
//                 <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
//                 <SelectItem value="interviewed">Interviewed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Interview Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="text-2xl font-bold text-yellow-600">
//                 {candidates.filter((c) => c.status === "shortlisted").length}
//               </div>
//               <div className="text-sm text-muted-foreground">Ready for Interview</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="text-2xl font-bold text-blue-600">
//                 {candidates.filter((c) => c.status === "interview-scheduled").length}
//               </div>
//               <div className="text-sm text-muted-foreground">Scheduled</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="text-2xl font-bold text-green-600">
//                 {candidates.filter((c) => c.status === "interviewed").length}
//               </div>
//               <div className="text-sm text-muted-foreground">Completed</div>
//             </CardContent>
//           </Card>
//           <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//             <CardContent className="p-6 text-center">
//               <div className="text-2xl font-bold text-orange-600">85%</div>
//               <div className="text-sm text-muted-foreground">Show-up Rate</div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Candidates List */}
//           <div className="lg:col-span-2 space-y-4">
//             <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Users className="h-5 w-5" />
//                   <span>Candidates ({filteredCandidates.length})</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {filteredCandidates.map((candidate) => (
//                   <Card
//                     key={candidate.id}
//                     className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
//                       selectedCandidate?.id === candidate.id ? "ring-2 ring-orange-500" : ""
//                     }`}
//                     onClick={() => setSelectedCandidate(candidate)}
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-start space-x-4">
//                           <Avatar className="h-12 w-12">
//                             <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
//                               {candidate.name
//                                 .split(" ")
//                                 .map((n) => n[0])
//                                 .join("")}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="space-y-2">
//                             <div>
//                               <h3 className="font-semibold">{candidate.name}</h3>
//                               <p className="text-sm text-muted-foreground">{candidate.position}</p>
//                             </div>
//                             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
//                               <div className="flex items-center space-x-1">
//                                 <Mail className="h-3 w-3" />
//                                 <span>{candidate.email}</span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Phone className="h-3 w-3" />
//                                 <span>{candidate.phone}</span>
//                               </div>
//                             </div>
//                             <div className="flex flex-wrap gap-1">
//                               {candidate.skills.slice(0, 3).map((skill) => (
//                                 <Badge key={skill} variant="secondary" className="text-xs">
//                                   {skill}
//                                 </Badge>
//                               ))}
//                               {candidate.skills.length > 3 && (
//                                 <Badge variant="outline" className="text-xs">
//                                   +{candidate.skills.length - 3} more
//                                 </Badge>
//                               )}
//                             </div>
//                             {candidate.interviewDetails && (
//                               <div className="bg-blue-50 p-2 rounded text-sm">
//                                 <div className="flex items-center space-x-2 text-blue-700">
//                                   <Calendar className="h-3 w-3" />
//                                   <span>
//                                     {candidate.interviewDetails.date} at {candidate.interviewDetails.time}
//                                   </span>
//                                   {candidate.interviewDetails.type === "video" && <Video className="h-3 w-3" />}
//                                   {candidate.interviewDetails.type === "in-person" && <MapPin className="h-3 w-3" />}
//                                   {candidate.interviewDetails.type === "phone" && <Phone className="h-3 w-3" />}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right space-y-2">
//                           <Badge className={getStatusColor(candidate.status)}>
//                             <div className="flex items-center space-x-1">
//                               {getStatusIcon(candidate.status)}
//                               <span>{getStatusText(candidate.status)}</span>
//                             </div>
//                           </Badge>
//                           <div className="text-sm">
//                             <div className="font-semibold text-green-600">{candidate.resumeScore}%</div>
//                             <div className="text-xs text-muted-foreground">Match Score</div>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Interview Management Panel */}
//           <div className="space-y-6">
//             {selectedCandidate ? (
//               <>
//                 <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <Calendar className="h-5 w-5" />
//                       <span>Interview Management</span>
//                     </CardTitle>
//                     <CardDescription className="text-orange-100">For {selectedCandidate.name}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {selectedCandidate.status === "shortlisted" && (
//                       <Button
//                         className="w-full bg-white text-orange-600 hover:bg-orange-50"
//                         onClick={() => setShowScheduleForm(true)}
//                       >
//                         <Plus className="h-4 w-4 mr-2" />
//                         Schedule Interview
//                       </Button>
//                     )}
//                     {selectedCandidate.status === "interview-scheduled" && (
//                       <div className="space-y-2">
//                         <Button
//                           className="w-full bg-white text-orange-600 hover:bg-orange-50"
//                           onClick={() => setShowScheduleForm(true)}
//                         >
//                           <Edit className="h-4 w-4 mr-2" />
//                           Reschedule Interview
//                         </Button>
//                         <Button
//                           variant="outline"
//                           className="w-full bg-green-500 hover:bg-green-600 text-white border-green-400"
//                         >
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Mark as Completed
//                         </Button>
//                       </div>
//                     )}
//                     {selectedCandidate.status === "interviewed" && (
//                       <div className="text-center text-orange-100">
//                         <CheckCircle className="h-8 w-8 mx-auto mb-2" />
//                         <p>Interview Completed</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Interview Details */}
//                 {selectedCandidate.interviewDetails && (
//                   <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                     <CardHeader>
//                       <CardTitle className="text-lg">Interview Details</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="font-medium text-muted-foreground">Date & Time:</span>
//                           <p>
//                             {selectedCandidate.interviewDetails.date} at {selectedCandidate.interviewDetails.time}
//                           </p>
//                         </div>
//                         <div>
//                           <span className="font-medium text-muted-foreground">Type:</span>
//                           <p className="capitalize">{selectedCandidate.interviewDetails.type}</p>
//                         </div>
//                         <div>
//                           <span className="font-medium text-muted-foreground">Round:</span>
//                           <p>Round {selectedCandidate.interviewDetails.round}</p>
//                         </div>
//                         {selectedCandidate.interviewDetails.location && (
//                           <div>
//                             <span className="font-medium text-muted-foreground">Location:</span>
//                             <p>{selectedCandidate.interviewDetails.location}</p>
//                           </div>
//                         )}
//                       </div>
//                       <div>
//                         <span className="font-medium text-muted-foreground">Interviewers:</span>
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           {selectedCandidate.interviewDetails.interviewers.map((interviewer) => (
//                             <Badge key={interviewer} variant="outline">
//                               {interviewer}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                       {selectedCandidate.interviewDetails.notes && (
//                         <div>
//                           <span className="font-medium text-muted-foreground">Notes:</span>
//                           <p className="text-sm mt-1">{selectedCandidate.interviewDetails.notes}</p>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* Schedule Interview Form */}
//                 {showScheduleForm && (
//                   <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                     <CardHeader>
//                       <CardTitle className="text-lg">Schedule Interview</CardTitle>
//                       <CardDescription>Set up interview details</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="date">Date</Label>
//                           <Input
//                             id="date"
//                             type="date"
//                             value={interviewForm.date}
//                             onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="time">Time</Label>
//                           <Input
//                             id="time"
//                             type="time"
//                             value={interviewForm.time}
//                             onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label>Interview Type</Label>
//                         <Select
//                           value={interviewForm.type}
//                           onValueChange={(value: "in-person" | "video" | "phone") =>
//                             setInterviewForm({ ...interviewForm, type: value })
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="video">Video Call</SelectItem>
//                             <SelectItem value="in-person">In-Person</SelectItem>
//                             <SelectItem value="phone">Phone Call</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {interviewForm.type === "in-person" && (
//                         <div className="space-y-2">
//                           <Label htmlFor="location">Location</Label>
//                           <Input
//                             id="location"
//                             value={interviewForm.location}
//                             onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
//                             placeholder="Conference Room A"
//                           />
//                         </div>
//                       )}

//                       <div className="space-y-2">
//                         <Label>Select Interviewers</Label>
//                         <div className="space-y-2 max-h-32 overflow-y-auto">
//                           {availableInterviewers.map((interviewer) => (
//                             <div key={interviewer} className="flex items-center space-x-2">
//                               <Checkbox
//                                 id={interviewer}
//                                 checked={interviewForm.interviewers.includes(interviewer)}
//                                 onCheckedChange={() => handleInterviewerToggle(interviewer)}
//                               />
//                               <Label htmlFor={interviewer} className="text-sm">
//                                 {interviewer}
//                               </Label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="round">Interview Round</Label>
//                           <Select
//                             value={interviewForm.round.toString()}
//                             onValueChange={(value) =>
//                               setInterviewForm({ ...interviewForm, round: Number.parseInt(value) })
//                             }
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="1">Round 1 - Technical</SelectItem>
//                               <SelectItem value="2">Round 2 - Managerial</SelectItem>
//                               <SelectItem value="3">Round 3 - HR</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="duration">Duration (minutes)</Label>
//                           <Select
//                             value={interviewForm.duration}
//                             onValueChange={(value) => setInterviewForm({ ...interviewForm, duration: value })}
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="30">30 minutes</SelectItem>
//                               <SelectItem value="45">45 minutes</SelectItem>
//                               <SelectItem value="60">60 minutes</SelectItem>
//                               <SelectItem value="90">90 minutes</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="notes">Additional Notes</Label>
//                         <Textarea
//                           id="notes"
//                           value={interviewForm.notes}
//                           onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
//                           placeholder="Any special instructions or notes..."
//                           rows={3}
//                         />
//                       </div>

//                       <div className="flex space-x-2">
//                         <Button onClick={handleScheduleInterview} className="flex-1 bg-orange-600 hover:bg-orange-700">
//                           Schedule Interview
//                         </Button>
//                         <Button variant="outline" onClick={() => setShowScheduleForm(false)} className="flex-1">
//                           Cancel
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </>
//             ) : (
//               <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                 <CardContent className="p-8 text-center">
//                   <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="font-semibold mb-2">Select a Candidate</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Choose a candidate to schedule or manage their interview.
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



























"use client"
import { useState,useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import { API_AUTH } from "../create-job/page"

interface Candidate {
  id: string
  applicant_name: string
  email_id: string
  phone_number: string
  position: string
  experience: string
  skills: string[]
  resumeScore: number
  status: "shortlisted" | "interview-scheduled" | "interviewed" | "pending-interview"
  appliedDate: string
  interviewDetails?: {
    date: string
    time: string
    type: "in-person" | "video" | "phone"
    location?: string
    interviewers: string[]
    round: number
    notes?: string
  }
}

interface InterviewSlot {
  date: string
  time: string
  available: boolean
  interviewer: string
}

export default function InterviewPage() {
  const [candidates,setCandidate] = useState<Candidate[]>([
    {
      id: "1",
      applicant_name: "Sarah Johnson",
      email_id: "sarah.johnson@email.com",
      phone_number: "+91 98765 43210",
      position: "Senior Developer",
      experience: "5+ years",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      resumeScore: 92,
      status: "shortlisted",
      appliedDate: "2025-01-15",
    },
    {
      id: "2",
      applicant_name: "Michael Chen",
      email_id: "michael.chen@email.com",
      phone_number: "+91 98765 43211",
      position: "Senior Developer",
      experience: "4+ years",
      skills: ["Vue.js", "Python", "Docker", "MongoDB"],
      resumeScore: 88,
      status: "interview-scheduled",
      appliedDate: "2025-01-14",
      interviewDetails: {
        date: "2025-01-25",
        time: "10:00 AM",
        type: "video",
        interviewers: ["John Doe", "Jane Smith"],
        round: 1,
      },
    },
    {
      id: "3",
      applicant_name: "Emily Rodriguez",
      email_id: "emily.rodriguez@email.com",
      phone_number: "+91 98765 43212",
      position: "Senior Developer",
      experience: "6+ years",
      skills: ["Angular", "Java", "Kubernetes", "PostgreSQL"],
      resumeScore: 95,
      status: "interviewed",
      appliedDate: "2025-01-13",
      interviewDetails: {
        date: "2025-01-20",
        time: "2:00 PM",
        type: "in-person",
        location: "Conference Room A",
        interviewers: ["John Doe", "Mike Wilson"],
        round: 1,
        notes: "Strong technical skills, good communication",
      },
    },
  ])

const fetchJobApplicant = async () => {
  try {
    const test = await axios.get(
      // `https://demo.octavision.in/api/resource/Job Applicant/?fields=["*"]`,
      `http://172.23.88.43:8000/api/resource/Job Applicant/?fields=["*"]`,
       API_AUTH

      // {
      //   headers: {
      //     "Authorization": "token 8855534c0a94f54:5884960c6bdbc73"
      //   }
      // }
    );
    console.log(test);
    setCandidate(test.data.data);
  } catch (error) {
    console.error("Error fetching job applicants:", error);
  }
};

  useEffect(() => {
   fetchJobApplicant()
  }, [])
  

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    type: "video" as "in-person" | "video" | "phone",
    location: "",
    interviewers: [] as string[],
    round: 1,
    duration: "60",
    notes: "",
  })

  const [availableInterviewers] = useState([
    "John Doe - Tech Lead",
    "Jane Smith - Senior Developer",
    "Mike Wilson - Engineering Manager",
    "Sarah Davis - HR Manager",
    "Alex Kumar - Product Manager",
  ])

  const [filterStatus, setFilterStatus] = useState("all")

  const filteredCandidates = candidates.filter(
    (candidate) => filterStatus === "all" || candidate.status === filterStatus,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interviewed":
        return "bg-green-500"
      case "interview-scheduled":
        return "bg-blue-500"
      case "shortlisted":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "interviewed":
        return "Interviewed"
      case "interview-scheduled":
        return "Interview Scheduled"
      case "shortlisted":
        return "Ready for Interview"
      default:
        return "Pending"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "interviewed":
        return <CheckCircle className="h-4 w-4" />
      case "interview-scheduled":
        return <Clock className="h-4 w-4" />
      case "shortlisted":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const handleScheduleInterview = () => {
    console.log("Scheduling interview for:", selectedCandidate?.applicant_name, interviewForm)
    setShowScheduleForm(false)
    setInterviewForm({
      date: "",
      time: "",
      type: "video",
      location: "",
      interviewers: [],
      round: 1,
      duration: "60",
      notes: "",
    })
  }

  const handleInterviewerToggle = (interviewer: string) => {
    setInterviewForm((prev) => ({
      ...prev,
      interviewers: prev.interviewers.includes(interviewer)
        ? prev.interviewers.filter((i) => i !== interviewer)
        : [...prev.interviewers, interviewer],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Interview Management
              </h1>
            </div>
            <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Candidates</SelectItem>
                <SelectItem value="shortlisted">Ready for Interview</SelectItem>
                <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Interview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {candidates.filter((c) => c.status === "shortlisted").length}
              </div>
              <div className="text-sm text-muted-foreground">Ready for Interview</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {candidates.filter((c) => c.status === "interview-scheduled").length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {candidates.filter((c) => c.status === "interviewed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-muted-foreground">Show-up Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidates List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Candidates ({filteredCandidates.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredCandidates.map((candidate, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedCandidate?.id === candidate.id ? "ring-2 ring-orange-500" : ""
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                              {candidate.applicant_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold">{candidate.applicant_name}</h3>
                              <p className="text-sm text-muted-foreground">{candidate.position}</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{candidate.email_id}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{candidate.phone_number}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                            <div>
                              <span>{candidate.designation}</span>
                            </div>
                             <div>
                              <span>{candidate.status}</span>
                            </div>
                              {/* {candidate.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))} */}
                              {/* {candidate.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.skills.length - 3} more
                                </Badge>
                              )} */}
                            </div>
                            {candidate.interviewDetails && (
                              <div className="bg-blue-50 p-2 rounded text-sm">
                                <div className="flex items-center space-x-2 text-blue-700">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {candidate.interviewDetails.date} at {candidate.interviewDetails.time}
                                  </span>
                                  {candidate.interviewDetails.type === "video" && <Video className="h-3 w-3" />}
                                  {candidate.interviewDetails.type === "in-person" && <MapPin className="h-3 w-3" />}
                                  {candidate.interviewDetails.type === "phone" && <Phone className="h-3 w-3" />}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(candidate.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(candidate.status)}
                              <span>{getStatusText(candidate.status)}</span>
                            </div>
                          </Badge>
                          <div className="text-sm">
                            <div className="font-semibold text-green-600">{candidate.resumeScore}%</div>
                            <div className="text-xs text-muted-foreground">Match Score</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Interview Management Panel */}
          <div className="space-y-6">
            {selectedCandidate ? (
              <>
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Interview Management</span>
                    </CardTitle>
                    <CardDescription className="text-orange-100">For {selectedCandidate.applicant_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedCandidate.status === "shortlisted" && (
                      <Button
                        className="w-full bg-white text-orange-600 hover:bg-orange-50"
                        onClick={() => setShowScheduleForm(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Interview
                      </Button>
                    )}
                    {selectedCandidate.status === "interview-scheduled" && (
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-white text-orange-600 hover:bg-orange-50"
                          onClick={() => setShowScheduleForm(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Reschedule Interview
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-green-500 hover:bg-green-600 text-white border-green-400"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                    {selectedCandidate.status === "interviewed" && (
                      <div className="text-center text-orange-100">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>Interview Completed</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interview Details */}
                {selectedCandidate.interviewDetails && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Interview Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Date & Time:</span>
                          <p>
                            {selectedCandidate.interviewDetails.date} at {selectedCandidate.interviewDetails.time}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Type:</span>
                          <p className="capitalize">{selectedCandidate.interviewDetails.type}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Round:</span>
                          <p>Round {selectedCandidate.interviewDetails.round}</p>
                        </div>
                        {selectedCandidate.interviewDetails.location && (
                          <div>
                            <span className="font-medium text-muted-foreground">Location:</span>
                            <p>{selectedCandidate.interviewDetails.location}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Interviewers:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCandidate.interviewDetails.interviewers.map((interviewer) => (
                            <Badge key={interviewer} variant="outline">
                              {interviewer}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedCandidate.interviewDetails.notes && (
                        <div>
                          <span className="font-medium text-muted-foreground">Notes:</span>
                          <p className="text-sm mt-1">{selectedCandidate.interviewDetails.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Schedule Interview Form */}
                {showScheduleForm && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Schedule Interview</CardTitle>
                      <CardDescription>Set up interview details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={interviewForm.date}
                            onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={interviewForm.time}
                            onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Interview Type</Label>
                        <Select
                          value={interviewForm.type}
                          onValueChange={(value: "in-person" | "video" | "phone") =>
                            setInterviewForm({ ...interviewForm, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video Call</SelectItem>
                            <SelectItem value="in-person">In-Person</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                          </SelectContent>  
                        </Select>
                      </div>

                      {interviewForm.type === "in-person" && (
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={interviewForm.location}
                            onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                            placeholder="Conference Room A"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Select Interviewers</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {availableInterviewers.map((interviewer) => (
                            <div key={interviewer} className="flex items-center space-x-2">
                              <Checkbox
                                id={interviewer}
                                checked={interviewForm.interviewers.includes(interviewer)}
                                onCheckedChange={() => handleInterviewerToggle(interviewer)}
                              />
                              <Label htmlFor={interviewer} className="text-sm">
                                {interviewer}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="round">Interview Round</Label>
                          <Select
                            value={interviewForm.round.toString()}
                            onValueChange={(value) =>
                              setInterviewForm({ ...interviewForm, round: Number.parseInt(value) })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Round 1 - Technical</SelectItem>
                              <SelectItem value="2">Round 2 - Managerial</SelectItem>
                              <SelectItem value="3">Round 3 - HR</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Select
                            value={interviewForm.duration}
                            onValueChange={(value) => setInterviewForm({ ...interviewForm, duration: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={interviewForm.notes}
                          onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                          placeholder="Any special instructions or notes..."
                          rows={3}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleScheduleInterview} className="flex-1 bg-orange-600 hover:bg-orange-700">
                          Schedule Interview
                        </Button>
                        <Button variant="outline" onClick={() => setShowScheduleForm(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Select a Candidate</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a candidate to schedule or manage their interview.
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
