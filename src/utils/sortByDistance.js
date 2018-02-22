export default function sortByDistance(data) {
  data.forEach(function(result) {
    result._distance = parseFloat(result['Miles from hotel']);
  });
  return data.sort(function(a, b) {
    const aDist = a._distance;
    const bDist = b._distance;
    if ((isNaN(aDist) && isNaN(bDist)) || (aDist === bDist)) {
      return 0;
    }
    if (isNaN(bDist) || (aDist < bDist)) {
      return -1;
    }
    if (isNaN(aDist) || (aDist > bDist)) {
      return 1;
    }
    return 0;
  });
}
