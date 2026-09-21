"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import useApiMutation from "@/hooks/Mutations/useApiMutation";
import { APICONSTANT } from "@/services/apiconfig";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { AdminUser } from "./UsersList";

const schema = z.object({
  username: z.string().trim().min(1, "Username is required"),

  email: z.string().trim().email("Enter a valid email"),

  phone_number: z.string().trim().min(1, "Phone number is required"),
});

type FormValues = z.infer<typeof schema>;

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
}

function UserModal({ open, onOpenChange, user }: UserModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useApiMutation("put");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username ?? "",
        email: user.email ?? "",
        phone_number: user.phone_number ?? "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: FormValues) => {
    if (!user) return;

    updateMutation.mutate(
      {
        url: {
          apiUrl: APICONSTANT.UpdateAdminUser.replace(
            "{user_id}",
            String(user.id),
          ),
        },

        body: {
          username: data.username.trim(),
          email: data.email.trim(),
          phone_number: data.phone_number.trim(),
        },
      },
      {
        onSuccess: (response) => {
          if (response?.success === true) {
            queryClient.invalidateQueries({
              queryKey: ["GetAdminUsers"],
            });

            onOpenChange(false);
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Phone Number</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UserModal;
