"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import { APICONSTANT } from "@/services/apiconfig";
import useLoginMutation from "@/hooks/Mutations/useLoginMutation";

// ===============================
// VALIDATION
// ===============================

const schema = z.object({
  email: z
    .string()
    .email({
      message: "Your email is invalid.",
    }),

  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters.",
    }),
});

type LoginFormValues = z.infer<typeof schema>;

// ===============================
// COMPONENT
// ===============================

const LoginForm = () => {
  const [isPending, startTransition] =
    React.useTransition();

  const [passwordType, setPasswordType] =
    React.useState<"password" | "text">(
      "password"
    );

  const [selectedOrgId] =
    React.useState<string>("");

  const togglePasswordType = () => {
    setPasswordType((prev) =>
      prev === "password"
        ? "text"
        : "password"
    );
  };

  // ===============================
  // FORM
  // ===============================

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),

    mode: "all",

    defaultValues: {
      email:
        "guna@gmail.com",

      password: "Guna@123",
    },
  });

  // ===============================
  // LOGIN MUTATION
  // ===============================

  const loginMutation =
    useLoginMutation();

  // ===============================
  // SUBMIT
  // ===============================

  const onSubmit = async (
  data: z.infer<typeof schema>
) => {
  startTransition(async () => {
    try {
      await loginMutation.mutateAsync({
        url: {
          apiUrl: APICONSTANT.Login,
        },

        body: data,
      });
    } catch (error) {
      console.error(
        "Login failed",
        error
      );
    }
  });
};

  const loading =
    isPending ||
    loginMutation.isPending;

  // ===============================
  // UI
  // ===============================

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-5 2xl:mt-7 space-y-4"
    >
      {/* EMAIL */}

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="font-medium text-default-600"
        >
          Email
        </Label>

        <Input
          size="lg"
          disabled={loading}
          {...register("email")}
          type="email"
          id="email"
          className={cn({
            "border-destructive":
              errors.email,
          })}
        />

        {errors.email && (
          <div className="text-destructive mt-2 text-sm">
            {errors.email.message}
          </div>
        )}
      </div>

      {/* PASSWORD */}

      <div className="mt-3.5 space-y-2">
        <Label
          htmlFor="password"
          className="mb-2 font-medium text-default-600"
        >
          Password
        </Label>

        <div className="relative">
          <Input
            size="lg"
            disabled={loading}
            {...register("password")}
            type={passwordType}
            id="password"
            className={cn("peer", {
              "border-destructive":
                errors.password,
            })}
            placeholder=" "
          />

          <button
            type="button"
            aria-label={
              passwordType === "password"
                ? "Show password"
                : "Hide password"
            }
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={
              togglePasswordType
            }
          >
            {passwordType ===
            "password" ? (
              <Icon
                icon="heroicons:eye"
                className="w-5 h-5 text-default-400"
              />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-5 h-5 text-default-400"
              />
            )}
          </button>
        </div>

        {errors.password && (
          <div className="text-destructive mt-2 text-sm">
            {errors.password.message}
          </div>
        )}
      </div>

      {/* SUBMIT */}

      <Button
        type="submit"
        fullWidth
        disabled={loading}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {loading
          ? "Loading..."
          : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginForm;