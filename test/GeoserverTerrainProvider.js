"use strict";
(() => {
  var v = window.Cesium;
  function G(e, r) {
    let t = Math.max(e.west, r.west),
      i = Math.min(e.east, r.east),
      a = Math.max(e.south, r.south),
      n = Math.min(e.north, r.north),
      l;
    return i <= t || a >= n ? (l = null) : (l = new v.Rectangle(t, a, i, n)), l;
  }
  var D = [
    {
      name: "CRS:84",
      ellipsoid: v.Ellipsoid.WGS84,
      firstAxeIsLatitude: !1,
      tilingScheme: v.GeographicTilingScheme,
      supportedCRS: "urn:ogc:def:crs:OGC:2:84",
    },
    {
      name: "EPSG:4326",
      ellipsoid: v.Ellipsoid.WGS84,
      firstAxeIsLatitude: !0,
      tilingScheme: v.GeographicTilingScheme,
      supportedCRS: "urn:ogc:def:crs:EPSG::4326",
    },
    {
      name: "EPSG:3857",
      ellipsoid: v.Ellipsoid.WGS84,
      firstAxeIsLatitude: !1,
      tilingScheme: v.WebMercatorTilingScheme,
      supportedCRS: "urn:ogc:def:crs:EPSG::3857",
    },
    {
      name: "OSGEO:41001",
      ellipsoid: v.Ellipsoid.WGS84,
      firstAxeIsLatitude: !1,
      tilingScheme: v.WebMercatorTilingScheme,
      supportedCRS: "urn:ogc:def:crs:EPSG::3857",
    },
  ];
  var H = [
    { format: "image/png", extension: "png" },
    { format: "image/jpeg", extension: "jpg" },
    { format: "image/jpeg", extension: "jpeg" },
    { format: "image/gif", extension: "gif" },
    { format: "image/png; mode=8bit", extension: "png" },
  ];
  var X = [
    {
      format: "image/bil",
      postProcessArray: function (e, r, t, i, a) {
        let n = null,
          l = new DataView(e),
          g = new ArrayBuffer(r.height * r.width * 2),
          f = new DataView(g);
        if (g.byteLength === e.byteLength) {
          let d,
            p = 0,
            x = 0;
          for (let y = 0; y < g.byteLength; y += 2)
            if (((d = l.getInt16(y, !1) - a), d > i && d < t))
              f.setInt16(y, d, !0), (x += d), p++;
            else {
              let I = p === 0 ? 1 : x / p;
              f.setInt16(y, I, !0);
            }
          n = new Int16Array(g);
        }
        return n;
      },
    },
  ];
  var k = {
      service: "WMS",
      maxLevel: 11,
      heightMapWidth: 65,
      heightMapHeight: 65,
      offset: 0,
      highest: 12e3,
      lowest: -500,
      hasStyledImage: !1,
    },
    O = {
      heightScale: 1,
      heightOffset: 0,
      elementsPerHeight: 1,
      stride: 1,
      elementMultiplier: 256,
      isBigEndian: !1,
      lowestEncodedHeight: 0,
      highestEncodedHeight: 1e4,
    };
  function W(e, r) {
    (r.heightMapWidth = e.heightMapWidth),
      (r.heightMapHeight = e.heightMapHeight),
      (r.ready = !1),
      (r.maximumLevel = e.maxLevel),
      (r.levelZeroMaximumGeometricError = void 0),
      (r.offset = e.offset),
      (r.highest = e.highest),
      (r.lowest = e.lowest),
      (r.hasStyledImage = e.hasStyledImage || typeof e.styleName == "string");
  }
  function V(e, r, t, i) {
    return i.postProcessArray(e, t, r.highest, r.lowest, r.offset);
  }
  function Y(e, r, t, i) {
    let a = v.getImagePixels(e, t.width, t.height),
      n = new Int16Array(a.length / 4),
      l = 0,
      g = 0;
    for (let f = 0; f < a.length; f += 4) {
      let d = a[f],
        p = a[f + 1],
        x = a[f + 2] > 128,
        y = ((d << 8) | p) - r.offset - 32768;
      y > r.lowest && y < r.highest && (x || i)
        ? ((n[f / 4] = y), (g += y), l++)
        : (n[f / 4] = l === 0 ? 0 : g / l);
    }
    return n;
  }
  var Z = window.Cesium,
    { fetchXML: Q } = Z.Resource;
  async function K(e) {
    let r;
    if (e.url)
      (e.xml = await Q({ url: e.url + "/gwc/service/tms/1.0.0" })),
        (r = await j(e));
    else if (e.xml) r = await j(e);
    else
      throw new Error(
        "either description.url or description.xml are required."
      );
    return r;
  }
  async function j(e) {
    let r = e.xml;
    if (!(r instanceof XMLDocument))
      throw new Error("xml must be a XMLDocument");
    let t;
    if (r.querySelector("TileMapService") !== null) {
      if (!e.layerName) throw new Error("layerName is required.");
      let i = Array.from(
        r.querySelectorAll("TileMap[title='" + e.layerName + "']")
      ).map((a) => {
        let n = a.getAttribute("href");
        return (
          e.proxy && (n = e.proxy.getURL(n)),
          Q({ url: n }).then((l) => ((e.xml = l), z(e)))
        );
      });
      t = await Promise.race(i);
    } else t = z(e);
    return t;
  }
  function z(e) {
    let r = e.xml,
      t = {};
    W(e, t);
    let i = e.maxLevel,
      a = e.proxy,
      n = r.querySelector("SRS").textContent,
      l = D.find((m) => m.name === n);
    l && (t.tilingScheme = new l.tilingScheme({ ellipsoid: l.ellipsoid }));
    let g = r.querySelector("TileFormat"),
      f = H.find((m) => m.extension == g.getAttribute("extension"));
    f &&
      ((t.formatImage = f),
      (t.imageSize = {
        width: parseInt(g.getAttribute("width"), 10),
        height: parseInt(g.getAttribute("height"), 10),
      }));
    let d = Array.from(r.querySelectorAll("TileSets>TileSet")),
      p = [];
    if (
      (t.formatImage &&
        ((p = d.map(function (m) {
          let o =
            m.getAttribute("href") + "/{x}/{tmsY}." + t.formatImage.extension;
          a && (o = a.getURL(o));
          let u = parseInt(m.getAttribute("order"));
          return { url: o, level: u };
        })),
        p.sort((m, o) => m.level - o.level)),
      p.length === 0 || !t.formatImage || !t.tilingScheme)
    )
      throw new Error("no tilesets, no formatImage and no formatArray");
    t.URLtemplateImage = function (m, o, u) {
      let b = "";
      return u < p.length && (b = p[u].url), b;
    };
    let x = r.querySelector("BoundingBox"),
      y = parseFloat(x.getAttribute("miny")),
      I = parseFloat(x.getAttribute("maxy")),
      L = parseFloat(x.getAttribute("minx")),
      c = parseFloat(x.getAttribute("maxx")),
      S = new Z.Rectangle(L, y, c, I);
    return (
      (t.getTileDataAvailable = function (m, o, u) {
        let b = t.tilingScheme.tileXYToNativeRectangle(m, o, u);
        return G(S, b) !== null && u < i && u < p.length;
      }),
      (t.ready = !0),
      t
    );
  }
  var _ = window.Cesium,
    { fetchXML: ae } = _.Resource;
  async function $(e) {
    let r;
    if (e.url) {
      let t = e.url,
        i = t.lastIndexOf("?");
      i > -1 && (t = t.substring(0, i));
      let a = t + "/ows?SERVICE=WMS&REQUEST=GetCapabilities&tiled=true";
      console.log(a),
        e.proxy && (a = e.proxy.getURL(a)),
        (e.xml = await ae({ url: a })),
        (r = J(e));
    } else if (e.xml) r = J(e);
    else
      throw new Error(
        "either description.url or description.xml are required."
      );
    return r;
  }
  function J(e) {
    if (!(e.xml instanceof XMLDocument))
      throw new Error("xml must be a XMLDocument");
    if (!e.layerName) throw new Error("description.layerName is required.");
    let r = e.xml,
      t = {},
      i = e.layerName,
      a = e.maxLevel,
      n = null,
      l = { width: 65, height: 65 },
      g;
    W(e, t),
      (t.formatImage = e.formatImage),
      (t.formatArray = e.formatArray),
      (t.tilingScheme = void 0);
    let f,
      d,
      p = e.styleName,
      x = r.querySelector("[version]");
    x !== null &&
      ((n = x.getAttribute("version")), (d = /^1\.[3-9]\./.test(n)));
    let y = r
        .querySelector("Request>GetMap OnlineResource")
        .getAttribute("xlink:href"),
      I = y.indexOf("?");
    I > -1 && (y = y.substring(0, I)), e.proxy && (y = e.proxy.getURL(y));
    let L = Array.from(r.querySelectorAll("Request>GetMap>Format")).map(
      (m) => m.textContent
    );
    for (let m = 0; m < L.length; m++)
      t.formatImage || (t.formatImage = H.find((o) => o.format === L[m])),
        t.formatArray || (t.formatArray = X.find((o) => o.format === L[m]));
    t.formatArray &&
    typeof t.formatArray.format == "string" &&
    typeof t.formatArray.postProcessArray == "function"
      ? (t.formatArray.terrainDataStructure = Object.assign({}, O))
      : delete t.formatArray,
      (!t.formatImage || typeof t.formatImage.format != "string") &&
        (t.formatImage = void 0);
    let c = r.querySelectorAll("Layer[queryable='1'],Layer[queryable='true']"),
      S = null;
    for (let m = 0; m < c.length && S === null; m++)
      if (c[m].querySelector("Name").textContent === i) {
        S = c[m];
        let o = S.getAttribute("fixedHeight"),
          u = S.getAttribute("fixedWidth");
        o !== null &&
          ((o = parseInt(o, 10)),
          (t.heightMapHeight =
            o > 0 && o < t.heightMapHeight ? o : t.heightMapHeight),
          (l.height = o > 0 ? o : l.height)),
          u !== null &&
            ((u = parseInt(u, 10)),
            (t.heightMapWidth =
              u > 0 && u < t.heightMapWidth ? u : t.heightMapWidth),
            (l.width = u > 0 ? u : l.width));
      }
    if (S !== null && n !== null) {
      let m = !1;
      for (let b = 0; b < D.length && !m; b++) {
        let s = D[b],
          R = s.name,
          h = S.querySelector(
            "BoundingBox[SRS='" + R + "'],BoundingBox[CRS='" + R + "']"
          );
        if (h !== null) {
          (g = R),
            (f = s.firstAxeIsLatitude),
            (t.tilingScheme = new s.tilingScheme({ ellipsoid: s.ellipsoid }));
          let A, F, w, T;
          f && d
            ? ((A = parseFloat(h.getAttribute("miny"))),
              (F = parseFloat(h.getAttribute("maxy"))),
              (w = parseFloat(h.getAttribute("minx"))),
              (T = parseFloat(h.getAttribute("maxx"))))
            : ((A = parseFloat(h.getAttribute("minx"))),
              (F = parseFloat(h.getAttribute("maxx"))),
              (w = parseFloat(h.getAttribute("miny"))),
              (T = parseFloat(h.getAttribute("maxy"))));
          let M = new _.Rectangle(A, w, F, T);
          (t.getTileDataAvailable = function (C, E, q) {
            let U = !1,
              ie = t.tilingScheme.tileXYToNativeRectangle(C, E, q);
            return q < a && (U = G(M, ie) !== null), U;
          }),
            (m = !0);
        }
      }
      if (p) {
        let b = S.querySelectorAll("Style>Name"),
          s = !1;
        for (let R = 0; R < b.length && !s; R++)
          p === b[R].textContent && (s = !0);
        s || (p = null);
      }
      let o = r.querySelectorAll("VendorSpecificCapabilities>TileSet"),
        u = !1;
      for (let b = 0; b < o.length && !u; b++) {
        let s =
          o[b].querySelector(
            "BoundingBox[SRS='" + g + "'],BoundingBox[CRS='" + g + "']"
          ) !== null;
        o[b].querySelector("Layers").textContent === i &&
          s &&
          ((l.width = parseInt(o[b].querySelector("Width").textContent, 10)),
          (l.height = parseInt(o[b].querySelector("Height").textContent, 10)),
          (u = !0));
      }
      t.ready = m && (t.formatImage || t.formatArray) && n !== null;
    }
    if (t.ready) {
      let m =
        y +
        "?SERVICE=WMS&REQUEST=GetMap&layers=" +
        i +
        "&version=" +
        n +
        "&bbox=";
      if (
        (d && f
          ? (m += "{south},{west},{north},{east}")
          : (m += "{west},{south},{east},{north}"),
        (m += "&crs=" + g + "&srs=" + g),
        t.formatImage)
      ) {
        let o =
          m +
          "&format=" +
          t.formatImage.format +
          "&width=" +
          l.width +
          "&height=" +
          l.height;
        p && (o += "&styles=" + p + "&style=" + p),
          (t.URLtemplateImage = () => o),
          (t.imageSize = l);
      }
      if (t.formatArray) {
        let o =
          m +
          "&format=" +
          t.formatArray.format +
          "&width=" +
          t.heightMapWidth +
          "&height=" +
          t.heightMapHeight;
        t.URLtemplateArray = () => o;
      }
    }
    return t;
  }
  var ne = window.Cesium,
    { fetchXML: oe } = ne.Resource;
  async function te(e) {
    let r;
    if (e.url) {
      let t = e.url,
        i = t.lastIndexOf("?");
      i > -1 && (t = t.substring(0, i));
      let a = t + "/gwc/service/wmts?REQUEST=GetCapabilities";
      e.proxy && (a = e.proxy.getURL(a)),
        (e.xml = await oe({ url: a })),
        (r = ee(e));
    } else if (e.xml) r = ee(e);
    else
      throw new Error(
        "either description.url or description.xml are required."
      );
    return r;
  }
  function ee(e) {
    let r = e.xml;
    if (!(r instanceof XMLDocument))
      throw new Error("xml must be a XMLDocument");
    let t = {},
      i = e.layerName;
    W(e, t);
    let a = e.maxLevel,
      n = e.proxy,
      l = e.styleName,
      g = null,
      f = [],
      d = null,
      p = null,
      x = null;
    Array.from(r.querySelectorAll('Operation[name="GetTile"] HTTP Get'))
      .map((c) => ({ node: c, type: c.querySelector("Value").textContent }))
      .forEach((c) => {
        c.type === "RESTful" &&
          p === null &&
          ((p = c.node.getAttribute("xlink:href")), n && (p = n.getURL(p))),
          c.type === "KVP" &&
            d === null &&
            ((d = c.node.getAttribute("xlink:href")), n && (d = n.getURL(d)));
      });
    let y = r.querySelectorAll("Contents>Layer>Identifier"),
      I = null;
    for (let c = 0; c < y.length && I === null; c++)
      i === y[c].textContent && (I = y[c].parentNode);
    if (I !== null) {
      let c, S;
      Array.from(I.querySelectorAll("Style")).forEach((o) => {
        let u = o.querySelector("Identifier").textContent;
        o.getAttribute("isDefault") != null && (c = u), u === l && (S = u);
      }),
        (!l || l !== S) && (l = c || "");
      let m = Array.from(I.querySelectorAll("Format"));
      for (let o = 0; o < H.length && x === null; o++)
        m.filter((b) => b.textContent === H[o].format).length > 0 && (x = H[o]);
      f = Array.from(I.querySelectorAll("TileMatrixSetLink"));
    }
    let L = Array.from(r.querySelectorAll("TileMatrixSet>Identifier"));
    for (let c = 0; c < f.length && !t.ready; c++) {
      let S = f[c],
        m = S.querySelector("TileMatrixSet").textContent,
        o = null,
        u = null;
      for (let s = 0; s < L.length && o === null; s++)
        L[s].textContent === m && (o = L[s].parentNode);
      let b = o.querySelector("SupportedCRS").textContent;
      for (let s = 0; s < D.length && u === null; s++)
        D[s].supportedCRS === b && (u = D[s]);
      if (u !== null) {
        let s = Array.from(o.querySelectorAll("TileMatrix"))
            .map(function (h) {
              let A = h.querySelector("Identifier").textContent,
                F = parseInt(h.querySelector("MatrixWidth").textContent, 10),
                w = parseInt(h.querySelector("MatrixHeight").textContent, 10),
                T = parseInt(h.querySelector("TileWidth").textContent, 10),
                M = parseInt(h.querySelector("TileHeight").textContent, 10),
                C = parseFloat(h.querySelector("ScaleDenominator").textContent);
              return {
                id: A,
                maxWidth: F,
                maxHeight: w,
                scaleDenominator: C,
                complete: !1,
                tileWidth: T,
                tileHeight: M,
              };
            })
            .sort((h, A) => A.scaleDenominator - h.scaleDenominator),
          R = Array.from(
            S.querySelectorAll("TileMatrixSetLimits>TileMatrixLimits")
          ).map((h) => ({
            id: h.querySelector("TileMatrix").textContent,
            bbox: {
              minTileRow: parseInt(
                h.querySelector("MinTileRow").textContent,
                10
              ),
              maxTileRow: parseInt(
                h.querySelector("MaxTileRow").textContent,
                10
              ),
              minTileCol: parseInt(
                h.querySelector("MinTileCol").textContent,
                10
              ),
              maxTileCol: parseInt(
                h.querySelector("MaxTileCol").textContent,
                10
              ),
            },
          }));
        if (
          (s.forEach((h) => {
            R.forEach((A) => {
              h.id === A.id && ((h.bbox = A.bbox), (h.complete = !0));
            });
          }),
          s.length > 0)
        ) {
          t.tilingScheme = new u.tilingScheme({
            ellipsoid: u.ellipsoid,
            numberOfLevelZeroTilesX: s[0].maxWidth,
            numberOfLevelZeroTilesY: s[0].maxHeight,
          });
          let h = I.querySelector("ResourceURL[format='" + x.format + "']");
          if (
            (h !== null
              ? (g = h
                  .getAttribute("template")
                  .replace("{TileRow}", "{y}")
                  .replace("{TileCol}", "{x}")
                  .replace("{style}", l)
                  .replace("{Style}", l)
                  .replace("{TileMatrixSet}", m)
                  .replace("{layer}", i)
                  .replace("{infoFormatExtension}", x.extension))
              : d !== null &&
                (g =
                  d +
                  "service=WMTS&request=GetTile&version=1.0.0&layer=" +
                  i +
                  "&style=" +
                  l +
                  "&format=" +
                  x.format +
                  "&TileMatrixSet=" +
                  m +
                  "&TileMatrix={TileMatrix}&TileRow={y}&TileCol={x}"),
            g !== null)
          ) {
            (t.getTileDataAvailable = (w, T, M) => {
              let C = !1;
              if (M < a && M < s.length) {
                let E = s[M],
                  q = E.bbox;
                E.complete
                  ? (C =
                      T <= q.maxTileRow &&
                      T >= q.minTileRow &&
                      w <= q.maxTileCol &&
                      w >= q.minTileCol)
                  : (C = w < E.maxWidth && T < E.maxHeight);
              }
              return C;
            }),
              (t.URLtemplateImage = function (w, T, M) {
                let C = "";
                if (t.getTileDataAvailable(w, T, M)) {
                  let E = s[M];
                  C = g.replace("{TileMatrix}", E.id);
                }
                return C;
              });
            let A = { width: s[0].tileWidth, height: s[0].tileHeight };
            s.filter((w) => w.tileWidth != A.width || w.tileHeight != A.height)
              .length === 0 && (t.imageSize = A),
              (t.ready = !0);
          }
        }
      }
    }
    return t;
  }
  var P = window.Cesium,
    { fetchArrayBuffer: Le, fetchImage: De } = P.Resource,
    N = class {
      errorEvent = new P.Event();
      credit;
      tilingScheme;
      ready = !1;
      hasVertexNormals = !1;
      readyPromise;
      hasWaterMask;
      heightMapHeight;
      heightMapWidth;
      availability;
      constructor(r, t = "") {
        (this.credit = new P.Credit(t)),
          (this.tilingScheme = r.tilingScheme),
          (this.getTileDataAvailable = r.getTileDataAvailable),
          (this.hasWaterMask = !1),
          (this.heightMapHeight = r.heightMapHeight),
          (this.heightMapWidth = r.heightMapWidth),
          (this.availability = new P.TileAvailability(
            this.tilingScheme,
            r.maximumLevel
          )),
          (this.getLevelMaximumGeometricError = (i) =>
            r.levelZeroMaximumGeometricError / (1 << i)),
          (this.requestTileGeometry = async (i, a, n) => {
            let l,
              g = await r.GeometryCallback(i, a, n),
              f = le(i, a, n, r);
            return new P.HeightmapTerrainData({
              buffer: g,
              width: r.heightMapWidth,
              height: r.heightMapHeight,
              childTileMask: f,
            });
          }),
          (this.ready = r.ready),
          (this.readyPromise = new Promise((i) => !0));
      }
      requestTileGeometry(r, t, i, a) {
        throw new Error("Method not implemented.");
      }
      getLevelMaximumGeometricError(r) {
        throw new Error("Method not implemented.");
      }
      getTileDataAvailable(r, t, i) {
        throw new Error("Method not implemented.");
      }
    };
  function le(e, r, t, i) {
    let a = 0,
      n = t + 1;
    return (
      (a |= i.getTileDataAvailable(2 * e, 2 * r, n) ? 1 : 0),
      (a |= i.getTileDataAvailable(2 * e + 1, 2 * r, n) ? 2 : 0),
      (a |= i.getTileDataAvailable(2 * e, 2 * r + 1, n) ? 4 : 0),
      (a |= i.getTileDataAvailable(2 * e + 1, 2 * r + 1, n) ? 8 : 0),
      a
    );
  }
  var B = window.Cesium,
    { fetchArrayBuffer: me, fetchImage: se } = B.Resource;
  async function ue(e) {
    e = Object.assign(k, e);
    let r;
    switch (e.service) {
      case "TMS":
        r = K(e);
        break;
      case "WMTS":
        r = te(e);
        break;
      default:
        r = $(e);
    }
    let t = await r;
    return (
      he(t),
      e.service === "WMTS"
        ? new N(t)
        : new B.CustomHeightmapTerrainProvider({
            height: t.heightMapHeight,
            width: t.heightMapWidth,
            tilingScheme: t.tilingScheme,
            callback: t.GeometryCallback,
          })
    );
  }
  window.Cesium.GeoserverTerrainProvider = ue;
  function he(e) {
    (e.levelZeroMaximumGeometricError =
      B.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
        e.tilingScheme.ellipsoid,
        e.heightMapWidth,
        e.tilingScheme.getNumberOfXTilesAtLevel(0)
      )),
      e.URLtemplateImage &&
        (e.getBufferImage = async (r, t, i) => {
          let a = null;
          if (!isNaN(r + t + i)) {
            let n = re(e.URLtemplateImage(r, t, i), r, t, i, e),
              l = { highest: e.highest, lowest: e.lowest, offset: e.offset };
            a = await se({ url: n })
              .then((f) =>
                Y(
                  f,
                  l,
                  { width: e.heightMapWidth, height: e.heightMapHeight },
                  e.hasStyledImage
                )
              )
              .catch(
                () => new Int16Array(e.heightMapWidth * e.heightMapHeight)
              );
          }
          return a;
        }),
      e.URLtemplateArray &&
        (e.getBufferArray = async (r, t, i) => {
          let a = null;
          if (!isNaN(r + t + i)) {
            let n = re(e.URLtemplateArray(r, t, i), r, t, i, e),
              l = { highest: e.highest, lowest: e.lowest, offset: e.offset };
            a = await me({ url: n })
              .then((f) =>
                V(
                  f,
                  l,
                  { width: e.heightMapWidth, height: e.heightMapHeight },
                  e.formatArray
                )
              )
              .catch(
                () => new Int16Array(e.heightMapWidth * e.heightMapHeight)
              );
          }
          return a;
        }),
      (e.GeometryCallback = async (r, t, i) => {
        let a;
        return (
          e.getBufferArray
            ? (a = await e.getBufferArray(r, t, i))
            : e.getBufferImage && (a = await e.getBufferImage(r, t, i)),
          a
        );
      });
  }
  function re(e, r, t, i, a) {
    let n = a.tilingScheme.tileXYToNativeRectangle(r, t, i),
      l = (n.east - n.west) / (a.heightMapWidth - 1),
      g = (n.north - n.south) / (a.heightMapHeight - 1);
    (n.west -= l * 0.5),
      (n.east += l * 0.5),
      (n.south -= g * 0.5),
      (n.north += g * 0.5);
    let d = a.tilingScheme.getNumberOfYTilesAtLevel(i) - t - 1;
    return e
      .replace("{south}", n.south.toString())
      .replace("{north}", n.north.toString())
      .replace("{west}", n.west.toString())
      .replace("{east}", n.east.toString())
      .replace("{x}", r.toString())
      .replace("{y}", t.toString())
      .replace("{tmsY}", d.toString());
  }
})();
