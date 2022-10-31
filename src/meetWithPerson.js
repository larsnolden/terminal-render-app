import axios from "axios";

function meetWithPerson(personName) {
  return axios.post(`${process.env.USER_SERVER_ENDPOINT}/meet_with`, {
    personName,
  });
}

export default meetWithPerson;
