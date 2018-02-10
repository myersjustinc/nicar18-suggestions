export default function generateMapLink(address) {
  return (
    'https://maps.google.com/maps?q=' +
    encodeURIComponent(address));
}
