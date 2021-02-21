import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

import axios from "axios";

const { width, height } = Dimensions.get("window");
const URL =
  "https://api.unsplash.com/photos/random?count=30&client_id=_77970I8pPKgwpiVSGm2pBrd6b9D4BjOyDlNtpvPW8U";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isImageFocused, setIsImageFocus] = useState(false);

  const [images, setImages] = useState([]);

  useEffect(() => {
    loadWallPapers();
  }, []);

  const shareWallPaper = async (image) => {
    try {
      await Share.share({
        message: image.urls.regular,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const showControls = (item) => {
    setIsImageFocus(!isImageFocused);
    if (isImageFocused) {
    } else {
    }
  };

  const saveToCameraroll = async (image) => {
    const result = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (result.status !== "granted") {
      Alert.alert(
        "Insufficient permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
    }

    const fileUri = FileSystem.documentDirectory + image.id + ".jpg";
    FileSystem.downloadAsync(image.urls.regular, fileUri).then(({ uri }) => {
      console.log("Finished downloading to ", uri);
      MediaLibrary.createAssetAsync(uri);
      Alert.alert("", "Image has bees saved to gallery", [{ text: "Okay" }]);
    });
  };
  const renderImage = (image) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => showControls(image)}>
          <View style={{ height, width }}>
            <Image
              style={{ flex: 1, height: null, width: null }}
              source={{ uri: image.urls.regular }}
            />
          </View>
        </TouchableWithoutFeedback>
        {isImageFocused ? (
          <View
            style={{
              backgroundColor: "white",
              position: "absolute",
              height: 70,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={loadWallPapers}>
                <Ionicons name="ios-refresh" size={24} color="teal" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => shareWallPaper(image)}>
                <Ionicons name="ios-share" size={24} color="teal" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => saveToCameraroll(image)}>
                <Ionicons name="ios-save" size={24} color="teal" />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  };
  const loadWallPapers = async () => {
    const { data } = await axios.get(URL);
    setIsLoading(false);
    setIsImageFocus(false);
    setImages(data);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator large color="grey" />
      </View>
    );
  }

  return (
    <View style={styles.container2}>
      <FlatList
        scrollEnabled={!isImageFocused}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        data={images}
        renderItem={({ item }) => renderImage(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
