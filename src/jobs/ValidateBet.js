import { ValidateBetService } from "../services";


export default {
  key: "ValidateBet",
  async handle({
    data: {
      notificationId,
    },
  }) {

    return ValidateBetService().execute({
      notificationId,
    });
  },
};
