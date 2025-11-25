"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Search,
    FileText,
    User,
    Calendar,
    Eye,
    Trash2,
    Download
} from "lucide-react"
import { useRouter } from "next/navigation"

interface ApplicantDocument {
    name: string
    applicant_name: string
    employee: string
    creation: string
    modified: string
    aadhar_card: string
    passport: string
    experience: string
    education: string
    bank_details: string
    pan: string
    medical: string
    photos: string
    applicant_details?: {
        applicant_name: string
        email_id: string
    }
    employee_details?: {
        employee_name: string
        personal_email: string
    }
}

// const API_AUTH = {
//     headers: {
//         Authorization: `token 09481bf19b467f7:39bb84748d00090`,
//     },
// }
import { axiosConfig } from '@/lib/axios-config'

export default function DocumentVerifyListPage() {
    const router = useRouter()
    const [documents, setDocuments] = useState<ApplicantDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchDocuments()
    }, [])

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `http://172.23.88.43:8000/api/resource/Applicant Document?fields=["*"]&limit_page_length=100`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            const data = await response.json()

            if (data && data.data) {
                // Fetch applicant details for each document
                const documentsWithDetails = await Promise.all(
                    data.data.map(async (doc: ApplicantDocument) => {
                        if (doc.applicant_name) {
                            try {
                                const applicantResponse = await fetch(
                                    `http://172.23.88.43:8000/api/resource/Job Applicant/${doc.applicant_name}`,
                                    {
                                        credentials: 'include',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    }
                                )
                                const applicantData = await applicantResponse.json()
                                doc.applicant_details = applicantData.data
                            } catch (error) {
                                console.error("Error fetching applicant details:", error)
                            }
                        }

                        if (doc.employee) {
                            try {
                                const employeeResponse = await fetch(
                                    `http://172.23.88.43:8000/api/resource/Employee/${doc.employee}`,
                                    {
                                        credentials: 'include',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                    }
                                )
                                const employeeData = await employeeResponse.json()
                                doc.employee_details = employeeData.data
                            } catch (error) {
                                console.error("Error fetching employee details:", error)
                            }
                        }

                        return doc
                    })
                )
                setDocuments(documentsWithDetails)
            }
        } catch (error) {
            console.error("Error fetching documents:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (name: string) => {
        if (!confirm("Are you sure you want to delete this document?")) {
            return
        }

        try {
            const response = await fetch(
                `http://172.23.88.43:8000/api/resource/Applicant Document/${name}`,
                {
                    method: "DELETE",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.ok) {
                alert("Document deleted successfully!")
                fetchDocuments()
            } else {
                alert("Failed to delete document")
            }
        } catch (error) {
            console.error("Error deleting document:", error)
            alert("Failed to delete document")
        }
    }

    const filteredDocuments = documents.filter((doc) => {
        const searchLower = searchQuery.toLowerCase()
        return (
            doc.name.toLowerCase().includes(searchLower) ||
            doc.applicant_details?.applicant_name?.toLowerCase().includes(searchLower) ||
            doc.employee_details?.employee_name?.toLowerCase().includes(searchLower)
        )
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const countDocuments = (doc: ApplicantDocument) => {
        let count = 0
        if (doc.aadhar_card) count++
        if (doc.passport) count++
        if (doc.experience) count++
        if (doc.education) count++
        if (doc.bank_details) count++
        if (doc.pan) count++
        if (doc.medical) count++
        if (doc.photos) count++
        return count
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                            Applicant Documents
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and verify applicant documentation
                        </p>
                    </div>
                    {/* <Button
                        onClick={() => router.push("/document-verify")}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 h-12"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Document
                    </Button> */}
                </div>

                {/* Search Bar */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search by applicant name, document ID, or employee..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Documents</p>
                                    <p className="text-3xl font-bold mt-1">{documents.length}</p>
                                </div>
                                <FileText className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-sm">Applicants</p>
                                    <p className="text-3xl font-bold mt-1">
                                        {new Set(documents.map(d => d.applicant_name)).size}
                                    </p>
                                </div>
                                <User className="h-12 w-12 text-indigo-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">This Month</p>
                                    <p className="text-3xl font-bold mt-1">
                                        {documents.filter(d => {
                                            const docDate = new Date(d.creation)
                                            const now = new Date()
                                            return docDate.getMonth() === now.getMonth() &&
                                                docDate.getFullYear() === now.getFullYear()
                                        }).length}
                                    </p>
                                </div>
                                <Calendar className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Documents List */}
                {loading ? (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-12">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <p className="text-gray-500">Loading documents...</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : filteredDocuments.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-12">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <FileText className="h-16 w-16 text-gray-300" />
                                <p className="text-gray-500 text-lg">No documents found</p>
                                <Button
                                    onClick={() => router.push("/document-verify")}
                                    variant="outline"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add First Document
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {filteredDocuments.map((doc) => (
                            <Card
                                key={doc.name}
                                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {doc.applicant_details?.applicant_name || doc.applicant_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        ID: {doc.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        {countDocuments(doc)} Documents
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {doc.applicant_details?.email_id || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Employee</p>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {doc.employee_details?.employee_name || "Not Assigned"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Created</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(doc.creation)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Modified</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(doc.modified)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Documents Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { label: "Aadhar", value: doc.aadhar_card },
                                                    { label: "PAN", value: doc.pan },
                                                    { label: "Passport", value: doc.passport },
                                                    { label: "Experience", value: doc.experience },
                                                    { label: "Education", value: doc.education },
                                                    { label: "Bank Details", value: doc.bank_details },
                                                    { label: "Medical", value: doc.medical },
                                                    { label: "Photos", value: doc.photos },
                                                ].map((item) => (
                                                    <div
                                                        key={item.label}
                                                        className={`px-3 py-2 rounded-lg border ${item.value
                                                            ? "bg-green-50 border-green-200"
                                                            : "bg-gray-50 border-gray-200"
                                                            }`}
                                                    >
                                                        <p className="text-xs text-gray-600">{item.label}</p>
                                                        <p className={`text-xs font-medium mt-1 ${item.value ? "text-green-600" : "text-gray-400"
                                                            }`}>
                                                            {item.value ? "✓ Uploaded" : "Missing"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {/* <div className="flex flex-col space-y-2 ml-6">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(`http://172.23.88.43:8000/app/applicant-document/${doc.name}`, '_blank')}
                                                className="whitespace-nowrap"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="whitespace-nowrap text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(doc.name)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div> */}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}


