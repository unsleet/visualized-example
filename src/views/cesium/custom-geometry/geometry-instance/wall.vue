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
      let positions = Cesium.Cartesian3.fromDegreesArrayHeights([-90.0, 43.0, 100000.0, -87.5, 45.0, 100000.0, -85.0, 43.0, 100000.0, -87.5, 41.0, 100000.0, -90.0, 43.0, 100000.0])

      const wallInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.WallGeometry({
          positions: positions
        })
      });
      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: wallInstance,
        appearance: new Cesium.MaterialAppearance({
          material: Cesium.Material.fromType('Checkerboard', {
            repeat: new Cesium.Cartesian2(20.0, 6.0)
          })
        })
      }))
      positions = Cesium.Cartesian3.fromDegreesArray([-120.0, 45.0, -125.0, 50.0, -125.0, 55.0])

      const width = 100000
      const corridor = new Cesium.GeometryInstance({
        geometry: new Cesium.CorridorGeometry({
          positions: positions,
          width: width,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
            alpha: 1.0
          }))
        }
      })
      const extrudedCorridor = new Cesium.GeometryInstance({
        geometry: new Cesium.CorridorGeometry({
          positions: positions,
          width: width,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          height: 300000,
          extrudedHeight: 400000
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
            alpha: 0.7
          }))
        }
      })
      const corridorOutline = new Cesium.GeometryInstance({
        geometry: new Cesium.CorridorOutlineGeometry({
          positions: positions,
          width: width,
          height: 700000
        }),
        attributes: {
          color: solidWhite
        }
      })
      const corridorFill = new Cesium.GeometryInstance({
        geometry: new Cesium.CorridorGeometry({
          positions: positions,
          width: width,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          height: 700000
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
            alpha: 0.7
          }))
        }
      })

      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [corridor, extrudedCorridor, corridorFill],
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          closed: true
        })
      }));
      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: corridorOutline,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          translucent: false,
          renderState: {
            lineWidth: Math.min(4.0, scene.maximumAliasedLineWidth)
          }
        })
      }));

      function starPositions(arms, rOuter, rInner) {
        var angle = Math.PI / arms;
        var pos = [];
        for (var i = 0; i < 2 * arms; i++) {
          var r = (i % 2) === 0 ? rOuter : rInner
          var p = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
          pos.push(p)
        }
        return pos
      }

      positions = Cesium.Cartesian3.fromDegreesArrayHeights([-102.0, 15.0, 100000.0, -105.0, 20.0, 200000.0, -110.0, 20.0, 100000.0])
      const polylineVolumeFill = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineVolumeGeometry({
          polylinePositions: positions,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          shapePositions: starPositions(7, 30000.0, 20000.0)
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
            alpha: 1.0
          }))
        }
      })

      const polylineVolumeOutline = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineVolumeOutlineGeometry({
          polylinePositions: positions,
          shapePositions: starPositions(7, 30000.0, 20000.0)
        }),
        attributes: {
          color: solidWhite
        }
      })
      const polylineVolume = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineVolumeGeometry({
          polylinePositions: Cesium.Cartesian3.fromDegreesArray([-102.0, 15.0, -105.0, 20.0, -110.0, 20.0]),
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          shapePositions: starPositions(7, 30000, 20000)
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
            alpha: 1.0
          }))
        }
      })

      function computeCircle(radius) {
        var positions = []
        for (var i = 0; i < 360; i++) {
          var radians = Cesium.Math.toRadians(i)
          positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)))
        }
        return positions
      }
      const tubeGeometry = new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineVolumeGeometry({
          polylinePositions: Cesium.Cartesian3.fromDegreesArray([-104.0, 13.0, -107.0, 18.0, -112.0, 18.0]),
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          shapePositions: computeCircle(40000.0)
        }),
        attributes: {
          color: solidWhite
        }
      })
      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: [tubeGeometry, polylineVolume, polylineVolumeFill],
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: false,
          closed: true
        })
      }))
      window.viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: polylineVolumeOutline,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          translucent: false,
          renderState: {
            lineWidth: 1.0
          }
        })
      }))
    }
  }
}
</script>
