import { TEAM } from "../utils/constants.js";

function GetBetTeamService() {
  function execute({
    name,
    odds: { teamFactor },
    homeTeamStats,
    guestTeamStats,
  }) {
    const dogRgx = /dog/i;
    global.globalhteamName = homeTeamStats.name;

    const team = dogRgx.test(name)
      ? getBetTeamDogNotification(teamFactor, homeTeamStats, guestTeamStats)
      : getBetTeamGeneralNotification(
          teamFactor,
          homeTeamStats,
          guestTeamStats
        );

    if (team) return team;

    return homeTeamStats.shotsOnTarget >= guestTeamStats.shotsOnTarget
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

     // EQUIPA DE FORA A GANHAR / 0 CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor != 0) && (homeTeamStats.redCards === guestTeamStats.redCards))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 2,
        teamFactor: teamFactor * -1,
      };
      
      // EQUIPA DE CASA A GANHAR / 0 CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor != 0) && (homeTeamStats.redCards === guestTeamStats.redCards))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 1,
        teamFactor,
      };

      // EQUIPA DE FORA A GANHAR / 0 CARTOES / LINHAS == 0

    if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards === guestTeamStats.redCards))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 0,
        teamFactor,
      };
      
      // EQUIPA DE CASA A GANHAR / 0 CARTOES / LINHAS == 0

    if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards === guestTeamStats.redCards))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 0,
        teamFactor,
      };

      // EQUIPA DE FORA A GANHAR / EQUIPA DE FORA + CARTOES / LINHAS <> 0

      if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor != 0) && (homeTeamStats.redCards < guestTeamStats.redCards))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 1,
        teamFactor: teamFactor,
      };
      
      // EQUIPA DE CASA A GANHAR / EQUIPA DE CASA + CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor != 0) && (homeTeamStats.redCards > guestTeamStats.redCards))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 2,
        teamFactor: teamFactor * -1,
      };

      // EQUIPA DE FORA A GANHAR / EQUIPA DE FORA + CARTOES / LINHAS == 0
      
      if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards < guestTeamStats.redCards))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 0,
        teamFactor,
      };
      
      // EQUIPA DE CASA A GANHAR / EQUIPA DE CASA + CARTOES / LINHAS == 0

    if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards > guestTeamStats.redCards))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 0,
        teamFactor,
      };

      // EQUIPA DE FORA A GANHAR / EQUIPA DE FORA - CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor != 0) && (homeTeamStats.redCards > guestTeamStats.redCards))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 2,
        teamFactor: teamFactor * -1,
      };
 
      // EQUIPA DE CASA A GANHAR / EQUIPA DE CASA - CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor != 0) && (homeTeamStats.redCards < guestTeamStats.redCards))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 1,
        teamFactor,
      };

    // EQUIPA DE FORA A GANHAR / EQUIPA DE FORA - CARTOES / LINHAS == 0

    if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards > guestTeamStats.redCards))
    return {
      betTeamName: homeTeamStats.name,
      counterTeamName: guestTeamStats.name,
      type: TEAM.HOME,
      fulltimeFavoured: 0,
      teamFactor,
    };

    // EQUIPA DE CASA A GANHAR / EQUIPA DE CASA - CARTOES / LINHAS == 0

  if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards < guestTeamStats.redCards))
    return {
      betTeamName: guestTeamStats.name,
      counterTeamName: homeTeamStats.name,
      type: TEAM.GUEST,
      fulltimeFavoured: 0,
      teamFactor,
    };

      // EQUIPA DE FORA A GANHAR / CARTOES 0 / LINHAS = 0

      if ((guestTeamStats.goals > homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards === guestTeamStats.redCards))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 0,
        teamFactor,
      };
    
      // EQUIPA DE CASA A GANHAR / CARTOES 0 / LINHAS = 0

    if ((guestTeamStats.goals < homeTeamStats.goals) && (teamFactor == 0) && (homeTeamStats.redCards === guestTeamStats.redCards))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 0,
        teamFactor,
      };

      // EMPATADO /  EQUIPA DE CASA + CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals === homeTeamStats.goals) && (homeTeamStats.redCards > guestTeamStats.redCards) && (teamFactor != 0))
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 2,
        teamFactor: teamFactor * -1,
      };
    

      // EMPATADO /  EQUIPA DE FORA + CARTOES / LINHAS <> 0

    if ((guestTeamStats.goals === homeTeamStats.goals) && (guestTeamStats.redCards > homeTeamStats.redCards) && (teamFactor != 0))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 1,
        teamFactor: teamFactor,
      };

      // EMPATADO /  EQUIPA DE CASA + CARTOES / LINHAS == 0

      if ((guestTeamStats.goals === homeTeamStats.goals) && (homeTeamStats.redCards > guestTeamStats.redCards) && (teamFactor == 0))
      return {

        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 0,
        teamFactor,

      };
    
     // EMPATADO /  EQUIPA DE FORA + CARTOES / LINHAS == 0 

    if ((guestTeamStats.goals === homeTeamStats.goals) && (guestTeamStats.redCards > homeTeamStats.redCards) && (teamFactor == 0))
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 0,
        teamFactor,
      };

      // JOGO EMPATADO /  0 CARTOES / LINHA POSITIVA 

      if ((guestTeamStats.goals === homeTeamStats.goals) && (guestTeamStats.redCards === homeTeamStats.redCards) && teamFactor > 0 )
      return {
        betTeamName: homeTeamStats.name,
        counterTeamName: guestTeamStats.name,
        type: TEAM.HOME,
        fulltimeFavoured: 2,
        teamFactor: teamFactor * -1,
      };
      
      // JOGO EMPATADO /  0 CARTOES / LINHA NEGATIVA 

    if ((guestTeamStats.goals === homeTeamStats.goals) && (guestTeamStats.redCards === homeTeamStats.redCards) && teamFactor < 0 )
      return {
        betTeamName: guestTeamStats.name,
        counterTeamName: homeTeamStats.name,
        type: TEAM.GUEST,
        fulltimeFavoured: 1,
        teamFactor,
      };

    }

  return {
    execute,
  };
}

export default GetBetTeamService;
