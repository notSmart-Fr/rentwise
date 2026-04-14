import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_password_reset_email(to_email: str, reset_link: str):
    """
    Sends a password reset email using Gmail SMTP.
    Requires settings.smtp_user and settings.smtp_password to be configured.
    """
    if not settings.smtp_user or not settings.smtp_password:
        print(f"SMTP not configured. Reset link for {to_email}: {reset_link}")
        return

    subject = "Reset Your RentWise Password"
    body = f"""
    <html>
    <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #6366f1;">RentWise Power Reset</h2>
            <p>Hello,</p>
            <p>We received a request to reset your RentWise password. Click the button below to choose a new one. This link will expire in 15 minutes.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">RentWise Inc. | Your Local Property Partner</p>
        </div>
    </body>
    </html>
    """

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.smtp_user
    message["To"] = to_email

    part = MIMEText(body, "html")
    message.attach(part)

    try:
        # Using SMTP_SSL for port 465
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port) as server:
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_user, to_email, message.as_string())
        print(f"Successfully sent reset email to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        # In development, we still want to see the link if email fails
        print(f"Link: {reset_link}")
