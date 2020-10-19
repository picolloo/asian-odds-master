import knex from "../database";
import Logger from "../logger";

import { TEAM } from "../utils/constants";
import { AsianOdds } from "../libs";

function PlaceBetService() {
  async function execute({
    gameId,
    defaultStake,
    bookTypes,
    teamName,
    notificationId,
    teamType,
  }) {
    Logger.log(
      "info",
      `Placing bet with these parameters: ${JSON.stringify({
        GameId: gameId,
        GameType: "H",
        IsFullTime: 1,
        MarketTypeId: 0,
        OddsFormat: "00",
        OddsName: teamType === TEAM.HOME ? "HomeOdds" : "AwayOdds",
        SportsType: 1,
        Amount: defaultStake,
        PlaceBetId: notificationId,
        AcceptChangedOdds: 1,
        BookieOdds: bookTypes,
      })}`
    );

    const bet = await AsianOdds.placeBet(
      gameId,
      defaultStake,
      bookTypes,
      teamType,
      notificationId
    );

    if (!bet.BetPlacementReference) {
      Logger.log(
        "error",
        `Unable to place bet, AsianOdds return null BetPlacementReference. Deleting notification ID: ${notificationId}`
      );

      await knex("notifications").where({ id: notificationId }).del();

      return;
    }

    Logger.log(
      "info",
      `Bet placed on ${teamName} for ${defaultStake}. Reference: ${bet.BetPlacementReference}`
    );

    await knex("notifications")
      .where({ id: notificationId })
      .update({ placedBet: true });

    await knex("bets").insert({
      team: teamName,
      price: defaultStake,
      notificationId,
      // retries,
      reference: bet.BetPlacementReference,
    });
  }

  return {
    execute,
  };
}

export default PlaceBetService;