const Cesium = require('cesium/Cesium')
const GLOW_SOURCE = 'uniform vec4 color;\n\
                                    uniform float glowPower;\n\
                                    \n\
                                    varying float v_width;\n\
                                    \n\
                                    czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                    {\n\
                                        czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                    \n\
                                        vec2 st = materialInput.st;\n\
                                        float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);\n\
                                    \n\
                                        vec4 fragColor;\n\
                                        if(glow>1.0){\n\
                                        fragColor.rgb = vec3(0.0, 1.0, 0.0);\n\
                                        }else{\n\
                                        fragColor.rgb = vec3(1.0, 0.0, 0.0);\n\
                                        }\n\
                                        fragColor.a = min(1.0, glow) * color.a;\n\
                                        fragColor = czm_gammaCorrect(fragColor);\n\
                                    \n\
                                        material.emission = fragColor.rgb;\n\
                                        material.alpha = fragColor.a;\n\
                                    \n\
                                        return material;\n\
                                    }\n\
                                    '
const GLOW_TYPE = 'UnGlow'
const defaultColor = Cesium.Color.RED
const defaultGlowPower = 0.25
class GlowMaterialProperty {
  constructor (options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this._glowPower = undefined;
    this._glowPowerSubscription = undefined;
    this._taperPower = undefined;
    this._taperPowerSubscription = undefined;

    this.color = options.color;
    this.glowPower = options.glowPower;
    this.taperPower = options.taperPower;
    // 添加Material
    addMaterial()
  }
  getType () {
    return GLOW_TYPE
  }
  getValue (time, result) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color)
    result.glowPower = Cesium.Property.getValueOrDefault(this._glowPower, time, defaultGlowPower, result.glowPower)
    return result
  }
  equals (other) {
    return this === other ||
    (other instanceof Cesium.GlowMaterialProperty &&
      Cesium.Property.equals(this._color, other._color) &&
      Cesium.Property.equals(this._glowPower, other._glowPower))
  }
}
Object.defineProperties(GlowMaterialProperty.prototype, {
  isConstant : {
    get : function() {
      return Cesium.Property.isConstant(this._color) && Cesium.Property.isConstant(this._glow);
    }
  },
  definitionChanged : {
    get : function() {
      return this._definitionChanged;
    }
  },
  color: Cesium.createPropertyDescriptor('color'),
  glowPower: Cesium.createPropertyDescriptor('glowPower')
});
function addMaterial () {
  if (!Cesium.Material._materialCache.getMaterial(GLOW_TYPE)) {
    // material.alpha: 透明度; material.diffuse：颜色;
    Cesium.Material._materialCache.addMaterial(GLOW_TYPE, {
      fabric: {
        type: GLOW_TYPE,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
          glowPower: 0.6
        },
        source: GLOW_SOURCE
      },
      translucent: function (material) {
        return true;
      }
    })
  }
}

export default GlowMaterialProperty
