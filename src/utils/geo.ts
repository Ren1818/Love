import * as THREE from "three";

/**
 * Convierte lat, lon (grados) a Vector3 en esfera de radio r.
 * lat: -90..90 (sur negativo), lon: -180..180 (oeste negativo)
 */
export function latLonToVector3(latitude: number, longitude: number, radius: number) {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
