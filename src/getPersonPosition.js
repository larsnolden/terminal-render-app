import axios from "axios";

async function getPersonPosition(personName) {
  const res = await axios
    .get(
      `${process.env.REACT_APP_LOCALISATION_SERVER_ENDPOINT}/${String(
        personName
      ).toLowerCase()}`
    )
    .catch((e) => console.warn("Failed to fetch user location", e));
  try {
    console.log("res position", res);
    const { guesses } = res.data.analysis;
    return guesses[0].location;
  } catch (e) {
    console.warn(
      "Could not destructure person location fingerprint guesses",
      e
    );
    return null;
  }
}

export default getPersonPosition;
