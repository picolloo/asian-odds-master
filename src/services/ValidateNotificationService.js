import { IdentifierRole } from "sucrase/dist/parser/tokenizer";
import database from "../database";
import Logger from "../logger";
import { NOTIFICATION_DETAILS } from "../utils/constants.js";

function ValidateNotificationService() {
  async function execute({
    id,
    name,
    type,
    odds,
    gameStatus,
    homeName,
    guestName,
    teamFactorRange,
    gameDuration,
    currentGameDuration,
  }) {
    
    global.globalnotificationId = id;
    
    const invalidNotificationName = validateNotificationNames(
      name,
      homeName,
      guestName
    );

    if (!invalidNotificationName) {
      Logger.log("info", `Notification: ${id} for female or friendly league not handled.`);
      return false;
    }

    if (!odds || !odds.aft || type !== 1 || gameStatus >= 5) {
      Logger.log("info", `Notification: ${id} not handled.`);
      return false;
    }

    const notificationFound = await database("notifications").where({ id });

    if (notificationFound.length) {
      Logger.log("info", `Notification: ${id} already handled.`);
      return false;
    }

    const teamFactorLimit = getTeamFactorLimit(
      teamFactorRange,
      Number(odds.aft.teamFactor)
    );

    if (!validateTeamFactorRange(odds.aft.teamFactor, teamFactorLimit)) {
      await database("notifications").insert({
        id,
        name,
        teamFactor: odds.aft.teamFactor,
        homePrice: odds.aft.homePrice,
        guestPrice: odds.aft.guestPrice,
      });

      Logger.log("info", `Notification: ${id} with team factor off range ${odds.aft.teamFactor}/${teamFactorLimit.min}/${teamFactorLimit.max}.`);
      return;
    }

    const invalidNotificationtime = validateNotificationTime(
      currentGameDuration,
      gameDuration
      );
  
      if (!invalidNotificationtime) {
        Logger.log("info", `Notification: ${id} already handled.`);
      return false;
    }

    const betFound = database("bets").where({ notificationId: id });

    if (betFound.length) {
      Logger.log("info", `Bet with Notifcation ID: ${id} already made.`);
      return false;
    }

    await database("notifications").insert({
      id,
      name,
      teamFactor: odds.aft.teamFactor,
      homePrice: odds.aft.homePrice,
      guestPrice: odds.aft.guestPrice,
    });

    Logger.log("info", `Notification: ${id} validated successfully.`);

    return true;
  }

  function getTeamFactorLimit(teamFactorRange, teamFactor) {
    if (!teamFactorRange)
      return {
        min: teamFactor < 0 ? teamFactor * -1 : teamFactor,
        max: teamFactor > 0 ? teamFactor : teamFactor * -1,
      };

    if (!teamFactorRange)
      return {
        min: teamFactor < 0 ? teamFactor * -1 : teamFactor,
        max: teamFactor > 0 ? teamFactor : teamFactor * -1,
      };

    return {
      min: teamFactorRange * -1,
      max: teamFactorRange,
    };
  }

  function validateTeamFactorRange(teamFactor, teamFactorLimit) {
    const minFactor = teamFactor < 0 ? teamFactor : teamFactor * -1;
    const maxFactor = teamFactor > 0 ? teamFactor : teamFactor * -1;

    return minFactor >= teamFactorLimit.min && maxFactor <= teamFactorLimit.max;
  }

  function validateNotificationNames(...names) {
    return !names.some((name) => /(women|friendl)/gim.test(name));
  }

  function validateNotificationTime(currentGameDuration, gameDuration) {
    
    const maxTime = NOTIFICATION_DETAILS.TIME;
    const [gameDurationMinutes,gameDurationseconds] = gameDuration.split(":");
    const [currentgameDurationMinutes,currentgameDurationseconds] = currentGameDuration.split(":");
    
    const minutes = Math.abs(gameDurationMinutes - currentgameDurationMinutes);
    
    if (gameDuration == "45:00" || gameDuration == "90:00" ){
    return false;
    }   

    return maxTime >= minutes;
    }

  return {
    execute,
  };
}

export default ValidateNotificationService;
