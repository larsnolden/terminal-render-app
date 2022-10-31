import axios from "axios";

function meetWithPerson(personName, userName) {
  const params = new URLSearchParams({
    person1: String(userName).toLowerCase(),
    person2: String(personName).toLowerCase(),
  });

  return axios
    .post(`${process.env.REACT_APP_USER_SERVER_ENDOINT}/meeting?${params}`)
    .catch((e) => console.warn("Could not schedule a meeting with person", e));
}

export default meetWithPerson;
