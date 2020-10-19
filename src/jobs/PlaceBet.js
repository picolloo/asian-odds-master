import { PlaceBetService } from "../services";

export default {
  key: "PlaceBet",
  async handle({
    data: {
      gameId,
      defaultStake,
      bookTypes,
      teamName,
      notificationId,
      teamType,
    },
  }) {
    return PlaceBetService().execute({
      gameId,
      defaultStake,
      bookTypes,
      teamName,
      notificationId,
      teamType,
    });
  },
};
