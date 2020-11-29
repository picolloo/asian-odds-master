import Logger from "../logger";

import knex from "../database";
import { AsianOdds, TextSearch } from "../libs";
import { HANDICAP } from "../utils/constants";

function GetGameService() {
  async function execute({
    betTeamName,
    counterTeamName,
    activeBookies,
    oddTypes,
    fulltimeFavoured,
    teamFactor,
  }) {
    
    const notificationDel = global.globalnotificationId;

    const sportId = await AsianOdds.getSportId("Football");

    const feeds = await AsianOdds.getFeeds(activeBookies, oddTypes, sportId);

    const teamNames = getTeamNames({ feeds });

    const TextSearcher = TextSearch(teamNames);
    const teamName =
      (await TextSearcher.find(betTeamName)) ||
      (await TextSearcher.find(counterTeamName));

    if (!teamName) {
      throw `Game for ${betTeamName} vs ${counterTeamName} not found.`,
      await knex("notifications").where({ id: notificationDel }).del();
    }

    const game = getGameByTeamName({
      teamName,
      feeds,
      fulltimeFavoured,
      teamFactor,
    });

    if (!game) {
      throw `Game for ${betTeamName} vs ${counterTeamName} not found.`,
      await knex("notifications").where({ id: notificationDel }).del();
    }

    Logger.log(
      "info",
      `Game for ${betTeamName} vs ${counterTeamName} successfuly found. GameID: ${game.id}`
    );

    return game;
  }

  function getTeamNames({ feeds }) {
    const names = feeds.reduce(
      (names, feed) => [...names, feed.homeTeam.name, feed.guestTeam.name],
      []
    );

    return [...new Set(names.flat())];
  }

  function getGameByTeamName({
    teamName,
    feeds,
    fulltimeFavoured,
    teamFactor,
  }) {
    const game = feeds.find(
      (feed) =>
        (feed.homeTeam.name === teamName || feed.guestTeam.name === teamName) &&
        feed.fulltimeFavoured == fulltimeFavoured &&
        HANDICAP[teamFactor] == feed.handicap
        
    );
    
    Logger.log(
      "info",
      `Search for ${teamName}, Favourite: ${fulltimeFavoured}, Statistics line: ${teamFactor} and AsianOdds line: ${HANDICAP[teamFactor]}. `
    );
      return game;
  }

  return {
    execute,
  };
}

export default GetGameService;
