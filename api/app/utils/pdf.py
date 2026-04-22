import os
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa

def render_to_pdf(template_name: str, context: dict) -> BytesIO:
    """
    Renders an HTML template with context and converts it to a PDF buffer.
    """
    # 1. Setup Jinja2 environment
    template_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
    env = Environment(loader=FileSystemLoader(template_path))
    template = env.get_template(template_name)
    
    # 2. Render HTML
    html_content = template.render(context)
    
    # 3. Create PDF
    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(html_content, dest=pdf_buffer)
    
    if pisa_status.err:
        raise Exception(f"PDF Generation Error: {pisa_status.err}")
        
    pdf_buffer.seek(0)
    return pdf_buffer
