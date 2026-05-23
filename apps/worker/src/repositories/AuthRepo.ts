import AuthDAL from "@/data-access-layer/AuthDAL";
import * as Schemas from "@scaffold/schemas";

export default class AuthRepo {
  private dal: AuthDAL;

  constructor(env: Env) {
    this.dal = new AuthDAL(env);
  }

  async syncClerkUser(params: Schemas.SyncClerkUserApiRequest) {
    return await this.dal.upsertUser(params);
  }
}
