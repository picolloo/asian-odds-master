# Asian Odds BOT

- [x] Odds only **aft**/gft (team factor | valor da aposta home | valor da aposta guest)

  - Valor da aposta -0,10

  | TeamFactor | Home | Guest |
  | ---------- | ---- | ----- |
  | -1         | 1.98 | 1.82  |

  > "aft": "-4|1.98|1.82" "gft": "5.75|1.95|1.85"

  ```javascript
  const limit = /\(\d\)$/gi

  if (!name.includes("Dog")) {
    if ((limit && -limit > x > limit) || !limit) {
      x < 0 => home;
      x > 0 => guest;
      x == 0 => homeTeamStats.corners > guestTeamStats.corners ? home : guest
    }
  } else {
    if ((limit && -limit > x > limit) || !limit) {
      x < 0 => guest;
      x > 0 => home;
      x == 0 => homeTeamStats.corners > guestTeamStats.corners ? home : guest
    }
  }
  ```


//export const PRICE = Object.freeze({
//  MINIMUN: "1.70",
//  });

//let aBookTypes = finalbookTypes.split(':');
//aBookTypes[1] = PRICE.MINIMUN;
//const finalbookTypes = aBookTypes.join(':')

([+-]?(?:'.+?'|".+?"|[^+\- ]{1}[^ ]*))


return football.MatchGames.filter((game) => {

    const teamRgx = /U19|U20|U21|U23/i;

    const team = dogRgx.test(name)
      ? getBetTeamDogNotification(teamFactor, homeTeamStats, guestTeamStats)
      : getBetTeamGeneralNotification(
          teamFactor,
          homeTeamStats,
          guestTeamStats
        );
    const excludedLeagueMatch = /((No\. of)|EFOOTBALL)/gim.test(
      game.LeagueName,
      
    );

    const excludedTeamMatch = /((U20)|U21|U23|U19)/gim.test(
      game.AwayTeam.Name,
      game.HomeTeam.Name,
      
    );

    return !excludedLeagueMatch && !excludedTeamMatch;



- [x] Notification schema (Only type 1)

  - ID (Statistics notification ID)
  - OddType (aft/gtf)
  - TeamFactor
  - HomePrice
  - GuestPrice
  - PlacedBet

- [x] Bet schema

  - ID (Asian Odds Bet ID)
  - Retries
  - Team (Home/Guest)
  - Price
  - NotificationID

- [x] Mapping name between Statistics and AsianOdds

  - [X] Find by guest or home team name
  - [X] Remove name parts with 3 or less chars | partial search

- [x] Retry place a bet 3 times in AsianOdds
- [ ] Retry to login on unauthorized

- [X] BookieTypes to to placebet: SBO=1.650,2.030;ISN=1.650,2.090;BEST=ISN 1.650,ISN 2.090

- [X] Place bet

- [ ] BookieTypes hierarchy
- [X] Monorepo worker
- [ ] Retry register
- [ ] How to deploy

## ROADMAP

- [x] Logging
- [ ] Rest API


    const invalidNotificationtime = validateNotificationTime(
    currentGameDuration,
    gameDuration
    );

    if (!invalidNotificationtime) {
    Logger.log("info", `Notification: ${id} not handled.`);
    return false;
    }


    function validateNotificationTime(currentGameDuration, gameDuration) {
    
  const maxTime = 3;
  const fakeDate = "1/1/1970 ";
  const newcurrentGameDuration = "01:"+currentGameDuration;
  const newgameDuration = "01:"+gameDuration;
  console.log(newcurrentGameDuration);
  console.log(newgameDuration);

  const difference = new Date(new Date(fakeDate+newgameDuration) - new Date(fakeDate+newcurrentGameDuration)).toUTCString().split(" ")[4];
  const [hours,minutes,seconds] = difference.split(":");
    
  return maxTime >= minutes;
  }
