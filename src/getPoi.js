function getPoi(poiId) {
  // eslint-disable-next-line no-undef
  return Mazemap.Data.getPoi(poiId).then((res) => res.properties);
}

export default getPoi;
