import { StyleSheet } from "react-native";

export const categoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  grid: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    margin: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loader: {
    marginTop: 16,
    fontSize: 14,
    color: "#555",
  },
  error: {
    marginTop: 16,
    fontSize: 14,
    color: "#c00",
  },
  refreshButton: {
    marginTop: 12,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#4a72ff",
    borderRadius: 10,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "600",
  },
});
