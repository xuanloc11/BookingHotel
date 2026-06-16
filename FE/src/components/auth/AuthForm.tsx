"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  forgotPassword,
  login,
  persistAuthSession,
  register,
} from "@/lib/api/authApi";
import { useAuth } from "@/lib/auth/AuthContext";
import { sanitizeTextInput } from "@/lib/validation/sanitize";
import toast from "react-hot-toast";

type AuthMode = "login" | "register" | "forgot-password";

interface AuthFormProps {
  mode: AuthMode;
  nextPath?: string;
}

function formValue(formData: FormData, key: string): string {
  return sanitizeTextInput(String(formData.get(key) ?? ""));
}

export default function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgotPassword = mode === "forgot-password";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (isForgotPassword) {
        const response = await forgotPassword({
          email: formValue(formData, "email").toLowerCase(),
        });
        toast.success(response.detail || "Đã gửi hướng dẫn đặt lại mật khẩu.");
        return;
      }

      if (isRegister) {
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

        const regResponse = await register({
          full_name: formValue(formData, "full_name"),
          email: formValue(formData, "email").toLowerCase(),
          password,
          password_confirm: passwordConfirm,
        });
        persistAuthSession(regResponse);
        setUser(regResponse.user);
        toast.success("Đăng ký thành công!");
        router.push(nextPath || "/my-bookings");
        router.refresh();
        return;
      }

      const loginResponse = await login({
        email: formValue(formData, "email").toLowerCase(),
        password: String(formData.get("password") ?? ""),
      });
      persistAuthSession(loginResponse);
      setUser(loginResponse.user);
      toast.success("Đăng nhập thành công!");
      router.push(nextPath || "/my-bookings");
      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Yêu cầu xác thực thất bại.",
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
                    {isLogin
                      ? "Chào mừng trở lại"
                      : isRegister
                        ? "Tạo tài khoản"
                        : "Khôi phục tài khoản"}
                  </h6>
                  <h2 className='section-two-title tw-text-16 fw-normal tw-mb-6 tw-char-animation'>
                    {isLogin
                      ? "Đăng nhập"
                      : isRegister
                        ? "Đăng ký"
                        : "Đặt lại mật khẩu"}
                  </h2>
                  <p className='fw-medium tw-text-lg'>
                    Quản lý đơn đặt phòng, chi tiết hồ sơ và lịch sử chuyến đi từ một tài khoản an toàn.
                  </p>
                </div>
              </div>

              <div className='col-xl-7 col-lg-7'>
                <div className='contact-two-form bg-white tw-py-16 tw-px-10 tw-mb-7'>
                  <form onSubmit={handleSubmit}>
                    <div className='row'>
                      {isRegister ? (
                        <div className='col-xl-12'>
                          <div className='position-relative tw-mb-8'>
                            <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                              <i className='ph ph-user' />
                            </span>
                            <input
                              className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14'
                              name='full_name'
                              placeholder='Họ và tên'
                              required
                              type='text'
                            />
                          </div>
                        </div>
                      ) : null}

                      <div className='col-xl-12'>
                        <div className='position-relative tw-mb-8'>
                          <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                            <i className='ph ph-envelope' />
                          </span>
                          <input
                            className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14'
                            name='email'
                            placeholder='Địa chỉ email'
                            required
                            type='email'
                          />
                        </div>
                      </div>

                      {!isForgotPassword ? (
                        <div className='col-xl-12'>
                          <div className='position-relative tw-mb-8'>
                            <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                              <i className='ph ph-lock' />
                            </span>
                            <input
                              className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14'
                              name='password'
                              placeholder='Mật khẩu'
                              required
                              type='password'
                            />
                          </div>
                        </div>
                      ) : null}

                      {isRegister ? (
                        <div className='col-xl-12'>
                          <div className='position-relative tw-mb-8'>
                            <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                              <i className='ph ph-lock-key' />
                            </span>
                            <input
                              className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14'
                              name='password_confirm'
                              placeholder='Xác nhận mật khẩu'
                              required
                              type='password'
                            />
                          </div>
                        </div>
                      ) : null}

                      {isLogin ? (
                        <div className='col-xl-12 tw-mb-8 d-flex justify-content-between align-items-center flex-wrap row-gap-2'>
                          <label className='form-check-label d-flex align-items-center tw-gap-2'>
                            <input className='form-check-input' type='checkbox' />
                            Ghi nhớ đăng nhập
                          </label>
                          <Link className='text-main-600 fw-bold' href='/forgot-password'>
                            Quên mật khẩu?
                          </Link>
                        </div>
                      ) : null}

                      <div className='col-xl-12'>
                        <button
                          className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-14 text-capitalize text-heading font-heading d-inline-flex align-items-center justify-content-center tw-gap-2 tw-rounded-lg w-100'
                          disabled={submitting}
                          type='submit'
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Vui lòng chờ...
                            </>
                          ) : isLogin ? (
                            "Đăng nhập"
                          ) : isRegister ? (
                            "Đăng ký"
                          ) : (
                            "Gửi liên kết đặt lại"
                          )}
                          {!submitting && (
                            <span className='d-inline-block lh-1 tw-text-lg'>
                              <i className='ph ph-arrow-right' />
                            </span>
                          )}
                        </button>
                      </div>

                      <div className='col-xl-12 tw-mt-6'>
                        {isLogin ? (
                          <p className='mb-0'>
                            Chưa có tài khoản?{" "}
                            <Link className='text-main-600 fw-bold' href='/register'>
                              Đăng ký
                            </Link>
                          </p>
                        ) : (
                          <p className='mb-0'>
                            Đã có tài khoản?{" "}
                            <Link className='text-main-600 fw-bold' href='/login'>
                              Đăng nhập
                            </Link>
                          </p>
                        )}
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
