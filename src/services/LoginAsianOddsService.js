import Store from "../redis";

import { AsianOdds } from "../libs";

function LoginAsianOddsService() {
  async function execute() {
    if (!(await AsianOdds.isLoggedIn())) {
      const { token, url } = await AsianOdds.login();
      Store.set("AOToken", token);
      Store.set("AOUrl", url);
    }
  }

  return {
    execute,
  };
}

export default LoginAsianOddsService;
