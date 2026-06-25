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
import { useLanguage } from "@/lib/i18n/LanguageContext";
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
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgotPassword = mode === "forgot-password";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setIsRateLimited(false);
    setIsUnauthorized(false);

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
        toast.success((regResponse as any).message || "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
        // Redirect to login or just clear form
        router.push("/login");
        router.refresh();
        return;
      }

      const loginResponse = await login({
        email: formValue(formData, "email").toLowerCase(),
        password: String(formData.get("password") ?? ""),
      });
      persistAuthSession(loginResponse);
      setUser(loginResponse.user);
      router.push(nextPath || "/profile");
      router.refresh();
    } catch (requestError) {
      let isHandled = false;
      if (requestError instanceof Error && requestError.message.includes("429")) {
        setIsRateLimited(true);
        isHandled = true;
      } else if (requestError instanceof Error && requestError.message.includes("401")) {
        setIsUnauthorized(true);
        isHandled = true;
      }
      
      if (!isHandled) {
        toast.error(
          requestError instanceof Error
            ? requestError.message
            : "Yêu cầu xác thực thất bại.",
        );
      }
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
                      ? t("auth.welcomeBack")
                      : isRegister
                        ? t("auth.createAccount")
                        : t("auth.recoverAccount")}
                  </h6>
                  <h2 className='section-two-title tw-text-16 fw-normal tw-mb-6 tw-char-animation'>
                    {isLogin
                      ? t("auth.loginTitle")
                      : isRegister
                        ? t("auth.registerTitle")
                        : t("auth.resetTitle")}
                  </h2>
                  <p className='fw-medium tw-text-lg'>
                    {isLogin
                      ? t("auth.loginDesc")
                      : isRegister
                        ? t("auth.registerDesc")
                        : t("auth.resetDesc")}
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
                              placeholder={t("auth.fullNamePlaceholder")}
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
                            placeholder={t("auth.emailPlaceholder")}
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
                              placeholder={t("auth.passwordPlaceholder")}
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
                              placeholder={t("auth.passwordConfirmPlaceholder")}
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
                            {t("auth.rememberMe")}
                          </label>
                          <Link className='text-main-600 fw-bold' href='/forgot-password'>
                            {t("auth.forgotPassword")}
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
                              {t("auth.waitMsg")}
                            </>
                          ) : isLogin ? (
                            t("auth.loginBtn")
                          ) : isRegister ? (
                            t("auth.registerBtn")
                          ) : (
                            t("auth.resetBtn")
                          )}
                          {!submitting && (
                            <span className='d-inline-block lh-1 tw-text-lg'>
                              <i className='ph ph-arrow-right' />
                            </span>
                          )}
                        </button>
                        {isRateLimited && isLogin && (
                          <div className='text-danger text-center tw-mt-4 fw-medium'>
                            Bạn đã nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau.
                          </div>
                        )}
                        {isUnauthorized && isLogin && !isRateLimited && (
                          <div className='text-danger text-center tw-mt-4 fw-medium'>
                            Bạn nhập sai mật khẩu hoặc email.
                          </div>
                        )}
                      </div>

                      <div className='col-xl-12 tw-mt-6'>
                        {isLogin ? (
                          <p className='mb-0'>
                            {t("auth.noAccount")}{" "}
                            <Link className='text-main-600 fw-bold' href='/register'>
                              {t("auth.registerNow")}
                            </Link>
                          </p>
                        ) : (
                          <p className='mb-0'>
                            {t("auth.hasAccount")}{" "}
                            <Link className='text-main-600 fw-bold' href='/login'>
                              {t("auth.loginNow")}
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
