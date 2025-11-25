// frappe.ui.form.on('PDF Upload', {
//     refresh(frm) {
//         frm.add_custom_button('Bulk Upload Resumes', () => {
//             console.log("Upload button clicked");

//             new frappe.ui.FileUploader({
//                 allow_multiple: true,
//                 on_success(file_list) {
//                     console.log("Files uploaded:", file_list);

//                     const files = Array.isArray(file_list) ? file_list : [file_list];

//                     files.forEach(file => {
//                         let row = frm.add_child("files");
//                         console.log("Adding row with:", file.file_url);
//                         row.file_upload = file.file_url;
//                     });

//                     frm.refresh_field("files");
//                 }
//             });
//         });
//     }
// });


frappe.ui.form.on('PDF Upload', {
    refresh(frm) {
        frm.add_custom_button('Upload & Process Resumes', () => {
            new frappe.ui.FileUploader({
                allow_multiple: true,
                restrictions: {
                    allowed_file_types: ['.pdf']
                },
                on_success(file_list) {
                    const files = Array.isArray(file_list) ? file_list : [file_list];
                    const existingUrls = frm.doc.files.map(f => f.file_upload);

                    files.forEach(file => {
                        if (!existingUrls.includes(file.file_url)) {
                            let row = frm.add_child("files");
                            row.file_upload = file.file_url;
                        }
                    });

                    frm.refresh_field("files");

                    // Save and process
                    frm.save().then(() => {
                        frappe.call({
                            method: "resume.resume.doctype.pdf_upload.pdf_upload.process_pdfs",
                            args: {
                                docname: frm.doc.name
                            },
                            freeze: true,
                            freeze_message: "Processing resumes...",
                            callback: (r) => {
                                if (!r.exc) {
                                    frappe.msgprint("PDFs uploaded and Job Applicants created.");
                                    frm.reload_doc();
                                }
                            }
                        });
                    });
                }
            });
        });
    }
});

