"use client"

import { toast } from "sonner"

const formatMessage = (msg: string) => {
  return msg
    ?.toLowerCase()
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase())
}

export const showToast = {
  success: (title: string, description?: string) =>
    toast.success(formatMessage(title), { description }),

  error: (title: string, description?: string) =>
    toast.error(formatMessage(title), { description }),

  info: (title: string, description?: string) =>
    toast(formatMessage(title), { description }),

  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) {
    return toast.promise(promise, {
      loading: formatMessage(messages.loading),
      success: formatMessage(messages.success),
      error: formatMessage(messages.error),
    })
  },
}