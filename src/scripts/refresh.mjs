import { refreshProfile } from "../lib/refresh.mjs";

const profile = await refreshProfile();
console.log(
  JSON.stringify(
    {
      refreshed: true,
      lastUpdated: profile.lastUpdated,
      cacheStatus: profile.cacheStatus,
      sourceStatus: profile.sourceStatus
    },
    null,
    2
  )
);
