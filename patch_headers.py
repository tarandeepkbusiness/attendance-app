import os
import re

src_dir = r"c:\Users\taran\attendance v1\src"

logo_html = '<img src="/favicon.svg" alt="App Logo" style={{ height: \'32px\', width: \'auto\' }} />'

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx") and file not in ["App.jsx", "main.jsx", "Splash.jsx"]:
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Simple heuristic to find header and inject logo
            if 'className="header"' in content and '<img src="/favicon.svg"' not in content:
                # Need to wrap the first child of header, or just insert the logo
                # Let's see patterns
                # <div className="header">
                #   <div>...</div>
                
                # We can replace <div className="header" ...> with the same, plus the logo container
                
                if 'onClick={() => navigate(-1)}' in content:
                    # It's a header with back button
                    content = re.sub(
                        r'(<div className="header"[^>]*>)\s*(<button onClick=\{\(\) => navigate\(-1\)\}[^>]*>)',
                        r'\1\n        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>\n          ' + logo_html + r'\n          \2',
                        content, count=1
                    )
                    content = re.sub(
                        r'(<h1[^>]*>.*?</h1>\s*</button>)',
                        r'\1\n        </div>',
                        content, count=1
                    )
                else:
                    # It's a header with text div (like VolunteerHome, AdminDashboard)
                    content = re.sub(
                        r'(<div className="header"[^>]*>)\s*(<div[^>]*>)',
                        r'\1\n        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>\n          ' + logo_html + r'\n          \2',
                        content, count=1
                    )
                    # close the new flex div
                    # The next sibling of the inner div is usually a button or end of header
                    # But we only want to wrap the inner div.
                    # Wait, the inner div closes itself. Let's just find `</div>\n        <button` or similar.
                    # It's safer to just replace `<div className="header"` with `<div className="header"><img... />`
                    
                    pass

print("Done")
