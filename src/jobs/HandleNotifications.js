import axios from "axios";
import Logger from "../logger";

import Queue from "../worker";
import { parseStatiscsResponse } from "../utils/parser";
import { ValidateNotificationService, GetBetTeamService } from "../services";

export default {
  key: "HandleNotifications",
  async handle() {
    const { data } = await axios.get(process.env.STATISCS_URL);

    if (data.error) {
      return Logger.log(
        "error",
        "Error trying to get notification from Statistics Sports"
      );
    }

    const statisticsResponse = parseStatiscsResponse(data);

    const validatedNotifications = await Promise.allSettled(
      statisticsResponse.notifications.map(
        async ({
          id,
          name,
          type,
          odds,
          homeTeamStats,
          guestTeamStats,
          teamFactorRange,
        }) => {
          const validated = await ValidateNotificationService().execute({
            id,
            name,
            type,
            odds,
            homeName: homeTeamStats.name,
            guestName: guestTeamStats.name,
            teamFactorRange,
          });

          if (validated) {
            const {
              betTeamName,
              counterTeamName,
              type: teamType,
              fulltimeFavoured,
              teamFactor,
            } = await GetBetTeamService().execute({
              name,
              odds: odds.aft,
              homeTeamStats,
              guestTeamStats,
            });

            return {
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
            };
          }
        }
      )
    );

    await Promise.all(
      validatedNotifications.map((result) => {
        if (result.status === "fulfilled" && result.value) {
          return Queue.add("HandleBet", result.value);
          // return Queue.add("HandleBet", result.value, {
          //   attempts: 3,
          //   backoff: 5000,
          // });
        }
      })
    );
  },
  options: {
    limiter: {
      max: 1,
    },
  },
};
