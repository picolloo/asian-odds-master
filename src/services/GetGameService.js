import Logger from "../logger";

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
    const sportId = await AsianOdds.getSportId("Football");

    const feeds = await AsianOdds.getFeeds(activeBookies, oddTypes, sportId);

    const teamNames = getTeamNames({ feeds });

    const TextSearcher = TextSearch(teamNames);
    const teamName =
      (await TextSearcher.find(betTeamName)) ||
      (await TextSearcher.find(counterTeamName));

    if (!teamName) {
      throw `Game for ${betTeamName} vs ${counterTeamName} not found.`;
    }

    const game = getGameByTeamName({
      teamName,
      feeds,
      fulltimeFavoured,
      teamFactor,
    });

    if (!game) {
      throw `Game for ${betTeamName} vs ${counterTeamName} not found.`;
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

    return game;
  }

  return {
    execute,
  };
}

export default GetGameService;
