// styles/commonStyles.js
import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  button: {
    backgroundColor: "#ff5757", // Button color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: "#fff",
    marginTop: 0,
    borderRadius: 10,
    marginBottom: 5,
    padding: 0,
  },
  logo: {
    width: 150, // Adjust the width as needed
    height: 40, // Adjust the height as needed
    resizeMode: "contain", // Ensures the image scales properly
    alignSelf: "center", // Centers the logo horizontally
  },
});

export default commonStyles;
