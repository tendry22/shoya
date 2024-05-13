import { StyleSheet } from "react-native";

const global = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },

  scroll: {
    flexGrow: 1,
  },
  pageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // resizeMode: 'cover'
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
  },
  haut: {
    justifyContent: "space-between",
  },
  backButtonIcon: {
    color: "white",
    fontSize: 30,
  },
  bellButton: {
    position: "absolute",
    top: 40,
    right: 10,
  },
  bellButtonIcon: {
    color: "white",
    fontSize: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: "30%",
    marginBottom: "12%",
  },
  logo: {
    width: 350,
    height: 150,
  },
  Buttoncreate: {
    width: "80%",
    height: 50,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: "8%",
  },
  buttonContainer: {
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textCreate: {
    fontSize: 16,
    fontFamily: "OnestBold",
    textAlign: "center",
    lineHeight: 48,
  },
  title: {
    alignItems: "center",
    marginTop: 15,
  },
  titleText: {
    fontFamily: "OnestBold",
    fontSize: 16,
    color: "#16DAAC",
    marginBottom: 17,
  },
  titleTextJaune: {
    fontFamily: "OnestBold",
    fontSize: 16,
    color: "#B6EA5C",
    marginBottom: 17,
  },
  petitTextJaune: {
    fontFamily: "OnestBold",
    fontSize: 12,
    color: "#B6EA5C",
    marginBottom: 17,
  },
  grandTextJaune: {
    fontFamily: "OnestBold",
    fontSize: 21,
    color: "#B6EA5C",
    marginBottom: 17,
  },

  // Bouton de CustomHeader
  buttonContainerLeft: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  buttonContainerRight: {
    position: "absolute",
    top: 25,
    right: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },

  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 0,
    backgroundColor: "#16DAAC",
    width: 15,
    height: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#181526",
    fontSize: 12,
    fontWeight: "bold",
  },

  hautContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backNavsContainer: {
    alignSelf: "flex-start",
    marginTop: 13,
    marginLeft: 7,
  },
  notificationsContainer: {
    alignSelf: "flex-end",
    marginRight: 7,
  },
  topcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
  },
});

export default global;
