import { TEAM } from "../utils/constants.js";

function GetBetTeamService() {
  function execute({
    name,
    odds: { teamFactor },
    homeTeamStats,
    guestTeamStats,
  }) {
    const dogRgx = /dog/i;

    const team = dogRgx.test(name)
      ? getBetTeamDogNotification(teamFactor, homeTeamStats, guestTeamStats)
      : getBetTeamGeneralNotification(
          teamFactor,
          homeTeamStats,
          guestTeamStats
        );

    if (team) return team;

    return homeTeamStats.corners > guestTeamStats.corners
      ? {
          betTeamName: homeTeamStats.name,
          counterTeamName: guestTeamStats.name,
          type: TEAM.HOME,
          fulltimeFavoured: 0,
          teamFactor,
        }
      : {
          betTeamName: guestTeamStats.name,
          counterTeamName: homeTeamStats.name,
          type: TEAM.GUEST,
          fulltimeFavoured: 0,
          teamFactor,
        };
  }

  function getBetTeamGeneralNotification(
    teamFactor,
    homeTeamStats,
    guestTeamStats
  ) {
    if (teamFactor > 0)
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 2,
        teamFactor: teamFactor * -1,
      };
    if (teamFactor < 0)
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 1,
        teamFactor,
      };
  }

  function getBetTeamDogNotification(
    teamFactor,
    homeTeamStats,
    guestTeamStats
  ) {
    if (teamFactor > 0)
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 2,
        teamFactor,
      };
    if (teamFactor < 0)
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 1,
        teamFactor: teamFactor * -1,
      };
  }

  return {
    execute,
  };
}

export default GetBetTeamService;