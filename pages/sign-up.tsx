import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "components/custom-button/custom-button.component";
import CustomInput from "components/custom-input/custom-input.component";
import Navbar from "components/navbar/navbar.component";

const emailValidateRegex = /@/; // I should improve this

import { SignUpFormInputs } from "types/forms.types";
import { useAuth } from "hooks/useAuth.provider";
import { useRouter } from "next/router";
import GoogleSignInButton from "components/google-sign-in/google-sign-in.component";
import LoadingSpinner from "components/loading-spinner/loading-spinner.component";

export default function SignIn(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, errors, watch, setError } = useForm<SignUpFormInputs>();
  const { signUp, user } = useAuth();

  const router = useRouter();

  const onSubmit = (formInput: SignUpFormInputs): void => {
    setIsLoading(true);
    signUp(formInput).catch((error) => {
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("email", { message: "Account with this email already exists" });
          break;

        default:
          break;
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (user.uid) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div>
      <Head>
        <title>Sign Up | Ency</title>
      </Head>
      <div
        style={{ backgroundImage: "url('./formpage-bg.svg')" }}
        className="bg-no-repeat min-h-screen h-full bg-cover bg-center"
      >
        <Navbar />
        <div className="w-full flex justify-center">
          <div className="max-w-md w-full bg-white rounded-md shadow-2xl pt-10 px-7 pb-8 mb-10">
            <h1 className="text-4xl font-bold pb-2">Sign Up</h1>

            <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <CustomInput
                label="Your Email"
                textSize="base"
                type="email"
                name="email"
                placeHolder="Enter Your Email"
                error={errors.email?.message}
                fref={register({
                  required: "Field is required",
                  pattern: {
                    value: emailValidateRegex,
                    message: "Invalid email",
                  },
                })}
              />
              <CustomInput
                label="Your Name"
                textSize="base"
                type="text"
                name="name"
                placeHolder="Enter Your Name"
                error={errors.name?.message}
                fref={register({
                  required: "Field is required",
                  min: {
                    value: 2,
                    message: "This is too short for a name (min 2 chars)",
                  },
                  max: {
                    value: 30,
                    message: "Names have a max length of 30 characters",
                  },
                  pattern: {
                    value: /^([a-z]|\s)+$/i,
                    message: "Name can only contain english alphabets and white-spaces",
                  },
                })}
              />
              <CustomInput
                label="Password"
                textSize="base"
                type="password"
                name="password"
                placeHolder="Enter Your Password"
                error={errors.password?.message}
                fref={register({
                  required: "Field is required",
                  min: {
                    value: 6,
                    message: "Password should be atleast 6 characters or longer (max 20)",
                  },
                  max: {
                    value: 20,
                    message: "Password should be atleast 6 characters or longer (max 20)",
                  },
                  validate: {
                    hasLetters: (value) =>
                      /[a-z]/i.test(value) || "Password should containe atleast on Alphabet",
                    hasNumbers: (value) =>
                      /[0-9]/.test(value) || "Password should contain atleast one Number",
                  },
                })}
              />
              <CustomInput
                label="Confirm Password"
                textSize="base"
                type="password"
                name="cpassword"
                placeHolder="Enter Your Password Again"
                error={errors.cpassword?.message}
                fref={register({
                  required: "Field is required",
                  validate: {
                    matchesPass: (value) => watch("password") === value || "Passwords dont match",
                  },
                })}
              />
              <CustomButton className="w-full mt-2" onClick={handleSubmit(onSubmit)}>
                {isLoading ? (
                  <div className="w-full flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  "Sign Up"
                )}
              </CustomButton>
            </form>

            <p className="text-center w-full my-2">or</p>

            <span className="mb-5 block">
              <GoogleSignInButton />
            </span>

            <p className="text-center">
              Already have an account?{" "}
              <Link href="/sign-in">
                <a className="text-blue-500 hover:underline">Sign In</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
