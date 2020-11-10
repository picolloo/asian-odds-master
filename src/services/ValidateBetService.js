import knex from "../database";
import Logger from "../logger";

import { AsianOdds } from "../libs";

function ValidateBetService() {
  async function execute({
    notificationId,
  }) {
    Logger.log(
      "info",
      `Search bet at Asian Odds for Reference: WA-${notificationId}`
    );

    const BetByReference = await AsianOdds.ValidateBet(
      notificationId
    );

    if (BetByReference.Code < 0) {
      Logger.log(
        "error",
        `Bet confirmed by Asian Odds, but the bet doesn't exist. Deleting notification ID: ${notificationId}`
      );

      //await knex("bets").where({ notificationId: notificationId, id: notificationId }).del();
      //await knex("notifications").where({ id: notificationId }).del();
      return;
    }  
  
    Logger.log(
      "info",
      `Bet confirmed at Asian Odds for Reference: WA-${notificationId}`
    );
  }

  return {
    execute,
  };
}


export default ValidateBetService;
