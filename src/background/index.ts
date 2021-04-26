import installReload from "./hmr"

if (process.env.NODE_ENV === "development") {
  installReload()
}
