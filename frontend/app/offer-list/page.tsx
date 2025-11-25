
"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Calendar, Building2, User, FileText, Briefcase, FileCheck } from "lucide-react"
import { axiosConfig } from '@/lib/axios-config'

export default function OfferListPage() {
    const [offers, setOffers] = useState<any[]>([])
    const [selectedOffer, setSelectedOffer] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const API_BASE_URL = "http://172.23.88.43:8000/api/method/resume.api.offer_letter"

    const fetchOffers = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}.get_job_offer_list`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const jsonData = await res.json()
            const data = jsonData?.message?.data || []
            setOffers(data)
        } catch (err) {
            console.error("Error fetching offers:", err)
            setOffers([])
        } finally {
            setLoading(false)
        }
    }

    const fetchOfferDetails = async (name: string) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE_URL}.get_job_offer_details?job_offer_name=${encodeURIComponent(name)}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const jsonData = await res.json()
            const data = jsonData?.message?.data
            setSelectedOffer(data)
        } catch (err) {
            console.error("Error fetching offer details:", err)
            setSelectedOffer(null)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || ""
        if (normalizedStatus.includes("accept")) return "bg-green-100 text-green-800 border-green-200"
        if (normalizedStatus.includes("reject")) return "bg-red-100 text-red-800 border-red-200"
        if (normalizedStatus.includes("pending") || normalizedStatus.includes("awaiting")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
        return "bg-blue-100 text-blue-800 border-blue-200"
    }

    useEffect(() => {
        fetchOffers()
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-lg font-medium">Loading...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Job Offer Letters
                            </h1>
                        </div>
                        <p className="text-muted-foreground">View and manage all job offers</p>
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    {!selectedOffer ? (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>All Offers ({offers.length})</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {offers.length > 0 ? (
                                    <div className="space-y-4">
                                        {offers.map((offer) => (
                                            <Card
                                                key={offer.name}
                                                className="transition-all duration-300 hover:shadow-xl border-0 shadow-lg"
                                            >
                                                <CardContent className="p-4">
                                                    <div
                                                        className="cursor-pointer"
                                                        onClick={() => fetchOfferDetails(offer.name)}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-2 flex-1">
                                                                <div>
                                                                    <h3 className="font-semibold">{offer.applicant_name}</h3>
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Mail className="h-3 w-3" />
                                                                        <span>{offer.applicant_email || "N/A"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Briefcase className="h-3 w-3" />
                                                                        <span className="font-medium">{offer.designation}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <Building2 className="h-3 w-3" />
                                                                        <span>{offer.company}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                    <span>{offer.name}</span>
                                                                    <span>•</span>
                                                                    <div className="flex items-center space-x-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        <span>{offer.offer_date || "Not set"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Badge className={getStatusColor(offer.status)}>
                                                                {offer.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end mt-4">
                                                        <Button
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                window.location.href = '/appointment'
                                                            }}
                                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                                        >
                                                            <FileCheck className="h-4 w-4 mr-2" />
                                                            Appointment Letter
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="font-semibold mb-2">No Offers Found</h3>
                                        <p className="text-sm text-muted-foreground">No job offers available yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Offer Details</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedOffer(null)}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to List
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Applicant Info */}
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedOffer.applicant_name}</h2>
                                            <p className="text-sm text-muted-foreground mt-1">{selectedOffer.name}</p>
                                        </div>
                                        <Badge className={getStatusColor(selectedOffer.status)}>
                                            {selectedOffer.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Email</h4>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">{selectedOffer.applicant_email || "-"}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Designation</h4>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">{selectedOffer.designation || "-"}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Company</h4>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">{selectedOffer.company || "-"}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Offer Date</h4>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">{selectedOffer.offer_date || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedOffer.job_offer_term_template && (
                                        <div className="pt-4 border-t">
                                            <h4 className="font-medium text-sm text-muted-foreground mb-2">Template Used</h4>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm">{selectedOffer.job_offer_term_template}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Offer Terms */}
                                <div className="border-t pt-6">
                                    <h3 className="font-semibold text-lg mb-4">Offer Terms & Conditions</h3>
                                    {selectedOffer.offer_terms?.length ? (
                                        <div className="space-y-3">
                                            {selectedOffer.offer_terms.map((term: any, idx: number) => (
                                                <Card key={idx} className="bg-blue-50/50 border-blue-100">
                                                    <CardContent className="p-4">
                                                        <div className="space-y-1">
                                                            <h4 className="font-semibold text-sm">
                                                                {idx + 1}. {term.offer_term}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {term.value}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8 bg-slate-50 rounded-lg">
                                            No offer terms available
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}

