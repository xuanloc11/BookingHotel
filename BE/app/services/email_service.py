import resend
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

resend.api_key = settings.RESEND_API_KEY

class EmailService:
    @staticmethod
    def send_verification_email(user, token: str):
        if not settings.RESEND_API_KEY:
            print(f"Warning: RESEND_API_KEY not set. Would have sent verification email to {user.email} with token {token}")
            return False

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verify_link = f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"

        html_content = f"""
        <html>
            <body>
                <h2>Chào mừng bạn đến với VPL Hotel!</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng click vào đường link dưới đây để xác nhận email của bạn:</p>
                <p><a href="{verify_link}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Xác nhận Email</a></p>
                <p>Hoặc copy đường link này dán vào trình duyệt: {verify_link}</p>
                <p>Cảm ơn,<br>Đội ngũ VPL Hotel</p>
            </body>
        </html>
        """

        try:
            r = resend.Emails.send({
                "from": settings.RESEND_FROM_EMAIL,
                "to": user.email,
                "subject": "Xác nhận tài khoản VPL Hotel",
                "html": html_content
            })
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

    @staticmethod
    def send_password_reset_email(user, token: str):
        if not settings.RESEND_API_KEY:
            print(f"Warning: RESEND_API_KEY not set. Would have sent password reset email to {user.email} with token {token}")
            return False

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"

        html_content = f"""
        <html>
            <body>
                <h2>Yêu cầu đặt lại mật khẩu VPL Hotel</h2>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng click vào đường link dưới đây để tiếp tục:</p>
                <p><a href="{reset_link}" style="display:inline-block;padding:10px 20px;background-color:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Đặt lại mật khẩu</a></p>
                <p>Hoặc copy đường link này dán vào trình duyệt: {reset_link}</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p>Cảm ơn,<br>Đội ngũ VPL Hotel</p>
            </body>
        </html>
        """

        try:
            r = resend.Emails.send({
                "from": settings.RESEND_FROM_EMAIL,
                "to": user.email,
                "subject": "Đặt lại mật khẩu VPL Hotel",
                "html": html_content
            })
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False

    @staticmethod
    def send_booking_confirmation(payload: dict):
        if not settings.RESEND_API_KEY:
            print(f"Warning: RESEND_API_KEY not set. Would have sent booking confirmation to {payload.get('customer_email')}")
            return False

        customer_email = payload.get('customer_email')
        if not customer_email:
            return False

        booking_id = payload.get('booking_id')
        check_in = payload.get('check_in')
        check_out = payload.get('check_out')
        hotel_name = payload.get('hotel_name', 'Khách sạn')
        price = payload.get('price', {}).get('total', 0)

        html_content = f"""
        <html>
            <body>
                <h2>Xác nhận đặt phòng thành công!</h2>
                <p>Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
                <h3>Chi tiết đơn đặt phòng:</h3>
                <ul>
                    <li><strong>Mã đơn:</strong> {booking_id}</li>
                    <li><strong>Khách sạn:</strong> {hotel_name}</li>
                    <li><strong>Ngày nhận phòng:</strong> {check_in}</li>
                    <li><strong>Ngày trả phòng:</strong> {check_out}</li>
                    <li><strong>Tổng tiền:</strong> {price:,.0f} VND</li>
                </ul>
                <p>Chúc bạn có một kỳ nghỉ thật vui vẻ!</p>
                <p>Cảm ơn,<br>Đội ngũ VPL Hotel</p>
            </body>
        </html>
        """

        try:
            resend.Emails.send({
                "from": settings.RESEND_FROM_EMAIL,
                "to": customer_email,
                "subject": f"Xác nhận đặt phòng {booking_id}",
                "html": html_content
            })
            return True
        except Exception as e:
            print(f"Failed to send booking confirmation email: {e}")
            return False
