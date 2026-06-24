"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { resetPasswordConfirm } from "@/lib/api/authApi";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uid || !token) {
      toast.error("Đường dẫn đặt lại mật khẩu không hợp lệ hoặc bị thiếu tham số.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirm = String(formData.get("password_confirm") ?? "");

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Xác nhận mật khẩu không khớp.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await resetPasswordConfirm({
        uid,
        token,
        new_password: password,
      });
      toast.success(response.message || "Đặt lại mật khẩu thành công!");
      router.push("/login");
      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Có lỗi xảy ra khi đặt lại mật khẩu.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-xl-10'>
            <div className='row align-items-center'>
              <div className='col-xl-5 col-lg-5'>
                <div className='section-two-wrapper tw-mb-14'>
                  <h6 className='section-two-subtitle tw-text-xl text-uppercase text-main-three-800 tw-mb-4'>
                    Bảo mật tài khoản
                  </h6>
                  <h2 className='section-two-title tw-text-16 fw-normal tw-mb-6 tw-char-animation'>
                    Đặt lại mật khẩu
                  </h2>
                  <p className='fw-medium tw-text-lg'>
                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                  </p>
                </div>
              </div>

              <div className='col-xl-7 col-lg-7'>
                <div className='contact-two-form bg-white tw-py-16 tw-px-10 tw-mb-7'>
                  <form onSubmit={handleSubmit}>
                    <div className='row'>
                      <div className='col-xl-12'>
                        <div className='contact-two-form-group tw-mb-6'>
                          <label className='tw-text-xl fw-medium tw-text-black tw-mb-3 block'>
                            Mật khẩu mới
                          </label>
                          <input
                            type='password'
                            name='password'
                            className='form-control tw-bg-white border tw-border-gray-200'
                            placeholder='Nhập mật khẩu mới...'
                            required
                            minLength={8}
                          />
                        </div>
                      </div>

                      <div className='col-xl-12'>
                        <div className='contact-two-form-group tw-mb-6'>
                          <label className='tw-text-xl fw-medium tw-text-black tw-mb-3 block'>
                            Xác nhận mật khẩu
                          </label>
                          <input
                            type='password'
                            name='password_confirm'
                            className='form-control tw-bg-white border tw-border-gray-200'
                            placeholder='Nhập lại mật khẩu mới...'
                            required
                            minLength={8}
                          />
                        </div>
                      </div>

                      <div className='col-xl-12'>
                        <div className='contact-two-form-group'>
                          <button
                            type='submit'
                            className='btn btn-main-three w-100'
                            disabled={submitting}
                          >
                            {submitting ? (
                              <span className='spinner-border spinner-border-sm me-2'></span>
                            ) : null}
                            Xác nhận thay đổi
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
