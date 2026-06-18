import os

src_dir = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src\vendor\pages"

files_to_update = {
    "PaymentsPage.jsx": ("<VendorPagination />", "<VendorPagination totalItems={payments.length} />"),
    "GRNPage.jsx": ("<VendorPagination />", "<VendorPagination totalItems={grns.length} />"),
    "InvoicesPage.jsx": ("<VendorPagination />", "<VendorPagination totalItems={invoices.length} />"),
    "PurchaseOrdersPage.jsx": ("<VendorPagination />", "<VendorPagination totalItems={purchaseOrders.length} />"),
    "QuotationsPage.jsx": ("<VendorPagination />", "<VendorPagination totalItems={quotations.length} />"),
    "RFQsPage.jsx": ("<VendorPagination />", "<VendorPagination totalItems={rfqs.length} />"),
}

for filename, (old_text, new_text) in files_to_update.items():
    path = os.path.join(src_dir, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        if old_text in content:
            content = content.replace(old_text, new_text)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {filename}")
        else:
            print(f"Skipped {filename} - tag not found")
