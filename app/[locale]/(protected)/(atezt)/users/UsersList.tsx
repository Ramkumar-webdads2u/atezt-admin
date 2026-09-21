"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Search,
  Users,
  UserCheck,
  UserX,
  BookOpen,
} from "lucide-react";

import useReactQuery from "@/hooks/useReactQuery";
import useApiMutation from "@/hooks/Mutations/useApiMutation";

import { APICONSTANT } from "@/services/apiconfig";

import { DataTable } from "@/components/ui/tablereusable";
import CardReusable from "@/components/ui/CardReusable";
import DeleteConfirmModal from "@/components/DeleteModal/DeleteConfirmModal";
import { RetryableError } from "@/components/ui/RetryableError";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserModal from "./UserModal";
import UserExamDetailsModal from "./UserExamDetailsModal";

export interface UserExamCounts {
  purchased_exams: number;
  total_exams: number;
  passed_exams: number;
  failed_exams: number;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  created_at: string;
  exam_counts: UserExamCounts;
}

interface UsersApiResponse {
  success: boolean;
  message: string;
  counts: {
    total: number;
    active: number;
    inactive: number;
    total_exams: number;
  };
  total_records: number;
  data: AdminUser[];
}

function UsersList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);

  const [showExamDetails, setShowExamDetails] = useState(false);

  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryString = useMemo(() => {
    return "";
  }, []);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useReactQuery<UsersApiResponse>("GetAdminUsers", queryString);

  const deleteMutation = useApiMutation("delete");

  const statusMutation = useApiMutation("patch");

  const users = response?.data ?? [];

  /**
   * Client-side search
   */
  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.username?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.phone_number?.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  /**
   * Client-side pagination
   */
  const totalRecords = filteredUsers.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const safePage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;

    return filteredUsers.slice(start, end);
  }, [filteredUsers, safePage, pageSize]);

  /**
   * Search
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  /**
   * Edit
   */
  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  /**
   * Exam details
   */
  const handleExamDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setShowExamDetails(true);
  };

  /**
   * Delete
   */
  const handleDelete = (user: AdminUser) => {
    setDeleteUser(user);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteUser) return;

    deleteMutation.mutate(
      {
        url: {
          apiUrl: APICONSTANT.DeleteAdminUser.replace(
            "{user_id}",
            String(deleteUser.id),
          ),
        },
      },
      {
        onSuccess: (response) => {
          if (response?.success === true) {
            setDeleteOpen(false);
            setDeleteUser(null);
            refetch();
          }
        },
      },
    );
  };

  /**
   * Active / Inactive
   */
  const handleStatusChange = (user: AdminUser) => {
    statusMutation.mutate(
      {
        url: {
          apiUrl: APICONSTANT.UpdateAdminUserStatus.replace(
            "{user_id}",
            String(user.id),
          ),
        },
        body: {
          is_active: !user.is_active,
        },
      },
      {
        onSuccess: (response) => {
          if (response?.success === true) {
            refetch();
          }
        },
      },
    );
  };

  /**
   * Desktop table
   */
  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.username || "---"}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="max-w-[260px] break-words">
            {row.original.email || "---"}
          </div>
        ),
      },
      {
        accessorKey: "phone_number",
        header: "Phone",
        cell: ({ row }) => <div>{row.original.phone_number || "---"}</div>,
      },
      {
        accessorKey: "exam_counts",
        header: "Exams",
        cell: ({ row }) => {
          const counts = row.original.exam_counts;

          return (
            <div className="text-sm">
              <div>
                Purchased:{" "}
                <span className="font-medium">
                  {counts?.purchased_exams ?? 0}
                </span>
              </div>

              <div className="text-muted-foreground">
                Passed: {counts?.passed_exams ?? 0} · Failed:{" "}
                {counts?.failed_exams ?? 0}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={
              row.original.is_active
                ? "font-medium text-green-600"
                : "font-medium text-red-500"
            }
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {row.original.created_at || "---"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExamDetails(user)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Exam Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleEdit(user)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange(user)}
                  disabled={statusMutation.isPending}
                >
                  {user.is_active ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Make Inactive
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Make Active
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(user)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [statusMutation.isPending],
  );

  /**
   * Error
   */
  if (isError) {
    return (
      <RetryableError
        message="Failed to load users"
        onRetry={() => refetch()}
        isRetrying={isLoading}
      />
    );
  }

  const counts = response?.counts;

  return (
    <div className="w-full space-y-6 px-5 py-4">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>

          <p className="text-sm text-muted-foreground">
            Manage registered users and their exam activity.
          </p>
        </div>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>

              <p className="text-xl font-semibold">{counts?.total ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5 text-green-600" />

            <div>
              <p className="text-sm text-muted-foreground">Active</p>

              <p className="text-xl font-semibold">{counts?.active ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-3">
            <UserX className="h-5 w-5 text-red-500" />

            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>

              <p className="text-xl font-semibold">{counts?.inactive ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Total Exams</p>

              <p className="text-xl font-semibold">
                {counts?.total_exams ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex w-full">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search username, email or phone..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={paginatedUsers}
          isLoading={isLoading}
          page={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
        />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <CardReusable<AdminUser>
          data={paginatedUsers}
          isLoading={isLoading}
          page={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setPage}
          getKey={(item) => item.id}
          actions={(item) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExamDetails(item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Exam Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleEdit(item)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleStatusChange(item)}
                  disabled={statusMutation.isPending}
                >
                  {item.is_active ? "Make Inactive" : "Make Active"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          fields={[
            {
              key: "username",
              label: "Username",
              colSpan: 2,
              render: (item) => (
                <span className="font-semibold">{item.username || "---"}</span>
              ),
            },
            {
              key: "email",
              label: "Email",
              colSpan: 2,
              render: (item) => (
                <span className="break-words">{item.email || "---"}</span>
              ),
            },
            {
              key: "phone_number",
              label: "Phone",
              colSpan: 1,
              render: (item) => item.phone_number || "---",
            },
            {
              key: "status",
              label: "Status",
              colSpan: 1,
              render: (item) => (
                <span
                  className={
                    item.is_active
                      ? "font-medium text-green-600"
                      : "font-medium text-red-500"
                  }
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              key: "exams",
              label: "Exam Activity",
              colSpan: 2,
              render: (item) => (
                <div className="space-y-1">
                  <div>Purchased: {item.exam_counts?.purchased_exams ?? 0}</div>

                  <div className="text-muted-foreground">
                    Passed: {item.exam_counts?.passed_exams ?? 0}
                    {" · "}
                    Failed: {item.exam_counts?.failed_exams ?? 0}
                  </div>
                </div>
              ),
            },
            {
              key: "created_at",
              label: "Created At",
              colSpan: 2,
              render: (item) => (
                <span className="break-words">{item.created_at || "---"}</span>
              ),
            },
          ]}
        />
      </div>

      {/* Edit Modal */}
      <UserModal
        open={showUserModal}
        onOpenChange={(open) => {
          setShowUserModal(open);

          if (!open) {
            setSelectedUser(null);
          }
        }}
        user={selectedUser}
      />

      {/* Exam Details Modal */}
      <UserExamDetailsModal
        open={showExamDetails}
        onOpenChange={(open) => {
          setShowExamDetails(open);

          if (!open) {
            setSelectedUser(null);
          }
        }}
        user={selectedUser}
      />

      {/* Delete */}
      {/* <DeleteConfirmModal
        open={deleteOpen}
        // onOpenChange={(open) => {
        //   setDeleteOpen(open);

        //   if (!open) {
        //     setDeleteUser(null);
        //   }
        // }}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setDeleteId(null);
          }
        }}
        title="Delete User"
        description={`Are you sure you want to delete "${
          deleteUser?.username ?? ""
        }"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      /> */}
    </div>
  );
}

export default UsersList;
