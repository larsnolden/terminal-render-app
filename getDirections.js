const axios = require("axios");

// "https://routing.mazemap.com/routing/directions/?srid=4326&hc=false&sourcelat=52.2391519&sourcelon=6.857220489002543&targetlat=52.23835665087845&targetlon=6.857342399629715&sourcez=1&targetz=1&lang=en&distanceunitstype=metric&mode=PEDESTRIAN",

async function main() {
  const res = await axios.get(
    "https://routing.mazemap.com/routing/directions/?srid=4326&hc=false&sourcelat=52.2391519&sourcelon=6.857220489002543&desttype=poi&dest=820254&campusid=171&sourcez=1&targetz=1&lang=en&distanceunitstype=metric&mode=PEDESTRIAN",
    {
      credentials: "omit",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Sec-GPC": "1",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      referrer: "https://use.mazemap.com/",
      method: "GET",
      mode: "cors",
    }
  );
  // console.log(JSON.stringify(res.data.routes));
}

main();
