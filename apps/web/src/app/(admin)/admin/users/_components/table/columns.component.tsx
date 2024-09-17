"use client";

import { type TableColumnsType } from "antd";

import { ActionCell, SubscriptionAction } from "./_components";

import { User } from "@/entities/user";
import { formatDate } from "@/utils/time";

export const columns: TableColumnsType<User> = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (_, user) => {
      return user.email;
    },
  },
  {
    title: "Banned",
    dataIndex: "isBanned",
    key: "isBanned",
    render: (_, user) => {
      return user.isBanned ? "Banned" : "Not banned";
    },
  },
  {
    title: "Verified at",
    dataIndex: "verified",
    key: "verified",
    render: (_, user) => {
      return user.verified
        ? formatDate(new Date(user.verified))
        : "Not verified";
    },
  },
  {
    title: "Registered at",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_, user) => {
      return formatDate(new Date(user.createdAt));
    },
  },
  {
    title: "Subscription",
    dataIndex: "currentSubscription",
    key: "currentSubscription",
    render: (_, user) => {
      return <SubscriptionAction user={user} />;
    },
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, user) => {
      return <ActionCell user={user} />;
    },
  },
];
