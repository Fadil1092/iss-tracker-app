import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  FlatList,
  ImageBackground,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import apiKey from "../config";
import { render } from "react-dom";

const MeteorScreen = (props) => {
  const [meteors, setMeteors] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const url = "https://api.nasa.gov/neo/rest/v1/feed?api_key=" + apiKey;
  useEffect(() => {
    const getmeteors = async () => {
      axios
        .get(url)
        .then((response) => {
          setMeteors(response.data.near_earth_objects);
        })
        .catch((error) => {
          Alert.alert(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    getmeteors();
  }, []);

  keyExtractor = (item, index) => {
    index.toString();
  };

  renderItem = ({ item }) => {
    let meteor = item;
    let bgImg, speed, size;
    if (meteor.threatScore <= 30) {
      bgImg = require("../assets/meteor_bg1.png");
      speed = require("../assets/meteor_speed1.gif");
      size = 100;
    } else if (meteor.threatScore <= 75) {
      bgImg = require("../assets/meteor_bg2.png");
      speed = require("../assets/meteor_speed2.gif");
      size = 150;
    } else {
      bgImg = require("../assets/meteor_bg3.png");
      speed = require("../assets/meteor_speed3.gif");
      size = 200;
    }
    return (
      <View>
        <ImageBackground
          source={bgImg}
          style={{ flex: 1, resizeMode: "cover" }}
        >
          <View style={styles.gifContainer}>
            <Image
              source={speed}
              style={{ width: size, height: size, alignSelf: "center" }}
            />
          </View>
          <Text style={[styles.cardTitle, { marginTop: 400, marginLeft: 50 }]}>
            {item.name}
          </Text>
          <Text style={[styles.cardText, { marginTop: 20, marginLeft: 50 }]}>
            "closest to earth":
            {item.close_approach_date[0].close_approach_date_full}
          </Text>
          <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
            minimum Diameter In Kilometers
            {item.estimated_diameter.kilometers.estimated_diameter_min}
          </Text>
          <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
            maximum Diameter In Kilometers
            {item.estimated_diameter.kilometers.estimated_diameter_max}
          </Text>
          <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
            velocity
            {item.close_approach_date[0].relative_velocity.kilometers_per_hour}
          </Text>
          <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
            missing earth by kilometers
            {item.close_approach_date[0].miss_distance.kilometers}
          </Text>
        </ImageBackground>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View>
        <Text> Getting Meteor Information </Text>
      </View>
    );
  } else {
    let meteorArray = Object.keys(meteors).map((meteorDate) => {
      // console.log(Object.keys(meteors));
      // console.log("meteorArray", meteorArray.length);
      // console.log("meteorArray", meteorArray[0][0]);
      return meteors[meteorDate];
    });
    let meteorFinal = [].concat.apply([], meteorArray);
    console.log("Meteor Final", meteorFinal.length);
    meteorFinal.forEach((element) => {
      let diameter =
        (element.estimated_diameter.kilometers.estimated_diameter_min +
          element.estimated_diameter.kilometers.estimated_diameter_max) /
        2;
      let threatScore =
        (diameter / element.close_approach_data[0].miss_distance.kilometers) *
        1000000000;
      console.log(threatScore);
      element.threatScore = threatScore;
    });
    meteorFinal.sort((a, b) => {
      return b.threatScore - a.threatScore;
    });
    meteorFinal.slice(0, 5);
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <SafeAreaView style={styles.androidSafeArea} />
        <FlatList
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          data={meteorFinal}
          horizontal={true}
        />

        <Text> Meteor Screen</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  gifContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
  cardText: {
    color: "white",
  },
  androidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default MeteorScreen;
