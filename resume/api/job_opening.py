# import frappe
# from datetime import datetime, timezone
# import json

# @frappe.whitelist(allow_guest=True)
# def create_job_opening():
#     data = frappe.form_dict
#     frappe.log("Received form data: {data}".format(data=json.dumps(dict(data), indent=2)))

#     # Define required fields
#     required_fields = ["job_title", "designation"]
#     for field in required_fields:
#         if not data.get(field):
#             frappe.throw(f"{field} is required")

#     # Validate status
#     status = data.get("status")
#     frappe.log(f"status received: {status}")
#     valid_statuses = ["Open", "Closed", "On Hold"]
#     if not status or status not in valid_statuses:
#         frappe.throw(f"Invalid or missing status. Must be one of {', '.join(valid_statuses)}")

#     # Initialize and validate salary ranges
#     lower_range_val = data.get("lower_range")
#     upper_range_val = data.get("upper_range")
    
#     # These will be passed to get_doc. Default to None so Frappe stores NULL if not provided.
#     lower_range_final = None
#     upper_range_final = None

#     # Only perform validation if both values are provided and are not 'null' or 'undefined' from the frontend
#     if lower_range_val and upper_range_val and str(lower_range_val) not in ['null', 'undefined', ''] and str(upper_range_val) not in ['null', 'undefined', '']:
#         try:
#             lower = float(lower_range_val)
#             upper = float(upper_range_val)
            
#             if lower <= 0 or upper <= 0:
#                 frappe.throw("Salary ranges must be positive numbers")
#             if lower >= upper:
#                 frappe.throw("Lower Range must be less than Upper Range")
            
#             # If all checks pass, assign the converted float values
#             lower_range_final = lower
#             upper_range_final = upper
#         except (ValueError, TypeError):
#             frappe.throw("Salary ranges must be valid numbers")

#     try:
#         # Safely convert incoming boolean-like values to 1 or 0 for Frappe's "Check" fields
#         publish_salary = 1 if str(data.get("publish_salary_range")) in ["True", "true", "1"] else 0
#         publish_website = 1 if str(data.get("publish_on_website")) in ["True", "true", "1"] else 0
        
#         job_doc = frappe.get_doc({
#             "doctype": "Job Opening",
#             "job_title": data.job_title,
#             "designation": data.designation,
#             "description": data.description,
#             "currency": data.currency,
#             "lower_range": lower_range_final,
#             "upper_range": upper_range_final,
#             "publish_salary_range": publish_salary,
#             "company": data.company,
#             "employment_type": data.employment_type,
#             "department": data.department,
#             "location": data.location,
#             "publish_on_website": publish_website,
#             "posted_on": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
#             "closes_on": data.closes_on if data.closes_on else None, # Ensure None if date is empty
#             "status": status,
#             "salary_per": data.get("salary_per", "Month")
#         })
#         job_doc.insert(ignore_permissions=True)
#         frappe.db.commit()
#         frappe.log(f"Created job opening: {job_doc.name}, status: {job_doc.status}, lower_range: {job_doc.lower_range}, upper_range: {job_doc.upper_range}")
#         return {"message": f"Job Opening {job_doc.name} created successfully.", "doc": job_doc.as_dict()}
#     except Exception as e:
#         # Log the detailed error on the server and throw a generic message to the client
#         frappe.log_error(frappe.get_traceback(), "Job Opening Creation Failed")
#         frappe.throw(f"Failed to create job opening due to a server error. Please contact support.")




import frappe
from datetime import datetime, timezone
import json

@frappe.whitelist(allow_guest=True)
def create_job_opening():
    try:
        data = frappe.form_dict
        
        frappe.logger().info(f"Received data: {json.dumps(dict(data), indent=2)}")

        # Validate required fields
        if not data.get("job_title"):
            return {"success": False, "message": "Job title is required"}
        if not data.get("designation"):
            return {"success": False, "message": "Designation is required"}
        if not data.get("company"):
            return {"success": False, "message": "Company is required"}

        # Validate status
        status = data.get("status", "Open")
        valid_statuses = ["Open", "Closed", "On Hold"]
        if status not in valid_statuses:
            return {"success": False, "message": f"Invalid status. Must be one of {', '.join(valid_statuses)}"}

        # Process salary ranges
        lower_range_final = None
        upper_range_final = None
        
        lower_range_val = data.get("lower_range")
        upper_range_val = data.get("upper_range")

        if lower_range_val and upper_range_val:
            try:
                lower = float(lower_range_val)
                upper = float(upper_range_val)
                
                if lower <= 0 or upper <= 0:
                    return {"success": False, "message": "Salary ranges must be positive numbers"}
                if lower >= upper:
                    return {"success": False, "message": "Minimum salary must be less than maximum salary"}
                
                lower_range_final = lower
                upper_range_final = upper
            except (ValueError, TypeError):
                return {"success": False, "message": "Salary ranges must be valid numbers"}

        # Convert boolean values
        publish_salary = 1 if str(data.get("publish_salary_range")).lower() in ["true", "1"] else 0
        publish_website = 1 if str(data.get("publish_on_website")).lower() in ["true", "1"] else 0
        
        # Parse dates
        posted_on = data.get("posted_on") or datetime.now(timezone.utc).strftime("%Y-%m-%d")
        closes_on = data.get("closes_on") if data.get("closes_on") else None
        
        # Get optional fields (strip whitespace and handle empty strings)
        location = data.get("location", "").strip() or None
        employment_type = data.get("employment_type", "").strip() or None
        department = data.get("department", "").strip() or None
        
        # Create Job Opening document   
        job_doc = frappe.get_doc({
            "doctype": "Job Opening",
            "job_title": data.get("job_title"),
            "designation": data.get("designation"),
            "description": data.get("description", ""),
            "currency": data.get("currency", "INR"),
            "lower_range": lower_range_final,
            "upper_range": upper_range_final,
            "publish_salary_range": publish_salary,
            "company": data.get("company"),
            "employment_type": employment_type,
            "department": department,
            "location": location,
            "publish_on_website": publish_website,
            "posted_on": posted_on,
            "closes_on": closes_on,
            "status": status,
            "salary_per": data.get("salary_per", "Month")
        })
        
        # Insert with ignore_permissions and ignore_links (to skip link validation)
        job_doc.insert(ignore_permissions=True, ignore_links=True)
        frappe.db.commit()
        
        frappe.logger().info(f"Successfully created: {job_doc.name}")
        
        return {
            "success": True,
            "message": f"Job Opening {job_doc.name} created successfully",
            "data": {
                "name": job_doc.name,
                "job_title": job_doc.job_title
            }
        }
        
    except Exception as e:
        error_trace = frappe.get_traceback()
        frappe.logger().error(f"Error: {error_trace}")
        frappe.log_error(title="Job Opening Error", message=error_trace)
        
        return {
            "success": False,
            "message": f"Failed to create job opening: {str(e)}"
        }
        