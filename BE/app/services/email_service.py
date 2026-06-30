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

        rooms = payload.get('rooms', [])
        rooms_html = "".join([f"<li>{r['quantity']}x {r['room_type_name']}</li>" for r in rooms])
        is_guest = payload.get('is_guest', False)

        contract_html = ""
        if is_guest:
            contract_html = """
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <h3>Hợp đồng lưu trú (Dành cho khách không có tài khoản)</h3>
                <p>Vì bạn đặt phòng dưới tư cách Khách, email này đồng thời đóng vai trò là <strong>Hợp đồng lưu trú điện tử</strong> giữa bạn và khách sạn.</p>
                <ol style="color: #555;">
                    <li><strong>Quyền lợi:</strong> Bạn được sử dụng phòng và các dịch vụ đi kèm đúng như thông tin đơn đặt.</li>
                    <li><strong>Nghĩa vụ:</strong> Bạn có trách nhiệm thanh toán đủ tiền, tuân thủ nội quy khách sạn và bồi thường nếu làm hỏng tài sản.</li>
                    <li><strong>Chính sách hủy:</strong> Áp dụng theo quy định của khách sạn được thông báo tại thời điểm đặt phòng.</li>
                    <li><strong>Giá trị:</strong> Xác nhận này có giá trị như một thỏa thuận ràng buộc ngay sau khi đơn được tiếp nhận (và đã cọc nếu có).</li>
                </ol>
            """

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0056b3;">Xác nhận đặt phòng thành công!</h2>
                <p>Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
                <h3>Chi tiết đơn đặt phòng:</h3>
                <ul>
                    <li><strong>Mã đơn:</strong> {booking_id}</li>
                    <li><strong>Khách sạn:</strong> {hotel_name}</li>
                    <li><strong>Loại phòng:</strong>
                        <ul>{rooms_html}</ul>
                    </li>
                    <li><strong>Ngày nhận phòng:</strong> {check_in}</li>
                    <li><strong>Ngày trả phòng:</strong> {check_out}</li>
                    <li><strong>Tổng tiền:</strong> {price:,.0f} VND</li>
                </ul>
                <p>Chúc bạn có một kỳ nghỉ thật vui vẻ!</p>
                {contract_html}
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p>Cảm ơn,<br><strong>Đội ngũ VPL Hotel</strong></p>
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

    @staticmethod
    def send_withdrawal_notification(payload: dict):
        if not settings.RESEND_API_KEY:
            print(f"Warning: RESEND_API_KEY not set. Would have sent withdrawal notification to {payload.get('vendor_email')}")
            return False

        vendor_email = payload.get('vendor_email')
        if not vendor_email:
            return False

        withdrawal_id = payload.get('withdrawal_id')
        amount = payload.get('amount')
        status = payload.get('status') # 'approved' or 'rejected'
        bank_name = payload.get('bank_name')
        account_number = payload.get('account_number')
        account_name = payload.get('account_name')

        if status == 'approved':
            title = "Yêu cầu rút tiền đã được DUYỆT"
            color = "#28a745"
            msg = "Yêu cầu rút tiền của bạn đã được quản trị viên duyệt thành công. Tiền sẽ được chuyển vào tài khoản ngân hàng của bạn trong 1-3 ngày làm việc."
        else:
            title = "Yêu cầu rút tiền bị TỪ CHỐI"
            color = "#dc3545"
            msg = "Yêu cầu rút tiền của bạn đã bị từ chối. Vui lòng liên hệ với ban quản trị hoặc kiểm tra lại thông tin ngân hàng."

        html_content = f"""
        <html>
            <body>
                <h2 style="color: {color}">{title}</h2>
                <p>Xin chào,</p>
                <p>{msg}</p>
                <h3>Chi tiết giao dịch:</h3>
                <ul>
                    <li><strong>Mã giao dịch:</strong> #{withdrawal_id}</li>
                    <li><strong>Số tiền rút:</strong> {amount:,.0f} VND</li>
                    <li><strong>Ngân hàng:</strong> {bank_name}</li>
                    <li><strong>Số tài khoản:</strong> {account_number}</li>
                    <li><strong>Chủ tài khoản:</strong> {account_name}</li>
                </ul>
                <p>Cảm ơn bạn đã hợp tác cùng VPL Hotel!</p>
            </body>
        </html>
        """

        try:
            resend.Emails.send({
                "from": settings.RESEND_FROM_EMAIL,
                "to": vendor_email,
                "subject": f"Kết quả yêu cầu rút tiền #{withdrawal_id}",
                "html": html_content
            })
            return True
        except Exception as e:
            print(f"Failed to send withdrawal email: {e}")
            return False
