import {Permission} from "@/types/bank_user/actuary.ts";
import {api_bank_user} from "../axios";
import {User} from "@/types/bank_user/user.ts";


export enum PermissionSetType{
    Invalid,
    Set,
    Clear
}

export const editPermission = async (
  id: string,
  oldPermission: Permission,
  permission: Permission,
): Promise<User> => {
  try {
      let newPermission;
      let permissionAction;

      switch (permission) {
          case Permission.Agent:
              if(oldPermission == Permission.Supervisor){
                  permissionAction = PermissionSetType.Clear;
                  newPermission = Permission.ApproveTrade;
              }
              else if(oldPermission == Permission.Employee){
                  permissionAction = PermissionSetType.Set;
                  newPermission = Permission.Trade;
              }
              break;

          case Permission.Supervisor:
              if(oldPermission == Permission.Agent){
                  permissionAction = PermissionSetType.Set;
                  newPermission = Permission.ApproveTrade;
              }
              else if(oldPermission == Permission.Employee){
                  permissionAction = PermissionSetType.Set;
                  newPermission = Permission.ApproveTrade;
                  await api_bank_user.put(`/users/${id}/permission`,
                      {permission: Permission.Trade, type: PermissionSetType.Set}
                  );
              }
              break;

          case Permission.Employee:
              if(oldPermission == Permission.Agent){
                  permissionAction = PermissionSetType.Clear;
                  newPermission = Permission.Trade;
              }
              else if(oldPermission == Permission.Supervisor){
                  permissionAction = PermissionSetType.Clear;
                  newPermission = Permission.ApproveTrade;
                  await api_bank_user.put(`/users/${id}/permission`,
                      {permission: Permission.Trade, type: PermissionSetType.Clear}
                  );
              }
              break;
      }

      const response = await api_bank_user.put(`/users/${id}/permission`,
          {permission: newPermission, type: permissionAction}
      );

    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch actuary data:", error);
    throw error;
  }
};


/*
export const getActuaryByEmployeeId = async (
  employeeId: string
): Promise<Actuary> => {
  try {
    const response = await api_bank_user.get<Actuary>(
      `${API_BASE}/actuary/employee/${employeeId}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch actuary data:", error);
    throw error;
  }
};
*/
