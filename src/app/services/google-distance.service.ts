import { Injectable } from '@angular/core';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class GoogleDistanceService {

  constructor() { }

  getDistanceinKM(origin, destination){
    const matrix = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
      matrix.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING'
      }, function(response, status) {
        if(status === 'OK') {
          resolve(response.rows[0].elements[0].distance.value);
        } else {
          reject(null);
        }
      })
    })
  }
}
