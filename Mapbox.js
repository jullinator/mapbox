import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import {action, autorun, computed, observable, observe, reaction} from 'mobx';
import {observer} from 'mobx-react/native'
import autobind from 'autobind-decorator';


Mapbox.setAccessToken('pk.eyJ1IjoianVsbGluYXRvciIsImEiOiJjaWx0bmZiNjMwMDQ0dWptNGp6cXlxYXc2In0.K-d_BlKyDY6YnbTeQqDhjw');

@autobind
class Parent  {
  @observable msg = ''
   constructor(msg){
     this.msg=msg
   }
   @action changeMsg (msg){
     this.msg = msg
   }

 }

@autobind
class Child extends Parent {

    constructor(msg){
        super(`Hejsan ${msg}`)
    }
    @action press(){
       this.changeMsg('New Msg')
    }
  }
const child = new Child('Stumpan')
@autobind
class MapHandler {
    @observable pos= {
      latitude:58.40,
      longitude:15.61,
      trueHeading:4,
      zoomLevel:15
    }
    @observable map;
   constructor(){

   }
   @computed get latlng(){

     return {latitude:this.pos.latitude,longitude:this.pos.longitude}
   }
   @action setPosition(){
     console.log(this.pos)
        let {latitude, longitude, zoomLevel} = this.pos
        this.map.setCenterCoordinate( latitude, longitude);
        this.map.setZoomLevel(zoomLevel)
   }
 }
const mapStore = new MapHandler()
@observer
export default class extends Component {
  constructor(){
    super()
  }
  _tap(payload){
    console.log(payload)
  }
  _setPos(){
    let {latitude,longitude, zoomLevel} = mapStore.pos;
    mapStore.map.setCenterCoordinateZoomLevel(latitude, longitude, zoomLevel);
  }
  _locationChanged(payload){
    console.log(payload)
    let {longitude, latitude, trueHeading} = payload;
    ({longitude,latitude, trueHeading}= mapStore.pos)
  }
  render(){
    return(
      <View style={styles.container}>
        <MapView
              ref={map => { mapStore.map = map; }}
              initialCenterCoordinate={mapStore.latlng}
              initialZoomLevel={mapStore.pos.zoomLevel}
              showUserLocation={true}
              userTrackingMode={Mapbox.userTrackingMode.followWithHeading}
              style={styles.map}
              onTap={this._tap}
              onUpdateUserLocation={this._locationChanged}
              />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map:{
    width:800,
    height:800,
    margin:20
  }
});
