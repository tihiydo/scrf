"use client";

import { useMemo } from "react";
import { Dropdown } from "antd";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  LoadingOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";

import { AxiosInternalApiError } from "@/types";
import { updateArrayObjectItem } from "@/utils";
import { ADMIN_KEYS } from "@/constants/query-keys";
import { Subscriptions, User } from "@/entities/user";
import { apiClient } from "@/app/api/client";

type SubscriptionActionProps = {
  user: User;
};

const useSubscriptionMutation = (
  url: string,
  queryClient: ReturnType<typeof useQueryClient>,
  successMessage: string
) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.patch(url);
      return response.data;
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData([ADMIN_KEYS.GET_USERS], (users: User[]) =>
        updateArrayObjectItem({
          array: users,
          updatingItem: updatedUser,
          comparatorKey: "id",
        })
      );
    },
    onError: (error: AxiosInternalApiError) => {
      console.error(successMessage, error);
    },
  });
};

export const SubscriptionAction: React.FC<SubscriptionActionProps> = ({
  user,
}) => {
  const queryClient = useQueryClient();

  const acceptSubscriptionMutation = useSubscriptionMutation(
    `/users/approve-subscription/${user.id}`,
    queryClient,
    "Subscription accepting error"
  );

  const declineSubscriptionMutation = useSubscriptionMutation(
    `/users/decline-subscription/${user.id}`,
    queryClient,
    "Subscription decline error"
  );

  const currentStateOfSubscription = useMemo(() => {
    const capitalizeFirstLetter = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (user.currentSubscription && !user.subscriptionExpired) {
      return `${capitalizeFirstLetter(Subscriptions[user.currentSubscription])} plan awaiting approval`;
    } else if (user.currentSubscription && user.subscriptionExpired) {
      return `${capitalizeFirstLetter(Subscriptions[user.currentSubscription])} plan approved`;
    }
    return "None";
  }, [user]);

  const menuItems = useMemo(() => {
    const items: any[] = [];
    if (user.currentSubscription && !user.subscriptionExpired) {
      items.push(
        {
          key: "accept",
          label: "Accept",
          icon: acceptSubscriptionMutation.isPending ? (
            <LoadingOutlined style={{ fontSize: "16px" }} />
          ) : (
            <CheckOutlined />
          ),
          onClick: () => acceptSubscriptionMutation.mutate(),
          disabled: acceptSubscriptionMutation.isPending,
        },
        {
          key: "decline",
          label: "Decline",
          icon: <StopOutlined style={{ fontSize: "16px" }} />,
          onClick: () => declineSubscriptionMutation.mutate(),
          disabled: declineSubscriptionMutation.isPending,
        }
      );
    } else if (user.currentSubscription && user.subscriptionExpired) {
      items.push({
        key: "decline",
        label: "Decline",
        icon: <StopOutlined style={{ fontSize: "16px" }} />,
        onClick: () => declineSubscriptionMutation.mutate(),
        disabled: declineSubscriptionMutation.isPending,
      });
    }
    return items;
  }, [
    user,
    acceptSubscriptionMutation.isPending,
    declineSubscriptionMutation.isPending,
  ]);

  return (
    <Dropdown
      menu={{
        items: menuItems,
      }}
      placement="bottomLeft"
      trigger={["click"]}
      arrow
    >
      <p>{currentStateOfSubscription}</p>
    </Dropdown>
  );
};
