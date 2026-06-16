"use client";

import React, { useState } from "react";
import Image from "next/image";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-xl-10'>
            <div className='row align-items-center'>
              <div className='col-xl-6 col-lg-6'>
                <div className='tw_fade_anim' data-delay='.3'>
                  <div className='section-two-wrapper tw-mb-14'>
                    <h6 className='section-two-subtitle tw-text-xl text-uppercase text-main-three-800 tw-mb-4'>
                      {isLogin ? "Welcome Back" : "Join Us"}
                    </h6>
                    <h2 className='section-two-title tw-text-16 fw-normal tw-mb-6 tw-char-animation'>
                      {isLogin ? "Login to EliteStay" : "Create an Account"}
                    </h2>
                    <p className='fw-medium tw-text-lg'>
                      {isLogin
                        ? "Enter your credentials to access your account, manage bookings, and explore new offers."
                        : "Sign up today to enjoy exclusive benefits, faster booking experiences, and personalized recommendations."}
                    </p>
                  </div>

                  <div className='tw-mb-8 d-none d-lg-block'>
                    {/* Optionally add an image or illustration here */}
                  </div>
                </div>
              </div>

              <div className='col-xl-6 col-lg-6'>
                <div
                  className='contact-two-form bg-white tw-py-20 tw-ps-10 tw-pe-20 tw-mb-7 tw_fade_anim'
                  data-delay='.5'
                >
                  <div className='tw-mb-10'>
                    <h2 className='tw-text-12 fw-normal tw-mb-4 tw-char-animation'>
                      {isLogin ? "Sign In" : "Sign Up"}
                    </h2>
                    <p className='tw-text-lg fw-medium'>
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className='text-main-600 hover-text-main-800 bg-transparent border-0 p-0 text-decoration-underline fw-bold'
                        style={{ cursor: 'pointer' }}
                      >
                        {isLogin ? "Register Now" : "Login Here"}
                      </button>
                    </p>
                  </div>

                  <form action='#' onSubmit={(e) => e.preventDefault()}>
                    <div className='row'>
                      {!isLogin && (
                        <div className='col-xl-12'>
                          <div className='position-relative tw-mb-11'>
                            <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                              <i className='ph-bold ph-user' />
                            </span>
                            <input
                              type='text'
                              className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14 tw-placeholder-text-neutral-700 focus-tw-placeholder-text-hidden tw-placeholder-transition-2'
                              placeholder='Full Name*'
                              required
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className='col-xl-12'>
                        <div className='position-relative tw-mb-11'>
                          <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                            <i className='ph ph-envelope' />
                          </span>
                          <input
                            type='email'
                            className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14 tw-placeholder-text-neutral-700 focus-tw-placeholder-text-hidden tw-placeholder-transition-2'
                            placeholder='Email Address*'
                            required
                          />
                        </div>
                      </div>

                      <div className='col-xl-12'>
                        <div className='position-relative tw-mb-11'>
                          <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                            <i className='ph ph-lock' />
                          </span>
                          <input
                            type='password'
                            className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14 tw-placeholder-text-neutral-700 focus-tw-placeholder-text-hidden tw-placeholder-transition-2'
                            placeholder='Password*'
                            required
                          />
                        </div>
                      </div>

                      {!isLogin && (
                        <div className='col-xl-12'>
                          <div className='position-relative tw-mb-11'>
                            <span className='position-absolute top-50 start-0 translate-middle-y text-heading tw-text-xl'>
                              <i className='ph ph-lock' />
                            </span>
                            <input
                              type='password'
                              className='form-control rounded-0 bg-white shadow-none border-none border-bottom border-bottom-neutral text-heading tw-ps-8 tw-pe-13 focus-border-main-600 tw-h-14 tw-placeholder-text-neutral-700 focus-tw-placeholder-text-hidden tw-placeholder-transition-2'
                              placeholder='Confirm Password*'
                              required
                            />
                          </div>
                        </div>
                      )}

                      {isLogin && (
                        <div className='col-xl-12 tw-mb-8 d-flex justify-content-between align-items-center'>
                          <div className='form-check'>
                            <input className='form-check-input' type='checkbox' id='rememberMe' />
                            <label className='form-check-label' htmlFor='rememberMe'>
                              Remember me
                            </label>
                          </div>
                          <button type="button" className='text-main-600 hover-text-main-800 bg-transparent border-0 p-0'>
                            Forgot Password?
                          </button>
                        </div>
                      )}

                      <div className='col-xl-12'>
                        <div>
                          <button type="submit" className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-14 text-capitalize text-heading font-heading d-inline-flex align-items-center justify-content-center tw-gap-2 tw-rounded-lg w-100'>
                            {isLogin ? "Login" : "Register"} {" "}
                            <span className='d-inline-block lh-1 tw-text-lg'>
                              <i className='ph ph-arrow-right' />
                            </span>
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
};

export default Auth;
