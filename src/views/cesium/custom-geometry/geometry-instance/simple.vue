<template>
  <div id="cesiumContainer" class="adjustment-container" />
</template>
<script>
const Cesium = require('cesium/Cesium')
import 'cesium/Widgets/widgets.css'
export default {
  name: 'TerrainImagery',
  mounted() {
    window.viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      }),
      baseLayerPicker: false,
      geocoder: false
    })
    this.createEntity()
  },
  methods: {
    createEntity() {
      const solidWhite = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
      const rectangle = Cesium.Rectangle.fromDegrees(-92.0, 20.0, -86.0, 27.0)
      const rectangleInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: rectangle,
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
          stRotation: Cesium.Math.toRadians(45)
        })
      })
      const rectangleOutlineInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleOutlineGeometry({
          rectangle: rectangle
        }),
        attributes: {
          color: solidWhite
        }
      })
      const positions = Cesium.Cartesian3.fromDegreesArray([-107.0, 27.0, -107.0, 22.0, -102.0, 23.0, -97.0, 21.0, -97.0, 25.0])
      const polygonInstance = new Cesium.GeometryInstance({
        geometry: Cesium.PolygonGeometry.fromPositions({
          positions: positions,
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
      })

      let center = Cesium.Cartesian3.fromDegrees(-80.0, 25.0)
      const semiMinorAxis = 300000.0
      const semiMajorAxis = 500000.0
      const rotation = Cesium.Math.toRadians(-40.0)
      const ellipseInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.EllipseGeometry({
          center: center,
          semiMinorAxis: semiMinorAxis,
          semiMajorAxis: semiMajorAxis,
          rotation: rotation,
          stRotation: Cesium.Math.toRadians(22),
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
      })

      center = Cesium.Cartesian3.fromDegrees(-72.0, 25.0)
      const radius = 250000.0
      const circleInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.CircleGeometry({
          center: center,
          radius: radius,
          stRotation: Cesium.Math.toRadians(90),
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
      })
      const circleOutlineInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.CircleOutlineGeometry({
          center: center,
          radius: radius
        }),
        attributes: {
          color: solidWhite
        }
      })

      const polygonOutlineInstance = new Cesium.GeometryInstance({
        geometry: Cesium.PolygonOutlineGeometry.fromPositions({
          positions: positions
        }),
        attributes: {
          color: solidWhite
        }
      })
      const ellipseOutlineInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.EllipseOutlineGeometry({
          center: center,
          semiMinorAxis: semiMinorAxis,
          semiMajorAxis: semiMajorAxis,
          rotation: rotation
        }),
        attributes: {
          color: solidWhite
        }
      })

      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [rectangleInstance, polygonInstance, ellipseInstance, circleInstance],
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          material: Cesium.Material.fromType('Stripe')
        })
      }))

      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [rectangleOutlineInstance, polygonOutlineInstance, ellipseOutlineInstance, circleOutlineInstance],
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          translucent: false,
          renderState: {
            lineWidth: Math.min(4.0, window.viewer.scene.maximumAliasedLineWidth)
          }
        })
      }))
    }
  }
}
</script>
