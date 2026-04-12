import logging
import smtplib
from dataclasses import dataclass
from email.message import EmailMessage
from urllib.parse import quote

from jose import JWTError

from app.jwt import (
    EMAIL_VERIFICATION_TOKEN_TYPE,
    PASSWORD_RESET_TOKEN_TYPE,
    create_email_verification_token,
    create_password_reset_token,
    decode_typed_token,
)
from app.models import User
from app.settings import settings

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class AuthEmailDispatch:
    email_sent: bool
    dev_action_url: str | None = None
    error: str | None = None


class EmailVerificationTokenError(ValueError):
    pass


class PasswordResetTokenError(ValueError):
    pass


def build_email_verification_url(token: str) -> str:
    base_url = settings.APP_BASE_URL.rstrip("/")
    return f"{base_url}/verify-email?token={quote(token, safe='')}"


def build_password_reset_url(token: str) -> str:
    base_url = settings.APP_BASE_URL.rstrip("/")
    return f"{base_url}/reset-password?token={quote(token, safe='')}"


def send_verification_email(user: User) -> AuthEmailDispatch:
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

    return send_auth_email(
        recipient=user.email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
        dev_action_url=verification_url,
        dev_log_label="Email verification",
    )


def send_password_reset_email(user: User) -> AuthEmailDispatch:
    token = create_password_reset_token(subject=str(user.id), email=user.email)
    reset_url = build_password_reset_url(token)
    subject = "Reset your STEM a Day password"
    text_body = "\n".join(
        [
            f"Hi {user.username},",
            "",
            "We received a request to reset your STEM a Day password.",
            "",
            f"Password reset link: {reset_url}",
            "",
            f"This link expires in {settings.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES} minutes.",
            "",
            "If you did not request a password reset, you can ignore this email.",
        ]
    )
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p>Hi {user.username},</p>
        <p>We received a request to reset your STEM a Day password.</p>
        <p>
          <a
            href="{reset_url}"
            style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #0284c7; color: #ffffff; text-decoration: none; font-weight: 600;"
          >
            Reset Password
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p>This link expires in {settings.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES} minutes.</p>
        <p>If you did not request a password reset, you can ignore this email.</p>
      </body>
    </html>
    """.strip()

    return send_auth_email(
        recipient=user.email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
        dev_action_url=reset_url,
        dev_log_label="Password reset",
    )


def send_auth_email(
    recipient: str,
    subject: str,
    text_body: str,
    html_body: str,
    dev_action_url: str,
    dev_log_label: str,
) -> AuthEmailDispatch:
    if not settings.SMTP_HOST:
        logger.info(
            "SMTP is not configured. %s link for %s: %s",
            dev_log_label,
            recipient,
            dev_action_url,
        )
        return AuthEmailDispatch(
            email_sent=False,
            dev_action_url=dev_action_url,
            error="smtp_not_configured",
        )

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.EMAIL_FROM
    message["To"] = recipient
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
        logger.exception("Failed to send auth email to %s", recipient)
        return AuthEmailDispatch(
            email_sent=False,
            error=type(exc).__name__,
        )

    return AuthEmailDispatch(email_sent=True)


def parse_email_verification_token(token: str) -> tuple[int, str]:
    return parse_user_email_token(
        token=token,
        expected_token_type=EMAIL_VERIFICATION_TOKEN_TYPE,
        error_type=EmailVerificationTokenError,
    )


def parse_password_reset_token(token: str) -> tuple[int, str]:
    return parse_user_email_token(
        token=token,
        expected_token_type=PASSWORD_RESET_TOKEN_TYPE,
        error_type=PasswordResetTokenError,
    )


def parse_user_email_token(
    token: str,
    expected_token_type: str,
    error_type: type[ValueError],
) -> tuple[int, str]:
    try:
        payload = decode_typed_token(token, expected_token_type)
    except JWTError as exc:
        raise error_type("The link is invalid or expired.") from exc

    subject = payload.get("sub")
    email = payload.get("email")

    if not subject or not email:
        raise error_type("The link is invalid or expired.")

    try:
        user_id = int(subject)
    except (TypeError, ValueError) as exc:
        raise error_type("The link is invalid or expired.") from exc

    return user_id, str(email)
