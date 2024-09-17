import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dropdown, Button } from "antd";

import {
  LoadingOutlined,
  StopOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { ADMIN_KEYS } from "@/constants/query-keys";
import { User, UserRole } from "@/entities/user";
import { AxiosInternalApiError } from "@/types";
import { updateArrayObjectItem } from "@/utils";
import { apiClient } from "@/app/api/client";
import { observer } from "mobx-react-lite";
import { useSession } from "@/session/hooks/use-session";

export const ActionCell = observer(({ user }: { user: User }) => {
  const sessionStore = useSession();
  const queryClient = useQueryClient();
  const toggleBanMutation = useMutation({
    mutationKey: [ADMIN_KEYS.TOGGLE_BAN, user.id],
    mutationFn: async () => {
      const response = await apiClient.post<User>(
        `/users/ban-toggle/${user.id}`
      );

      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([ADMIN_KEYS.GET_USERS], (users: User[]) => {
        return updateArrayObjectItem({
          array: users,
          updatingItem: updatedUser,
          comparatorKey: "id",
        });
      });
    },
    onError: (error: AxiosInternalApiError) => {

    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(`/users/${user.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData([ADMIN_KEYS.GET_USERS], (users: User[]) => {
        return users.filter((filterUser) => {
          return filterUser.id !== user.id;
        });
      });
    },
    onError: (error: AxiosInternalApiError) => {
    },
  });

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "ban",
            label: user.isBanned ? "Unban" : "Ban",
            icon: toggleBanMutation.isPending ? (
              <LoadingOutlined style={{ fontSize: "16px" }} />
            ) : (
              <StopOutlined style={{ fontSize: "16px" }} />
            ),
            onClick: () => {
              toggleBanMutation.mutate();
            },
            disabled: toggleBanMutation.isPending,
          },
          sessionStore.user?.role === UserRole.Admin ? (
            {
              key: "deleteuser",
              label: "Delete",
              icon: <DeleteOutlined style={{ fontSize: "16px" }} />,
              onClick: () => {
                deleteUserMutation.mutate();
              },
              disabled: deleteUserMutation.isPending,
            }
          ) : null
          ,
        ],
      }}
      placement="bottomRight"
      trigger={["click"]}
      arrow
    >
      <Button type="text" icon={<MoreOutlined />}></Button>
    </Dropdown>
  );
})

