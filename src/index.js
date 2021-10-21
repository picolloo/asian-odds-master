require("dotenv-safe").config();

import Queue from "./worker";

Queue.add("HandleNotifications", null, { repeat: { every: 35000 } });

Queue.process();
