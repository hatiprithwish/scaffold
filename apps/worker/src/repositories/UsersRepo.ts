import UsersDAL from "@/data-access-layer/UsersDAL";
import * as Schemas from "@scaffold/schemas";

export default class UsersRepo {
  private dal: UsersDAL;

  constructor(env: Env) {
    this.dal = new UsersDAL(env);
  }

  async syncClerkUser(params: Schemas.SyncClerkUserApiRequest) {
    return await this.dal.upsertUser(params);
  }

  async getUserDetails(params: { clerkId: string }) {
    return await this.dal.getUserDetails({
      clerkId: params.clerkId,
    });
  }

  async updateUser(params: Schemas.UpdateUserApiRequest & { clerkId: string }) {
    return await this.dal.updateUser({ ...params, clerkId: params.clerkId });
  }
}
