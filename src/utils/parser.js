import Logger from "../logger";

export function parseStatiscsResponse({
  u: userKey,
  ec: error,
  lp: limitedPermissions,
  n: rawNotifications,
}) {
  const notifications = rawNotifications.map(parseNotificationObject);

  return {
    userKey,
    error,
    limitedPermissions,
    notifications,
  };
}

function parseNotificationObject(notification) {
  const {
    i: id,
    g: gameId,
    t: gameDuration,
    n: name,
    p: type = 1, // 1 = normal notifications
    l: league,
    c: countryName,
    s: gameStatus, // 5 = finished, < 5 = game is in live
    o: odds,
    cd: receivedAt,
    nd: { t: currentGameDuration, h: homeTeamStats, a: guestTeamStats },
  } = notification;

  const teamFactorRegex = /\((\d+(\.\d*)?)\)/;

  let match = teamFactorRegex.exec(name) || [];
  const [, teamFactorRangeMatch] = match;

  let match2 = teamFactorRegex.exec(name) || [];
  const [, teamFactorRangeMatch2] = match2;

  const goalModifierRegex = /\{(\d+)\/(\d+(\.\d+)?)\}/g;
  const goalModifier2Regex = /\|(\d+)\/(\d+(\.\d+)?)\|/g;
  
  match = goalModifierRegex.exec(name) || [];
  match2 = goalModifier2Regex.exec(name) || [];
  
  const [, goalModifier, teamFactorModifier] = match;
  const [, goalModifier2, teamFactorModifier2] = match2;
  
  const parsedHomeTeamStats = parseTeamStats(homeTeamStats);
  const parsedGuestTeamStats = parseTeamStats(guestTeamStats);

  const teamFactorRange = getTeamFactorRange(
    parsedHomeTeamStats.goals,
    parsedGuestTeamStats.goals,
    goalModifier,
    parseFloat(teamFactorModifier),
    goalModifier2,
    parseFloat(teamFactorModifier2)
  );

  if (teamFactorRange && gameStatus < 5) {
    Logger.log(
      "info",
      `TeamFactorRange changed from ${teamFactorRangeMatch} to ${teamFactorRange} on notification ${id}`
    );
  }

  return {
    id,
    gameId,
    gameDuration,
    name,
    teamFactorRange: teamFactorRange || teamFactorRangeMatch ,
    type,
    league,
    countryName,
    gameStatus,
    odds: parseOdds(odds),
    receivedAt,
    currentGameDuration,
    homeTeamStats: parsedHomeTeamStats,
    guestTeamStats: parsedGuestTeamStats,
  };
}

function parseOdds(odds) {
  if (odds instanceof Array) {
    return null;
  }

  const { aft, gft } = odds;

  const [aftTeamFactor, aftHomePrice, aftGuestPrice] = aft.split("|");
  const [gftTeamFactor, gftHomePrice, gftGuestPrice] = gft.split("|");

  return {
    aft: {
      teamFactor: parseFloat(aftTeamFactor),
      homePrice: parseFloat(aftHomePrice),
      guestPrice: parseFloat(aftGuestPrice),
    },
    gft: {
      teamFactor: parseFloat(gftTeamFactor),
      homePrice: parseFloat(gftHomePrice),
      guestPrice: parseFloat(gftGuestPrice),
    },
  };
}

function parseTeamStats(teamStats) {
  const {
    n: name,
    c: corners,
    y: yellowCards,
    r: redCards,
    g: goals,
    t: shotsOnTarget,
    o: shotsOffTarget,
    m: totalShots,
    a: attacks,
    d: dangerousAttacks,
  } = teamStats;

  return {
    name,
    corners: parseInt(corners),
    yellowCards: parseInt(yellowCards),
    redCards: parseInt(redCards),
    goals: parseInt(goals),
    shotsOnTarget: parseInt(shotsOnTarget),
    shotsOffTarget: parseInt(shotsOffTarget),
    totalShots: parseInt(totalShots),
    attacks: parseInt(attacks),
    dangerousAttacks: parseInt(dangerousAttacks),
  };
}

function getTeamFactorRange(
  homeGoals,
  guestGoals,
  goalDiffLimit,
  teamFactorModifier,
  goalDiffLimit2,
  teamFactorModifier2
) {

  if ((Math.abs(homeGoals - guestGoals) >= goalDiffLimit2) && (Math.abs(homeGoals - guestGoals) < goalDiffLimit) ) {
    
    return teamFactorModifier2;

  } else if (Math.abs(homeGoals - guestGoals) >= goalDiffLimit) {
    
    return teamFactorModifier;
  
  } else {
    //  block of code to be executed if the condition1 is false and condition2 is false
  }

}