import axios from "axios";
import knex from "../database";
import Logger from "../logger";
import Store from "../redis";
import { TEAM } from "../utils/constants";

const login = async () => {
  const { data: loginData } = await axios.get(
    `${process.env.ASIAN_ODDS_URL}/Login?username=${process.env.ASIAN_ODDS_USER}&password=${process.env.ASIAN_ODDS_PWD}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if (loginData.Code === -1) {
    throw new Error(`AsianOdds login error: ${loginData.Result.TextMessage}`);
  }

  Logger.log("info", "Logged into AsianOdds.");

  const {
    Token: token,
    Url: url,
    Key: key,
    Username: username,
  } = loginData.Result;

  const { data: registerData } = await axios.get(
    `${url}/Register?username=${username}`,
    {
      headers: {
        AOToken: token,
        AOKey: key,
        Accept: "application/json",
      },
    }
  );

  if (registerData.Code === -1) {
    throw new Error(
      `AsianOdds register error: ${loginData.Result.TextMessage}`
    );
  }

  Logger.log("info", "Register into AsianOdds.");

  return {
    token,
    url,
  };
};

const isLoggedIn = async () => {
  if (!(await Store.get("AOUrl")) || !(await Store.get("AOToken")))
    return false;

  const { data } = await axios.get(
    `${await Store.get("AOUrl")}/IsLoggedIn?username=${
      process.env.ASIAN_ODDS_USER
    }`,
    {
      headers: {
        accept: "application/json",
        AOToken: await Store.get("AOToken"),
      },
    }
  );

  return data.Result.SuccessfulLogin;
};

const getUserInformation = async () => {
  const { data } = await axios.get(
    `${await Store.get("AOUrl")}/GetUserInformation`,
    {
      headers: {
        accept: "application/json",
        AOToken: await Store.get("AOToken"),
      },
    }
  );

  if (data.Code === -1) {
    throw new Error(
      `AsianOdds error getUserInformation: ${data.Result.TextMessage}`
    );
  }

  const { ActiveBookies, DefaultStake, OddsType } = data.Result;

  return {
    activeBookies: ActiveBookies,
    defaultStake: DefaultStake,
    oddTypes: OddsType,
  };
};

const getSportId = async (sportName) => {
  const { data } = await axios.get(`${await Store.get("AOUrl")}/GetSports`, {
    headers: {
      AOToken: await Store.get("AOToken"),
      accept: "application/json",
    },
  });

  if (data.Code === -1 || !data.Data) {
    throw new Error(`AsianOdds error getLeagues: ${data.Result.TextMessage}`);
  }

  const sport = data.Data.find(
    (sport) => sportName.toUpperCase() === sport.Name.toUpperCase()
  );

  if (!sport) {
    throw new Error(
      `AsianOdds error getLeagues: league with name ${sportName} not found.`
    );
  }

  return sport.Id;
};

const getFeeds = async (activeBookies, oddsType, sportId) => {
  const { data } = await axios.get(`${await Store.get("AOUrl")}/GetFeeds`, {
    headers: {
      accept: "application/json",
      AOToken: await Store.get("AOToken"),
    },
    params: {
      bookies: activeBookies,
      oddsFormat: oddsType,
      sportsType: sportId,
      marketTypeId: 0,
    },
  });

  if (data.Code === -1) {
    throw new Error(`AsianOdds error getFeeds: ${data.Result.TextMessage}`);
  }

  const [football] = data.Result.Sports;

  return football.MatchGames.filter((game) => {
    const excludedLeagueMatch = /((No\. of)|EFOOTBALL)/gim.test(
      game.LeagueName
    );

    return !excludedLeagueMatch;
  }).map((game) => ({
    id: game.GameId,
    guestTeam: {
      name: game.AwayTeam.Name,
      redCards: game.AwayTeam.RedCards,
      score: game.AwayTeam.Score,
    },
    homeTeam: {
      name: game.HomeTeam.Name,
      redCards: game.HomeTeam.RedCards,
      score: game.HomeTeam.Score,
    },
    fulltimeFavoured: game.FullTimeFavoured,
    handicap: game.FullTimeHdp.Handicap,
    bookieOdds: game.FullTimeHdp.BookieOdds,
  }));
};

const placeBet = async (
  gameId,
  defaultStake,
  bookTypes,
  teamType,
  notificationId
) => {
  const { data } = await axios({
    method: "post",
    url: `${await Store.get("AOUrl")}/placebet`,
    headers: {
      AOToken: await Store.get("AOToken"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      GameId: gameId,
      GameType: "H",
      IsFullTime: 1,
      MarketTypeId: 0,
      OddsFormat: "00",
      //    OddsFormat: oddsType, //When the real user is used from getUserInformation
      OddsName: teamType === TEAM.HOME ? "HomeOdds" : "AwayOdds",
      SportsType: 1, // TODO get sportId
      Amount: defaultStake,

      PlaceBetId: notificationId,
      AcceptChangedOdds: 1,
      BookieOdds: bookTypes,
    }),
  });

  if (data.Code < 0) {
    if (data.Code === -1307) {
      return data.Result;
    }
    
    await knex("notifications").where({ id: notificationId }).del();
    
    throw new Error(
      `AsianOdds error code: ${data.Code} on placeBet: ${data.Message}`
    );
    
  }
  return data.Result;
};

export default {
  login,
  isLoggedIn,
  getUserInformation,
  getSportId,
  getFeeds,
  placeBet,
};
