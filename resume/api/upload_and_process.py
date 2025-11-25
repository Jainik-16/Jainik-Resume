import frappe
import os
import uuid
from pdfminer.high_level import extract_text
from resume.resume.doctype.pdf_upload.pdf_upload import extract_text_with_ocr, parse_pdf_text
@frappe.whitelist(allow_guest=True)
def upload_and_process(job_opening=None):
    frappe.local.flags.ignore_csrf = True
    # If job_opening not passed directly, try to fetch from form_dict
    if not job_opening:
        job_opening = frappe.form_dict.get("job_opening")

    try:
        files = frappe.request.files.getlist("files")
        if not files:
            frappe.throw("No files uploaded.")

        created = 0

        for file_storage in files:
            filename = f"{uuid.uuid4()}_{file_storage.filename}"
            file_path = frappe.get_site_path("private", "files", filename)

            with open(file_path, "wb") as f:
                f.write(file_storage.stream.read())

            file_url = f"/private/files/{filename}"

            try:
                text = extract_text(file_path)
                if not text.strip():
                    text = extract_text_with_ocr(file_path)
            except Exception as e:
                frappe.log_error(f"Text extraction failed for {filename}: {e}")
                continue

            try:
                applicant_data = parse_pdf_text(text)
            except Exception as e:
                frappe.log_error(f"Parsing failed for {filename}: {e}")
                continue

            if not applicant_data.get("applicant_name") or not applicant_data.get("email"):
                frappe.log_error(f"Missing required info in {filename}")
                continue

            if frappe.db.exists("Job Applicant", {
                "email_id": applicant_data["email"],
                "job_title": job_opening
            }):
                frappe.log_error(f"Duplicate applicant for email: {applicant_data['email']} and job_title: {job_opening}")
                continue

            try:
                applicant_doc = {
                    "doctype": "Job Applicant",
                    "applicant_name": applicant_data["applicant_name"],
                    "email_id": applicant_data["email"],
                    "resume_attachment": file_url,
                    "status": "Open",
                    "phone_number": applicant_data.get("phone", "")
                }

                if job_opening:
                    applicant_doc["job_title"] = job_opening

                applicant = frappe.get_doc(applicant_doc)
                applicant.insert(ignore_permissions=True)
                created += 1

            except Exception as e:
                frappe.log_error(f"Failed to insert applicant from {filename}: {e}")

        return {"message": f"{created} Job Applicant(s) created."}

    except Exception as e:
        frappe.log_error(f"Resume upload failed: {e}")
        frappe.throw("Resume upload failed. See error logs.")
        