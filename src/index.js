require("dotenv-safe").config();

import Queue from "./worker";

Queue.add("HandleNotifications", null, { repeat: { every: 30000 } });

Queue.process();
