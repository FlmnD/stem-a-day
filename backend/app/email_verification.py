import logging
import smtplib
from dataclasses import dataclass
from email.message import EmailMessage
from urllib.parse import quote

from jose import JWTError

from app.jwt import create_email_verification_token, decode_token
from app.models import User
from app.settings import settings

logger = logging.getLogger(__name__)

EMAIL_VERIFICATION_TOKEN_TYPE = "email_verification"


@dataclass(slots=True)
class VerificationEmailDispatch:
    verification_email_sent: bool
    dev_verification_url: str | None = None
    error: str | None = None


class EmailVerificationTokenError(ValueError):
    pass


def build_email_verification_url(token: str) -> str:
    base_url = settings.APP_BASE_URL.rstrip("/")
    return f"{base_url}/verify-email?token={quote(token, safe='')}"


def send_verification_email(user: User) -> VerificationEmailDispatch:
    token = create_email_verification_token(subject=str(user.id), email=user.email)
    verification_url = build_email_verification_url(token)

    subject = "Verify your STEM a Day email"
    text_body = "\n".join(
        [
            f"Hi {user.username},",
            "",
            "Verify your STEM a Day email to finish setting up your account.",
            "",
            f"Verification link: {verification_url}",
            "",
            f"This link expires in {settings.EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES} minutes.",
            "",
            "If you did not create this account, you can ignore this email.",
        ]
    )
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p>Hi {user.username},</p>
        <p>Verify your STEM a Day email to finish setting up your account.</p>
        <p>
          <a
            href="{verification_url}"
            style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #0284c7; color: #ffffff; text-decoration: none; font-weight: 600;"
          >
            Verify Email
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="{verification_url}">{verification_url}</a></p>
        <p>This link expires in {settings.EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES} minutes.</p>
        <p>If you did not create this account, you can ignore this email.</p>
      </body>
    </html>
    """.strip()

    if not settings.SMTP_HOST:
        logger.info(
            "SMTP is not configured. Email verification link for %s: %s",
            user.email,
            verification_url,
        )
        return VerificationEmailDispatch(
            verification_email_sent=False,
            dev_verification_url=verification_url,
            error="smtp_not_configured",
        )

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = user.email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        if settings.SMTP_USE_SSL:
            server: smtplib.SMTP | smtplib.SMTP_SSL = smtplib.SMTP_SSL(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                timeout=settings.SMTP_TIMEOUT_SECONDS,
            )
        else:
            server = smtplib.SMTP(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                timeout=settings.SMTP_TIMEOUT_SECONDS,
            )

        with server:
            if not settings.SMTP_USE_SSL and settings.SMTP_USE_TLS:
                server.starttls()

            if settings.SMTP_USERNAME:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD or "")

            server.send_message(message)
    except Exception as exc:
        logger.exception("Failed to send verification email to %s", user.email)
        return VerificationEmailDispatch(
            verification_email_sent=False,
            error=type(exc).__name__,
        )

    return VerificationEmailDispatch(verification_email_sent=True)


def parse_email_verification_token(token: str) -> tuple[int, str]:
    try:
        payload = decode_token(token)
    except JWTError as exc:
        raise EmailVerificationTokenError(
            "Verification link is invalid or expired."
        ) from exc

    token_type = payload.get("token_type")
    subject = payload.get("sub")
    email = payload.get("email")

    if token_type != EMAIL_VERIFICATION_TOKEN_TYPE or not subject or not email:
        raise EmailVerificationTokenError("Verification link is invalid or expired.")

    try:
        user_id = int(subject)
    except (TypeError, ValueError) as exc:
        raise EmailVerificationTokenError(
            "Verification link is invalid or expired."
        ) from exc

    return user_id, str(email)
