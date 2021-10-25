import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

const ISSLocationScreen = (props) => {
  const [location, setLocation] = useState("");

  useEffect(() => {
    getISSLocation();
  }, []);

  const getISSLocation = async () => {
    await axios
      .get("https://api.wheretheiss.at/v1/satellites/25544")
      .then((response) => {
        console.log(response, response.data);
        setLocation(response.data);
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert(error.message);
      });
  };
  if (location === "") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <SafeAreaView style={styles.droidSafeArea} />
        <Text> Getting ISS Location Information ... </Text>
        <ActivityIndicator size="large" color="#808080" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.droidSafeArea} />
        <ImageBackground
          source={require("../assets/iss_bg.jpg")}
          style={styles.backgroundImage}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>ISS Location</Text>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 100,
                longitudeDelta: 100,
              }}
            ></MapView>
          </View>
        </ImageBackground>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  titleContainer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  mapContainer: {
    flex: 0.7,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default ISSLocationScreen;
