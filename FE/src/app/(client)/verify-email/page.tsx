"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchBackendJson } from "@/lib/api/backend";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác thực email của bạn...");

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    if (!uid || !token) {
      setStatus("error");
      setMessage("Link xác nhận không hợp lệ hoặc bị thiếu tham số.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetchBackendJson<{ message: string }>("/auth/verify-email/", {
          method: "POST",
          body: { uid, token },
        });
        setStatus("success");
        setMessage(response.message || "Xác nhận email thành công!");
        toast.success("Xác nhận email thành công! Bạn có thể đăng nhập.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Xác nhận email thất bại. Link có thể đã hết hạn.");
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="tw-bg-white tw-shadow-lg tw-rounded-xl tw-p-10 tw-text-center tw-max-w-md tw-w-full">
      {status === "loading" && (
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="spinner-border text-main-600 tw-mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="tw-text-xl fw-bold">Đang xác nhận...</h3>
          <p className="tw-text-gray-500 tw-mt-2">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-bg-green-100 tw-text-green-600 tw-rounded-full tw-p-4 tw-mb-4">
            <i className="ph-fill ph-check-circle tw-text-5xl"></i>
          </div>
          <h3 className="tw-text-xl fw-bold tw-text-gray-800">Thành công!</h3>
          <p className="tw-text-gray-500 tw-mt-2">{message}</p>
          <p className="tw-text-sm tw-text-gray-400 tw-mt-1">Tự động chuyển hướng tới Đăng nhập...</p>
          <Link href="/login" className="tw-btn-hover-black bg-main-600 tw-py-3 tw-px-8 tw-rounded-lg tw-text-white tw-mt-6 tw-inline-block">
            Đăng nhập ngay
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-bg-red-100 tw-text-red-600 tw-rounded-full tw-p-4 tw-mb-4">
            <i className="ph-fill ph-x-circle tw-text-5xl"></i>
          </div>
          <h3 className="tw-text-xl fw-bold tw-text-gray-800">Lỗi xác nhận!</h3>
          <p className="tw-text-gray-500 tw-mt-2">{message}</p>
          <Link href="/register" className="tw-btn-hover-black tw-bg-gray-800 tw-py-3 tw-px-8 tw-rounded-lg tw-text-white tw-mt-6 tw-inline-block">
            Đăng ký lại
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <section className="bg_2 tw-min-h-[70vh] tw-flex tw-items-center tw-justify-center tw-py-20">
      <div className="container tw-flex tw-justify-center">
        <Suspense fallback={<div>Đang tải...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </section>
  );
}
