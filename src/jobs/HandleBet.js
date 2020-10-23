import Logger from "../logger";

import Queue from "../worker";
import { AsianOdds } from "../libs";
import { LoginAsianOddsService, GetGameService } from "../services";
import { BOOK_TYPES_HIERARCHY, BET_DETAILS } from "../utils/constants";

export default {
  key: "HandleBet",
  async handle({
    data: {
      notification: {
        id,
        betTeamName,
        counterTeamName,
        fulltimeFavoured,
        teamFactor,
        teamType,
        homeTeamStats,
        guestTeamStats,
      },
    },
  }) {
    await LoginAsianOddsService().execute();

    const {
      activeBookies,
      oddTypes,
      defaultStake,
    } = await AsianOdds.getUserInformation();

    const game = await GetGameService().execute({
      betTeamName,
      counterTeamName,
      activeBookies,
      oddTypes,
      fulltimeFavoured,
      teamFactor,
    });

    if (
      !validateGoals(
        homeTeamStats,
        guestTeamStats,
        game.homeTeam,
        game.guestTeam
      ) ||
      !validateRedCards(
        homeTeamStats,
        guestTeamStats,
        game.homeTeam,
        game.guestTeam
      )
    )
      return;

    if (game) {
      const bookTypes = getBookTypes(game.bookieOdds);

      if (!bookTypes) {
        throw new Error(`BookType not found: ${game.bookieOdds}`);
      }
      let aBookTypes = bookTypes.split(':');
      aBookTypes[1] = BET_DETAILS.PRICE;
      const finalbookTypes = aBookTypes.join(':')

      await Queue.add("PlaceBet", {
        gameId: game.id,
        defaultStake: BET_DETAILS.STAKE, //TODO get from userInformation
        bookTypes:finalbookTypes,
        teamName: betTeamName,
        notificationId: id,
        teamType,
      });
    }
  },
};

function getBookTypes(oddTypes) {
  const tokens = oddTypes.split(/,|;/);

  for (let book of BOOK_TYPES_HIERARCHY) {
    const token = tokens.find((token) => token.includes(book));
    if (token) return token.replace("=", ":");
  }
}

function validateGoals(homeTeamStats, guestTeamStats, homeTeam, guestTeam) {
  if (
    homeTeam.score != homeTeamStats.goals ||
    guestTeam.score != guestTeamStats.goals
  ) {
    Logger.log(
      "error",
      `Differente game score: ${JSON.stringify({
        statistics: {
          [homeTeamStats.name]: homeTeamStats.goals,
          [guestTeamStats.name]: guestTeamStats.goals,
        },
        asianOdds: {
          [homeTeam.name]: homeTeam.score,
          [guestTeam.name]: guestTeam.score,
        },
      })} `
    );
    return false;
  }
  return true;
}

function validateRedCards(homeTeamStats, guestTeamStats, homeTeam, guestTeam) {
  if (
    homeTeam.redCards != homeTeamStats.redCards ||
    guestTeam.redCards != guestTeamStats.redCards
  ) {
    Logger.log(
      "error",
      `Differente game redCards: ${JSON.stringify({
        statistics: {
          [homeTeamStats.name]: homeTeamStats.redCards,
          [guestTeamStats.name]: guestTeamStats.redCards,
        },
        asianOdds: {
          [homeTeam.name]: homeTeam.redCards,
          [guestTeam.name]: guestTeam.redCards,
        },
      })} `
    );
    return false;
  }
  return true;
}
