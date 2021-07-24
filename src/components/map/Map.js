import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import CountyCard from '../card/CountyCard';
import StateCard from '../card/StateCard';
import { MapService } from '../../services/MapService';
import { MapUtils } from '../../MapUtils/MapUtils';

const PointMark = ({ children }) => children;
 
class Map extends Component {
  static defaultProps = {
    center: {
      lat: 42,
      lng: -74,
    },
    zoom: 11 // zoom in/out level
  };
 
  state = {
      boundry:{},
      zoom: 11,
      points: {},
  };


  render() {
    console.log(this.state.points);

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }} // Enter your key here
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onChange={ (changeObject) => {
              this.setState(
                  {
                      zoom: changeObject.zoom,
                      boundry: changeObject.bounds,
                  }
              );
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={
            ({ map, maps }) => {
                //1. call backend api to get data(XHR)
                //2. setState() to trigger updating
                MapService.getUSCovidData()
                .then(response => {
                    // data handling (response.data)
                    const covidDataPoints = MapUtils.getCovidPoints(response.data);
                    this.setState({
                        points: covidDataPoints,
                    });
                })
                .catch(
                  error => {console.log(error);}
                )
              }
          }
        >
        {this.renderPoints()}
        </GoogleMapReact>
      </div>
    );
  }

  renderPoints() {
      const points = this.state.points[this.state.zoom];    //??
      const result = [];
      if (!points) {
          return result;
      }
      // render counties
      if (Array.isArray(points)) {
          for (const county of points) {
              // is point in boundary?
              if (!MapUtils.isInBoundry(this.state.boundry, county.coordinates)) {
                  continue;
              }
              result.push(
                <PointMark
                    key={county.province + county.county}
                    lat={county.coordinates.latitude}
                    lng={county.coordinates.longitude}
                >
                    <CountyCard {...county}/>
                </PointMark>
              )
          }
      }

      // render states
      if (points.type === "states") {
          for (const nation in points) {
              for (const state in points[nation]) {
                  if (!MapUtils.isInBoundry(this.state.boundry, points[nation][state].coordinates)) {
                      continue;
                  }
                  result.push(
                      <PointMark
                      key={nation + state}
                      lat={points[nation][state].coordinates.latitude}
                      lng={points[nation][state].coordinates.longitude}
                      >
                          <StateCard state={state}{...points[nation][state]}/>
                      </PointMark>
                  )
              }
          }
      }
      // homework: render nations
      return result;
  }
}

export default Map;