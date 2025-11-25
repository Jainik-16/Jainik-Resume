"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import axios from "axios"
import { axiosConfig } from '@/lib/axios-config'
import { ArrowLeft } from "lucide-react"

const API_MODULE_PATH = "resume.api.offer_letter"
const API_BASE_URL = "http://172.23.88.43:8000"

interface JobApplicant {
  name: string
  applicant_name: string
  email_id: string
}

interface JobOfferTemplate {
  name: string
  offer_term_template_name?: string
}

interface Company {
  name: string
  company_name: string
}

interface Designation {
  name: string
  designation_name: string
}

interface OfferTerm {
  id: string
  offer_term: string
  value_description: string
}

export default function JobOfferPage() {
  const router = useRouter()
  const [offerForm, setOfferForm] = useState({
    jobApplicant: "",
    applicantName: "",
    applicantEmail: "",
    status: "Awaiting Response",
    offerDate: "",
    designation: "",
    company: "",
    jobOfferTemplate: "",
  })

  const [offerTerms, setOfferTerms] = useState<OfferTerm[]>([])
  const [jobApplicants, setJobApplicants] = useState<JobApplicant[]>([])
  const [templates, setTemplates] = useState<JobOfferTemplate[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState({
    applicants: true,
    templates: true,
    companies: true,
    designations: true
  })

  const statusOptions = [
    "Awaiting Response",
    "Accepted",
    "Rejected",
    "Pending"
  ]

  useEffect(() => {
    fetchJobApplicants()
    fetchTemplates()
    fetchCompanies()
    fetchDesignations()
  }, [])

  useEffect(() => {
    if (offerForm.jobOfferTemplate) {
      fetchTemplateTerms(offerForm.jobOfferTemplate);
    }
  }, [offerForm.jobOfferTemplate]);

  const fetchJobApplicants = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_applicants`,
        axiosConfig
      )

      const data = response.data?.message?.data || []
      setJobApplicants(data)
      console.log("✅ Fetched job applicants:", data.length)
    } catch (error: any) {
      console.error("❌ Error fetching job applicants:", error)
      setJobApplicants([])
    } finally {
      setLoading(prev => ({ ...prev, applicants: false }))
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_job_offer_templates`,
        axiosConfig
      )

      const data = response.data?.message?.data || []
      setTemplates(data)
      console.log("✅ Fetched templates:", data.length)
    } catch (error: any) {
      console.warn("⚠️ Templates not available:", error.message)
      setTemplates([])
    } finally {
      setLoading(prev => ({ ...prev, templates: false }))
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_companies`,
        axiosConfig
      )

      const data = response.data?.message?.data || []
      setCompanies(data)
      console.log("✅ Fetched companies:", data.length)
    } catch (error: any) {
      console.error("❌ Error fetching companies:", error)
      setCompanies([])
    } finally {
      setLoading(prev => ({ ...prev, companies: false }))
    }
  }

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_designations`,
        axiosConfig
      )

      const data = response.data?.message?.data || []
      setDesignations(data)
      console.log("✅ Fetched designations:", data.length)
    } catch (error: any) {
      console.error("❌ Error fetching designations:", error)
      setDesignations([])
    } finally {
      setLoading(prev => ({ ...prev, designations: false }))
    }
  }

  const fetchTemplateTerms = async (templateName: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.get_template_terms?template_name=${templateName}`,
        axiosConfig
      )

      const terms = response.data?.message?.data || []
      const formattedTerms = terms.map((term: any, index: number) => ({
        id: Date.now().toString() + index,
        offer_term: term.offer_term || "",
        value_description: term.value || ""
      }))

      setOfferTerms(formattedTerms)
      console.log("✅ Fetched template terms:", formattedTerms.length)
    } catch (error: any) {
      console.error("❌ Error fetching template terms:", error)
    }
  }

  const handleJobApplicantChange = (value: string) => {
    const applicant = jobApplicants.find(a => a.name === value)
    if (applicant) {
      setOfferForm({
        ...offerForm,
        jobApplicant: value,
        applicantName: applicant.applicant_name || "",
        applicantEmail: applicant.email_id || ""
      })
    }
  }

  const addOfferTerm = () => {
    const newTerm: OfferTerm = {
      id: Date.now().toString(),
      offer_term: "",
      value_description: ""
    }
    setOfferTerms([...offerTerms, newTerm])
  }

  const removeOfferTerm = (id: string) => {
    setOfferTerms(offerTerms.filter(term => term.id !== id))
  }

  const updateOfferTerm = (id: string, field: keyof OfferTerm, value: string) => {
    setOfferTerms(offerTerms.map(term =>
      term.id === id ? { ...term, [field]: value } : term
    ))
  }

  const handleSave = async () => {
    if (!offerForm.jobApplicant || !offerForm.applicantName || !offerForm.designation || !offerForm.company) {
      alert("Please fill all required fields")
      return
    }

    setIsSaving(true)
    try {
      const formData = new URLSearchParams()
      formData.append('job_applicant', offerForm.jobApplicant)
      formData.append('applicant_name', offerForm.applicantName)
      if (offerForm.applicantEmail) formData.append('applicant_email', offerForm.applicantEmail)
      if (offerForm.offerDate) formData.append('offer_date', offerForm.offerDate)
      formData.append('designation', offerForm.designation)
      formData.append('company', offerForm.company)
      formData.append('status', offerForm.status)
      if (offerForm.jobOfferTemplate) formData.append('job_offer_template', offerForm.jobOfferTemplate)

      if (offerTerms.length > 0) {
        formData.append('offer_terms', JSON.stringify(offerTerms))
      }

      console.log("Submitting job offer with data:", Object.fromEntries(formData))

      const response = await axios.post(
        `${API_BASE_URL}/api/method/${API_MODULE_PATH}.create_job_offer`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      const message = response.data?.message?.message || "Job Offer created successfully!"
      alert(message)
      router.push('/offer-list')
    } catch (error: any) {
      console.error("Error creating job offer:", error)
      console.error("Error details:", error.response?.data)
      alert(error.response?.data?.exception || error.message || "Failed to create job offer")
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
                Back
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                New Job Offer
              </h1>
            </div>
            <p className="text-muted-foreground">Create and send job offers to candidates</p>
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
                  <Label>Job Applicant <span className="text-red-500">*</span></Label>
                  <Select
                    value={offerForm.jobApplicant}
                    onValueChange={handleJobApplicantChange}
                    disabled={loading.applicants}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        loading.applicants ? "Loading..." :
                          jobApplicants.length === 0 ? "No applicants found" :
                            "Select applicant"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {jobApplicants.map((applicant) => (
                        <SelectItem key={applicant.name} value={applicant.name}>
                          {applicant.applicant_name} ({applicant.email_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status <span className="text-red-500">*</span></Label>
                  <Select
                    value={offerForm.status}
                    onValueChange={(value) => setOfferForm({ ...offerForm, status: value })}
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

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Applicant Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={offerForm.applicantName}
                    onChange={(e) => setOfferForm({ ...offerForm, applicantName: e.target.value })}
                    placeholder="Enter applicant name"
                    disabled={!!offerForm.jobApplicant}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Offer Date</Label>
                  <Input
                    type="date"
                    value={offerForm.offerDate}
                    onChange={(e) => setOfferForm({ ...offerForm, offerDate: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Applicant Email Address</Label>
                  <Input
                    type="email"
                    value={offerForm.applicantEmail}
                    onChange={(e) => setOfferForm({ ...offerForm, applicantEmail: e.target.value })}
                    placeholder="Enter email"
                    disabled={!!offerForm.jobApplicant}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Designation <span className="text-red-500">*</span></Label>
                  <Select
                    value={offerForm.designation}
                    onValueChange={(value) => setOfferForm({ ...offerForm, designation: value })}
                    disabled={loading.designations}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        loading.designations ? "Loading..." :
                          designations.length === 0 ? "No designations found" :
                            "Select designation"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((designation) => (
                        <SelectItem key={designation.name} value={designation.name}>
                          {designation.designation_name || designation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Job Offer Term Template</Label>
                  <Select
                    value={offerForm.jobOfferTemplate}
                    onValueChange={(value) => setOfferForm({ ...offerForm, jobOfferTemplate: value })}
                    disabled={loading.templates || templates.length === 0}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        loading.templates ? "Loading..." :
                          templates.length === 0 ? "No templates available" :
                            "Select template (optional)"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.name} value={template.name}>
                          {template.offer_term_template_name || template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Company <span className="text-red-500">*</span></Label>
                  <Select
                    value={offerForm.company}
                    onValueChange={(value) => setOfferForm({ ...offerForm, company: value })}
                    disabled={loading.companies}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={
                        loading.companies ? "Loading..." :
                          companies.length === 0 ? "No companies found" :
                            "Select company"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.name} value={company.name}>
                          {company.company_name || company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Job Offer Terms</CardTitle>
                <Button
                  onClick={addOfferTerm}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Add Row
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium w-12">No.</th>
                      <th className="text-left p-4 text-sm font-medium">
                        Offer Term <span className="text-red-500">*</span>
                      </th>
                      <th className="text-left p-4 text-sm font-medium">
                        Value / Description <span className="text-red-500">*</span>
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerTerms.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          No offer terms added. Click "Add Row" to add terms or select a template above.
                        </td>
                      </tr>
                    ) : (
                      offerTerms.map((term, index) => (
                        <tr key={term.id} className="border-b hover:bg-blue-50/50 transition-colors">
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">
                            <Input
                              value={term.offer_term}
                              onChange={(e) => updateOfferTerm(term.id, 'offer_term', e.target.value)}
                              placeholder="e.g., Salary, Benefits, Working Hours"
                              className="h-12"
                            />
                          </td>
                          <td className="p-4">
                            <Textarea
                              value={term.value_description}
                              onChange={(e) => updateOfferTerm(term.id, 'value_description', e.target.value)}
                              placeholder="e.g., $80,000 per year"
                              className="min-h-[60px]"
                              rows={2}
                            />
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOfferTerm(term.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
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
    </div>
  )
}