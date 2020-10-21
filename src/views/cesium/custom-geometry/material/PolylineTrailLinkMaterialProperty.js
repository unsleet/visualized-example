const Cesium = require('cesium/Cesium')
const POLYLINE_TRAIL_LINK_SOURCE = 'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                       {\n\
                                                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                            vec2 st = materialInput.st;\n\
                                                            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                            material.alpha = colorImage.a * color.a;\n\
                                                            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                            return material;\n\
                                                        }'
const POLYLINE_TRAIL_LINK_TYPE = 'PolylineTrailLink'
class PolylineTrailLinkMaterialProperty {
  constructor (color, duration, image) {
    this._definitionChanged = new Cesium.Event()
    this._colorSubscription = null
    this._color = undefined
    this.color = color;
    this._image = image
    this.duration = duration
    this._time = (new Date()).getTime()
    // 添加Material
    addMaterial()
  }
  getType () {
    return POLYLINE_TRAIL_LINK_TYPE
  }
  getValue (time, result) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color)
    result.image = this._image
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration
    return result
  }
  equals (other) {
    return this === other ||
      (other instanceof PolylineTrailLinkMaterialProperty && Cesium.Property.equals(this._color, other._color) && this._image === other._image)
  }
}
Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    }
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    }
  },
  color: Cesium.createPropertyDescriptor('color')
});
function addMaterial () {
  if (!Cesium.Material._materialCache.getMaterial(POLYLINE_TRAIL_LINK_TYPE)) {
    // material.alpha: 透明度; material.diffuse：颜色;
    Cesium.Material._materialCache.addMaterial(POLYLINE_TRAIL_LINK_TYPE, {
      fabric: {
        type: POLYLINE_TRAIL_LINK_TYPE,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
          image: '',
          time: 0
        },
        source: POLYLINE_TRAIL_LINK_SOURCE
      },
      translucent: function (material) {
        return true;
      }
    })
  }
}

export default PolylineTrailLinkMaterialProperty
